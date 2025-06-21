
import { useQuery } from "@tanstack/react-query";

// Types for the new Quran API
export interface QuranApiVerse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  text_simple: string;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  page_number: number;
  words: Array<{
    id: number;
    position: number;
    text_uthmani: string;
    text_simple: string;
    page_number: number;
    line_number: number;
    audio_url?: string;
  }>;
}

export interface QuranApiChapter {
  id: number;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface QuranApiChapterResponse {
  chapter: QuranApiChapter;
  verses: QuranApiVerse[];
  pagination: {
    per_page: number;
    current_page: number;
    next_page?: number;
    prev_page?: number;
    total_pages: number;
    total_records: number;
  };
}

export interface QuranApiChaptersResponse {
  chapters: QuranApiChapter[];
}

// Fallback types for alquran.cloud API
interface AlQuranCloudVerse {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

interface AlQuranCloudSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: AlQuranCloudVerse[];
}

interface AlQuranCloudResponse {
  code: number;
  status: string;
  data: {
    surahs: AlQuranCloudSurah[];
  };
}

// Base URLs
const QURAN_API_BASE = "https://api.quranapi.pages.dev";
const FALLBACK_API_BASE = "https://api.alquran.cloud/v1";

// محسن fetch function مع retry logic
const fetchWithRetry = async (url: string, options: RequestInit = {}, maxRetries: number = 3): Promise<Response> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`محاولة ${attempt} لتحميل البيانات من: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`المحاولة ${attempt} فشلت:`, lastError.message);
      
      if (attempt < maxRetries) {
        // انتظار قبل المحاولة التالية
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError!;
};

// Convert AlQuran.cloud data to our format
const convertAlQuranCloudToOurFormat = (data: AlQuranCloudResponse): QuranApiChaptersResponse => {
  const chapters = data.data.surahs.map(surah => ({
    id: surah.number,
    name_simple: surah.englishName,
    name_complex: surah.englishName,
    name_arabic: surah.name,
    revelation_place: surah.revelationType.toLowerCase(),
    revelation_order: surah.number,
    bismillah_pre: surah.number !== 1 && surah.number !== 9,
    verses_count: surah.ayahs.length,
    pages: [],
    translated_name: {
      language_name: "arabic",
      name: surah.englishNameTranslation
    }
  }));
  
  return { chapters };
};

const convertAlQuranCloudChapterToOurFormat = (surah: AlQuranCloudSurah): QuranApiChapterResponse => {
  const chapter: QuranApiChapter = {
    id: surah.number,
    name_simple: surah.englishName,
    name_complex: surah.englishName,
    name_arabic: surah.name,
    revelation_place: surah.revelationType.toLowerCase(),
    revelation_order: surah.number,
    bismillah_pre: surah.number !== 1 && surah.number !== 9,
    verses_count: surah.ayahs.length,
    pages: [],
    translated_name: {
      language_name: "arabic",
      name: surah.englishNameTranslation
    }
  };

  const verses: QuranApiVerse[] = surah.ayahs.map(ayah => ({
    id: ayah.numberInSurah,
    verse_key: `${surah.number}:${ayah.numberInSurah}`,
    text_uthmani: ayah.text,
    text_simple: ayah.text,
    juz_number: ayah.juz,
    h

_number: ayah.hizbQuarter,
    rub_number: ayah.ruku,
    page_number: ayah.page,
    words: []
  }));

  return {
    chapter,
    verses,
    pagination: {
      per_page: verses.length,
      current_page: 1,
      total_pages: 1,
      total_records: verses.length
    }
  };
};

// Fetch all chapters with enhanced error handling and fallback
export const fetchQuranApiChapters = async (): Promise<QuranApiChaptersResponse> => {
  try {
    console.log("محاولة تحميل البيانات من API الأساسي...");
    const response = await fetchWithRetry(`${QURAN_API_BASE}/chapters`);
    const data = await response.json();
    console.log("تم تحميل البيانات من API الأساسي بنجاح");
    return data;
  } catch (error) {
    console.log("فشل API الأساسي، استخدام API البديل...", error);
    
    try {
      const response = await fetchWithRetry(`${FALLBACK_API_BASE}/quran/quran-uthmani`);
      const data: AlQuranCloudResponse = await response.json();
      
      if (data.code !== 200 || !data.data || !data.data.surahs) {
        throw new Error('Invalid response structure from fallback API');
      }
      
      console.log("تم تحميل البيانات من API البديل بنجاح");
      return convertAlQuranCloudToOurFormat(data);
    } catch (fallbackError) {
      console.error("فشل في جميع مصادر البيانات:", fallbackError);
      throw new Error(`فشل في تحميل قائمة السور: ${fallbackError.message}`);
    }
  }
};

// Fetch specific chapter with verses and enhanced error handling
export const fetchQuranApiChapter = async (chapterId: number): Promise<QuranApiChapterResponse> => {
  if (chapterId < 1 || chapterId > 114) {
    throw new Error(`رقم السورة غير صحيح: ${chapterId}`);
  }
  
  try {
    console.log(`محاولة تحميل السورة ${chapterId} من API الأساسي...`);
    const response = await fetchWithRetry(`${QURAN_API_BASE}/chapters/${chapterId}/verses`);
    const data = await response.json();
    
    if (!data.chapter || !data.verses) {
      throw new Error('Invalid response structure from primary API');
    }
    
    console.log(`تم تحميل السورة ${chapterId} من API الأساسي بنجاح`);
    return data;
  } catch (error) {
    console.log(`فشل API الأساسي للسورة ${chapterId}، استخدام API البديل...`, error);
    
    try {
      const response = await fetchWithRetry(`${FALLBACK_API_BASE}/quran/quran-uthmani`);
      const data: AlQuranCloudResponse = await response.json();
      
      if (data.code !== 200 || !data.data || !data.data.surahs) {
        throw new Error('Invalid response structure from fallback API');
      }
      
      const surah = data.data.surahs.find(s => s.number === chapterId);
      if (!surah) {
        throw new Error(`السورة ${chapterId} غير موجودة`);
      }
      
      console.log(`تم تحميل السورة ${chapterId} من API البديل بنجاح`);
      return convertAlQuranCloudChapterToOurFormat(surah);
    } catch (fallbackError) {
      console.error(`فشل في تحميل السورة ${chapterId} من جميع المصادر:`, fallbackError);
      throw new Error(`فشل في تحميل السورة ${chapterId}: ${fallbackError.message}`);
    }
  }
};

// React Query hooks with enhanced error handling
export const useQuranApiChapters = () => {
  return useQuery({
    queryKey: ["quranapi-chapters"],
    queryFn: fetchQuranApiChapters,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useQuranApiChapter = (chapterId: number) => {
  return useQuery({
    queryKey: ["quranapi-chapter", chapterId],
    queryFn: () => fetchQuranApiChapter(chapterId),
    enabled: chapterId > 0 && chapterId <= 114,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
