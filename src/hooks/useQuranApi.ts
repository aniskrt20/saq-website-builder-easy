
import { useState, useCallback } from 'react';

interface Ayah {
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

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

const SURAH_NAMES = [
  'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال',
  'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل',
  'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون', 'النور',
  'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان', 'السجدة',
  'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
  'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح',
  'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة',
  'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون', 'التغابن',
  'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن',
  'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
  'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية',
  'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق',
  'القدر', 'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة',
  'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص',
  'الفلق', 'الناس'
];

// قائمة القراء مع روابط صحيحة
const RECITERS = [
  { folder: 'Maher_AlMuaiqly_128kbps', name: 'ماهر المعيقلي' },
  { folder: 'Abdul_Basit_Murattal_192kbps', name: 'عبد الباسط عبد الصمد' },
  { folder: 'Minshawi_Murattal_128kbps', name: 'محمد صديق المنشاوي' },
  { folder: 'Saood_ash-Shuraym_128kbps', name: 'سعود الشريم' },
  { folder: 'Shatri_128kbps', name: 'أبو بكر الشاطري' },
  { folder: 'Husary_128kbps', name: 'محمود خليل الحصري' },
  { folder: 'AbdurRahman_As-Sudais_192kbps', name: 'عبد الرحمن السديس' },
  { folder: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net', name: 'أحمد بن علي العجمي' },
  { folder: 'Muhammadayyoub_128kbps', name: 'محمد أيوب' },
  { folder: 'Ghamadi_40kbps', name: 'سعد الغامدي' },
  { folder: 'Yasser_Ad-Dussary_128kbps', name: 'ياسر الدوسري' },
  { folder: 'Nasser_Alqatami_128kbps', name: 'ناصر القطامي' },
  { folder: 'Salah_Al_Budair_128kbps', name: 'صلاح البدير' },
  { folder: 'Abdullah_Basfar_192kbps', name: 'عبد الله بصفر' },
  { folder: 'bandar_balilah_64kbps', name: 'بندر بليلة' },
  { folder: 'Fares_Abbad_64kbps', name: 'فارس عباد' },
  { folder: 'Hani_ar-Rifai_192kbps', name: 'هاني الرفاعي' },
  { folder: 'MaherAlMuaiqly128kbps', name: 'ماهر المعيقلي (بديل)' },
  { folder: 'Alafasy_128kbps', name: 'مشاري العفاسي' },
  { folder: 'Hudhaify_128kbps', name: 'علي الحذيفي' }
];

// مصادر الصوت البديلة
const AUDIO_SOURCES = [
  'https://cdn.islamic.network/quran/audio-surah/128/',
  'https://server8.mp3quran.net/afs/',
  'https://audio.quran.com/'
];

export const useQuranApi = () => {
  const [surahData, setSurahData] = useState<Surah | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSurahByNumber = useCallback(async (surahNumber: number) => {
    if (surahNumber < 1 || surahNumber > 114) {
      setError('رقم السورة غير صحيح');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
      
      if (!response.ok) {
        throw new Error('فشل في تحميل السورة');
      }

      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        setSurahData(data.data);
      } else {
        throw new Error('بيانات السورة غير صحيحة');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      console.error('Error fetching surah:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تحسين روابط الصوت للسور
  const getSurahAudioUrl = useCallback((reciterFolder: string, surahNumber: number) => {
    const paddedSurahNumber = surahNumber.toString().padStart(3, '0');
    
    // استخدام مصدر صوتي موثوق
    if (reciterFolder === 'Maher_AlMuaiqly_128kbps') {
      return `https://cdn.islamic.network/quran/audio-surah/128/ar.maheralmaeqly/${paddedSurahNumber}.mp3`;
    } else if (reciterFolder === 'Abdul_Basit_Murattal_192kbps') {
      return `https://cdn.islamic.network/quran/audio-surah/128/ar.abdulbasitmurattal/${paddedSurahNumber}.mp3`;
    } else if (reciterFolder === 'Minshawi_Murattal_128kbps') {
      return `https://cdn.islamic.network/quran/audio-surah/128/ar.minshawi/${paddedSurahNumber}.mp3`;
    } else if (reciterFolder === 'Alafasy_128kbps') {
      return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${paddedSurahNumber}.mp3`;
    } else if (reciterFolder === 'Husary_128kbps') {
      return `https://cdn.islamic.network/quran/audio-surah/128/ar.husary/${paddedSurahNumber}.mp3`;
    }
    
    // رابط افتراضي
    return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${paddedSurahNumber}.mp3`;
  }, []);

  // تحسين روابط الصوت للآيات
  const getAyahAudioUrl = useCallback((reciterFolder: string, ayahNumber: number) => {
    const paddedAyahNumber = ayahNumber.toString().padStart(6, '0');
    
    // استخدام مصدر صوتي موثوق للآيات
    if (reciterFolder === 'Maher_AlMuaiqly_128kbps') {
      return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${paddedAyahNumber}.mp3`;
    } else if (reciterFolder === 'Abdul_Basit_Murattal_192kbps') {
      return `https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal/${paddedAyahNumber}.mp3`;
    } else if (reciterFolder === 'Alafasy_128kbps') {
      return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${paddedAyahNumber}.mp3`;
    }
    
    // رابط افتراضي
    return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${paddedAyahNumber}.mp3`;
  }, []);

  const getSurahName = useCallback((surahNumber: number) => {
    if (surahNumber < 1 || surahNumber > 114) return 'غير محدد';
    return SURAH_NAMES[surahNumber - 1];
  }, []);

  const getReciters = useCallback(() => {
    return RECITERS;
  }, []);

  const getReciterName = useCallback((reciterFolder: string) => {
    const reciter = RECITERS.find(r => r.folder === reciterFolder);
    return reciter ? reciter.name : 'قارئ غير محدد';
  }, []);

  // فحص توفر الصوت
  const checkAudioAvailability = useCallback(async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  return {
    surahData,
    isLoading,
    error,
    getSurahByNumber,
    getSurahAudioUrl,
    getAyahAudioUrl,
    getSurahName,
    getReciters,
    getReciterName,
    checkAudioAvailability
  };
};
