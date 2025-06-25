
import React, { useState, useRef } from "react";
import { Volume2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerseAudioPlayerProps {
  surahNumber: number;
  verseNumber: number;
  size?: "sm" | "md";
  selectedReciterId?: number;
}

const VerseAudioPlayer = ({ 
  surahNumber, 
  verseNumber, 
  size = "sm",
  selectedReciterId = 7 // Default: عبد الباسط عبد الصمد
}: VerseAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getVerseAudioUrl = (reciterId: number, surahNum: number, verseNum: number) => {
    const surahPadded = surahNum.toString().padStart(3, '0');
    const versePadded = verseNum.toString().padStart(3, '0');
    
    // Different audio sources based on reciter ID for individual verses
    switch (reciterId) {
      case 7: // عبد الباسط عبد الصمد
        return `https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/${surahPadded}${versePadded}.mp3`;
      case 1: // ماهر المعيقلي
        return `https://everyayah.com/data/Maher_AlMuaiqly_64kbps/${surahPadded}${versePadded}.mp3`;
      case 2: // مشاري راشد العفاسي
        return `https://everyayah.com/data/Alafasy_64kbps/${surahPadded}${versePadded}.mp3`;
      case 3: // سعد الغامدي
        return `https://everyayah.com/data/Saad_Al-Ghamdi_64kbps/${surahPadded}${versePadded}.mp3`;
      case 4: // أحمد العجمي
        return `https://everyayah.com/data/Ahmed_Al_Ajamy_64kbps/${surahPadded}${versePadded}.mp3`;
      case 5: // محمد صديق المنشاوي
        return `https://everyayah.com/data/Minshawy_Murattal_128kbps/${surahPadded}${versePadded}.mp3`;
      case 6: // عبد الرحمن السديس
        return `https://everyayah.com/data/AbdurRahman_As-Sudais_64kbps/${surahPadded}${versePadded}.mp3`;
      default:
        return `https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/${surahPadded}${versePadded}.mp3`;
    }
  };

  const handlePlayVerse = async () => {
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

      const audioUrl = getVerseAudioUrl(selectedReciterId, surahNumber, verseNumber);
      
      console.log(`Playing individual verse audio with reciter ${selectedReciterId}: ${audioUrl}`);
      
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
        console.error('Verse audio playback error:', e);
        setIsPlaying(false);
        setIsLoading(false);
        
        // Try alternative source for individual verse
        const alternativeUrl = `https://cdn.islamic.network/quran/audio/64/ar.abdulbasitmurattal/${surahNumber}/${verseNumber}.mp3`;
        console.log(`Trying alternative verse audio source: ${alternativeUrl}`);
        
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
          console.error('Alternative verse audio source also failed');
          setIsPlaying(false);
          setIsLoading(false);
        });
        
        alternativeAudio.play().catch(err => {
          console.error('Failed to play alternative verse audio:', err);
          setIsPlaying(false);
          setIsLoading(false);
        });
      });
      
      await audio.play();
      
    } catch (error) {
      console.error('Error playing verse audio:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const iconSize = size === "sm" ? 12 : 14;
  const buttonSize = size === "sm" ? "w-7 h-7 sm:w-8 sm:h-8" : "w-8 h-8 sm:w-10 sm:h-10";

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`${buttonSize} rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200`}
      onClick={handlePlayVerse}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : isPlaying ? (
        <Pause className="text-white" size={iconSize} />
      ) : (
        <Volume2 className="text-white" size={iconSize} />
      )}
    </Button>
  );
};

export default VerseAudioPlayer;
