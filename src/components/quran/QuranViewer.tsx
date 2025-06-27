
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2 } from 'lucide-react';
import { useQuranApi } from '@/hooks/useQuranApi';
import { toast } from 'sonner';

interface QuranViewerProps {
  surah: number;
  page: number;
  reciter: string;
  showAudio: boolean;
  onPageChange: (page: number) => void;
}

export const QuranViewer: React.FC<QuranViewerProps> = ({
  surah,
  page,
  reciter,
  showAudio,
  onPageChange
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { 
    surahData, 
    isLoading, 
    error,
    getSurahByNumber,
    getAyahAudioUrl 
  } = useQuranApi();

  useEffect(() => {
    getSurahByNumber(surah);
  }, [surah]);

  const handlePageFlip = (direction: 'next' | 'prev') => {
    setIsFlipping(true);
    
    setTimeout(() => {
      if (direction === 'next') {
        onPageChange(page + 1);
      } else {
        onPageChange(Math.max(1, page - 1));
      }
      setIsFlipping(false);
    }, 300);
  };

  const playAyah = async (ayahNumber: number) => {
    try {
      if (playingAyah === ayahNumber) {
        // إيقاف التشغيل
        if (audioRef.current) {
          audioRef.current.pause();
          setPlayingAyah(null);
        }
        return;
      }

      const audioUrl = getAyahAudioUrl(reciter, ayahNumber);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingAyah(ayahNumber);
        
        audioRef.current.onended = () => {
          setPlayingAyah(null);
        };
      }
    } catch (error) {
      toast.error('فشل في تشغيل الآية');
      console.error('Audio playback error:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="mushaf-page min-h-[600px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 arabic-text">جاري تحميل السورة...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mushaf-page min-h-[600px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 arabic-text">حدث خطأ في تحميل السورة</p>
          <Button onClick={() => getSurahByNumber(surah)} variant="outline">
            إعادة المحاولة
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* الصفحة */}
      <Card className={`mushaf-page transition-all duration-300 ${isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        <div className="p-8">
          
          {/* رأس السورة */}
          {surahData && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full border border-amber-200">
                <Badge variant="outline" className="bg-white">
                  {surahData.number}
                </Badge>
                <h2 className="text-2xl font-bold arabic-text text-amber-800">
                  سورة {surahData.name}
                </h2>
                <span className="text-sm text-gray-600">
                  {surahData.numberOfAyahs} آية
                </span>
              </div>
              
              {surah !== 1 && surah !== 9 && (
                <div className="mt-6 mb-8">
                  <p className="text-2xl arabic-text text-center text-amber-700 leading-relaxed">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}
            </div>
          )}

          {/* الآيات */}
          <div className="space-y-6">
            {surahData?.ayahs?.map((ayah, index) => (
              <div key={ayah.number} className="mushaf-verse group">
                <div className="flex items-start gap-4">
                  
                  {/* رقم الآية */}
                  <div className="verse-number flex-shrink-0">
                    {ayah.numberInSurah}
                  </div>
                  
                  {/* نص الآية */}
                  <div className="flex-1">
                    <p className="text-xl arabic-text leading-relaxed text-gray-800 text-shadow mb-3">
                      {ayah.text}
                    </p>
                    
                    {/* أزرار التحكم */}
                    {showAudio && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => playAyah(ayah.number)}
                          className="h-8 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        >
                          {playingAyah === ayah.number ? (
                            <Pause className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </Button>
                        <span className="text-xs text-gray-500">
                          استمع للآية
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {index < surahData.ayahs.length - 1 && (
                  <div className="verse-separator mt-4"></div>
                )}
              </div>
            ))}
          </div>
          
        </div>
      </Card>

      {/* أزرار التنقل */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={() => handlePageFlip('prev')}
          disabled={page <= 1 || isFlipping}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ChevronRight className="w-4 h-4" />
          الصفحة السابقة
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>صفحة {page}</span>
        </div>
        
        <Button
          onClick={() => handlePageFlip('next')}
          disabled={isFlipping}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          الصفحة التالية
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* مشغل الصوت المخفي */}
      <audio ref={audioRef} />
    </div>
  );
};
