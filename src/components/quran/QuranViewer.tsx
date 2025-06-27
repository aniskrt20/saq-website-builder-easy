
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause } from 'lucide-react';
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
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { 
    surahData, 
    isLoading, 
    error,
    getSurahByNumber,
    getAyahAudioUrl 
  } = useQuranApi();

  useEffect(() => {
    console.log('Loading surah:', surah);
    getSurahByNumber(surah);
  }, [surah, getSurahByNumber]);

  const playAyah = async (ayahNumber: number) => {
    console.log('Playing ayah:', ayahNumber, 'with reciter:', reciter);
    
    try {
      if (playingAyah === ayahNumber) {
        if (audioRef.current) {
          audioRef.current.pause();
          setPlayingAyah(null);
        }
        return;
      }

      setAudioLoading(true);
      const audioUrl = getAyahAudioUrl(reciter, ayahNumber);
      console.log('Audio URL:', audioUrl);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        
        audioRef.current.onloadedmetadata = () => {
          console.log('Ayah audio metadata loaded');
          setAudioLoading(false);
        };
        
        audioRef.current.oncanplaythrough = async () => {
          console.log('Ayah audio can play through');
          try {
            await audioRef.current?.play();
            setPlayingAyah(ayahNumber);
          } catch (playError) {
            console.error('Play error:', playError);
            setPlayingAyah(null);
            toast.error('فشل في تشغيل الآية');
          }
        };
        
        audioRef.current.onended = () => {
          console.log('Ayah audio ended');
          setPlayingAyah(null);
        };
        
        audioRef.current.onerror = (e) => {
          console.error('Ayah audio error:', e);
          setAudioLoading(false);
          setPlayingAyah(null);
          
          // محاولة مع رابط بديل
          const backupUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber.toString().padStart(6, '0')}.mp3`;
          console.log('Trying backup URL:', backupUrl);
          
          if (audioRef.current) {
            audioRef.current.src = backupUrl;
            audioRef.current.load();
          }
        };
        
        audioRef.current.load();
      }
    } catch (error) {
      console.error('Error in playAyah:', error);
      setAudioLoading(false);
      toast.error('فشل في تشغيل الآية');
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
      <Card className="mushaf-page">
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
                  
                  <div className="verse-number flex-shrink-0">
                    {ayah.numberInSurah}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-xl arabic-text leading-relaxed text-gray-800 text-shadow mb-3">
                      {ayah.text}
                    </p>
                    
                    {showAudio && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => playAyah(ayah.number)}
                          className="h-8 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          disabled={audioLoading && playingAyah === ayah.number}
                        >
                          {audioLoading && playingAyah === ayah.number ? (
                            <div className="animate-spin w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full"></div>
                          ) : playingAyah === ayah.number ? (
                            <Pause className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </Button>
                        <span className="text-xs text-gray-500">
                          {playingAyah === ayah.number ? 'جاري التشغيل...' : 'استمع للآية'}
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

      <audio ref={audioRef} preload="none" crossOrigin="anonymous" />
    </div>
  );
};
