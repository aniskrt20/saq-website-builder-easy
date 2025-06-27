
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

const RECITER_NAMES: Record<string, string> = {
  'ar.alafasy': 'ماهر المعيقلي',
  'ar.abdulbasitmurattal': 'عبد الباسط عبد الصمد',
  'ar.minshawi': 'محمد صديق المنشاوي',
  'ar.muhammadayyoub': 'محمد أيوب',
  'ar.saoodshuraym': 'سعود الشريم',
  'ar.ahmedajamy': 'أحمد بن علي العجمي',
  'ar.husary': 'خليل الحصري',
  'ar.sudais': 'عبد الرحمن السديس',
  'ar.shaatri': 'أبو بكر الشاطري',
  'ar.hani': 'هاني الرفاعي'
};

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

  const getSurahAudioUrl = useCallback((reciter: string, surahNumber: number, bitrate: number = 128) => {
    return `https://cdn.islamic.network/quran/audio-surah/${bitrate}/${reciter}/${surahNumber}.mp3`;
  }, []);

  const getAyahAudioUrl = useCallback((reciter: string, ayahNumber: number, bitrate: number = 128) => {
    return `https://cdn.islamic.network/quran/audio/${bitrate}/${reciter}/${ayahNumber}.mp3`;
  }, []);

  const getSurahName = useCallback((surahNumber: number) => {
    if (surahNumber < 1 || surahNumber > 114) return 'غير محدد';
    return SURAH_NAMES[surahNumber - 1];
  }, []);

  const getReciterName = useCallback((reciterCode: string) => {
    return RECITER_NAMES[reciterCode] || 'قارئ غير محدد';
  }, []);

  return {
    surahData,
    isLoading,
    error,
    getSurahByNumber,
    getSurahAudioUrl,
    getAyahAudioUrl,
    getSurahName,
    getReciterName
  };
};
