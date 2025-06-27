
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

// القراء حسب everyayah.com API
const RECITERS = [
  { folder: 'Alafasy_128kbps', name: 'ماهر المعيقلي' },
  { folder: 'Abdul_Basit_Murattal_192kbps', name: 'عبد الباسط عبد الصمد (مرتل)' },
  { folder: 'Minshawi_Murattal_128kbps', name: 'محمد صديق المنشاوي (مرتل)' },
  { folder: 'Hudhaify_128kbps', name: 'علي الحذيفي' },
  { folder: 'Shatri_128kbps', name: 'أبو بكر الشاطري' },
  { folder: 'Saood_ash-Shuraym_128kbps', name: 'سعود الشريم' },
  { folder: 'AbdurRahman_As-Sudais_192kbps', name: 'عبد الرحمن السديس' },
  { folder: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net', name: 'أحمد بن علي العجمي' },
  { folder: 'Husary_128kbps', name: 'خليل الحصري' },
  { folder: 'Muhammadayyoub_128kbps', name: 'محمد أيوب' },
  { folder: 'Ghamadi_40kbps', name: 'سعد الغامدي' },
  { folder: 'Salah_Al_Budair_128kbps', name: 'صلاح البدير' },
  { folder: 'Abdullah_Basfar_192kbps', name: 'عبد الله بصفر' },
  { folder: 'Abdullah_Awad_Al-Juhani_128kbps', name: 'عبد الله الجهني' },
  { folder: 'Fares_Abbad_64kbps', name: 'فارس عباد' },
  { folder: 'Yasser_Ad-Dussary_128kbps', name: 'ياسر الدوسري' },
  { folder: 'Wadee_Hammadi_al-Yamani_128kbps', name: 'وديع اليمني' },
  { folder: 'Abdullah_Al-Matrood_128kbps', name: 'عبد الله المطرود' },
  { folder: 'bandar_balilah_64kbps', name: 'بندر بليلة' },
  { folder: 'Khalil_al_Husary_64kbps', name: 'خليل الحصري (مجود)' },
  { folder: 'AbdulBaset_AbdulSamad_Mujawwad_128kbps', name: 'عبد الباسط عبد الصمد (مجود)' },
  { folder: 'Minshawi_Mujawwad_192kbps', name: 'محمد صديق المنشاوي (مجود)' },
  { folder: 'Muhammad_Jibreel_128kbps', name: 'محمد جبريل' },
  { folder: 'nasser_bin_ali_alqatami_128kbps', name: 'ناصر القطامي' },
  { folder: 'AbdulSamad_64kbps_QuranCentral.com', name: 'عبد الصمد' },
  { folder: 'Ayyub_128kbps', name: 'محمد أيوب (جودة عالية)' },
  { folder: 'Ibrahim_Walk_192kbps', name: 'إبراهيم الأخضر' },
  { folder: 'Hani_ar-Rifai_192kbps', name: 'هاني الرفاعي' },
  { folder: 'Abdurrahmaan_As-Sudais_64kbps', name: 'عبد الرحمن السديس (64k)' },
  { folder: 'Minshawy_Teacher_128kbps', name: 'المنشاوي (تعليمي)' }
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

  // تحسين روابط الصوت للسور باستخدام everyayah.com
  const getSurahAudioUrl = useCallback((reciterFolder: string, surahNumber: number) => {
    const paddedSurahNumber = surahNumber.toString().padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/${reciterFolder}/${paddedSurahNumber}.mp3`;
    
    console.log('Surah audio URL:', audioUrl);
    return audioUrl;
  }, []);

  // تحسين روابط الصوت للآيات باستخدام everyayah.com
  const getAyahAudioUrl = useCallback((reciterFolder: string, ayahNumber: number) => {
    const paddedAyahNumber = ayahNumber.toString().padStart(6, '0');
    const audioUrl = `https://everyayah.com/data/${reciterFolder}/${paddedAyahNumber}.mp3`;
    
    console.log('Ayah audio URL:', audioUrl);
    return audioUrl;
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

  return {
    surahData,
    isLoading,
    error,
    getSurahByNumber,
    getSurahAudioUrl,
    getAyahAudioUrl,
    getSurahName,
    getReciters,
    getReciterName
  };
};
