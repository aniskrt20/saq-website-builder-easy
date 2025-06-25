import React, { useState, useRef } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReciterSelector from "./ReciterSelector";

interface SurahAudioPlayerProps {
  surahNumber: number;
  surahName: string;
  onReciterChange?: (reciterId: number) => void;
}

const SurahAudioPlayer = ({ surahNumber, surahName, onReciterChange }: SurahAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReciterId, setSelectedReciterId] = useState(1); // Default: عبد الباسط عبد الصمد
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudioUrl = (reciterId: number, surahNum: number) => {
    // أشهر القراء مع مصادر صوتية موثوقة
    switch (reciterId) {
      case 1: // عبد الباسط عبد الصمد
        return `https://server8.mp3quran.net/afs/${surahNum.toString().padStart(3, '0')}.mp3`;
      case 2: // ماهر المعيقلي  
        return `https://server12.mp3quran.net/maher/${surahNum.toString().padStart(3, '0')}.mp3`;
      case 3: // مشاري العفاسي
        return `https://server13.mp3quran.net/husr/${surahNum.toString().padStart(3, '0')}.mp3`;
      case 4: // سعد الغامدي
        return `https://server7.mp3quran.net/s_gmd/${surahNum.toString().padStart(3, '0')}.mp3`;
      case 5: // أحمد العجمي
        return `https://server10.mp3quran.net/ajm/${surahNum.toString().padStart(3, '0')}.mp3`;
      case 6: // محمد صديق المنشاوي
        return `https://server14.mp3quran.net/ms/${surahNum.toString().padStart(3, '0')}.mp3`;
      case 7: // عبد الرحمن السديس
        return `https://server11.mp3quran.net/sds/${surahNum.toString().padStart(3, '0')}.mp3`;
      case 8: // ياسر الدوسري
        return `https://server6.mp3quran.net/tbr/${surahNum.toString().padStart(3, '0')}.mp3`;
      case 9: // ناصر القطامي
        return `https://server9.mp3quran.net/qatami/${surahNum.toString().padStart(3, '0')}.mp3`;
      case 10: // خالد الجليل
        return `https://server5.mp3quran.net/jaleel/${surahNum.toString().padStart(3, '0')}.mp3`;
      default:
        return `https://server8.mp3quran.net/afs/${surahNum.toString().padStart(3, '0')}.mp3`;
    }
  };

  const handlePlaySurah = async () => {
    try {
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      setIsLoading(true);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audioUrl = getAudioUrl(selectedReciterId, surahNumber);
      
      console.log(`Playing full surah audio with reciter ${selectedReciterId}: ${audioUrl}`);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.addEventListener('loadstart', () => {
        setIsLoading(true);
      });
      
      audio.addEventListener('canplay', () => {
        setIsLoading(false);
        setIsPlaying(true);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setIsLoading(false);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Surah audio playback error:', e);
        setIsPlaying(false);
        setIsLoading(false);
        
        // Try alternative source
        const alternativeUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;
        console.log(`Trying alternative surah audio source: ${alternativeUrl}`);
        
        const alternativeAudio = new Audio(alternativeUrl);
        audioRef.current = alternativeAudio;
        
        alternativeAudio.addEventListener('canplay', () => {
          setIsLoading(false);
          setIsPlaying(true);
        });
        
        alternativeAudio.addEventListener('ended', () => {
          setIsPlaying(false);
          setIsLoading(false);
        });
        
        alternativeAudio.addEventListener('error', () => {
          console.error('Alternative surah audio source also failed');
          setIsPlaying(false);
          setIsLoading(false);
        });
        
        alternativeAudio.play().catch(err => {
          console.error('Failed to play alternative surah audio:', err);
          setIsPlaying(false);
          setIsLoading(false);
        });
      });
      
      await audio.play();
      
    } catch (error) {
      console.error('Error playing surah audio:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const handleReciterChange = (reciterId: number) => {
    // Stop current audio if playing
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setSelectedReciterId(reciterId);
    
    // Notify parent component about reciter change
    if (onReciterChange) {
      onReciterChange(reciterId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Reciter Selector */}
      <ReciterSelector 
        selectedReciterId={selectedReciterId}
        onReciterChange={handleReciterChange}
      />
      
      {/* Audio Player */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="lg"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
          onClick={handlePlaySurah}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <Pause className="text-white" size={16} />
          ) : (
            <Play className="text-white" size={16} />
          )}
        </Button>
        <div className="text-white">
          <p className="font-medium text-sm sm:text-base">تشغيل السورة كاملة</p>
          <p className="text-xs sm:text-sm text-white/80">{surahName}</p>
        </div>
      </div>
    </div>
  );
};

export default SurahAudioPlayer;
