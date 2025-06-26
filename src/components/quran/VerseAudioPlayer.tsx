
import React, { useState, useRef } from "react";
import { Volume2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReciters } from "@/services/api/reciterServices";

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
  selectedReciterId = 1
}: VerseAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { data: reciters } = useReciters({ language: "ar" });

  const getVerseAudioUrl = (reciterId: number, surahNum: number, verseNum: number) => {
    const selectedReciter = reciters?.find(r => r.id === reciterId);
    const surahPadded = surahNum.toString().padStart(3, '0');
    const versePadded = verseNum.toString().padStart(3, '0');
    
    if (selectedReciter && selectedReciter.moshaf && selectedReciter.moshaf.length > 0) {
      // Try to find a moshaf that supports individual verses (usually has "ayah" in the name or type)
      const verseMoshaf = selectedReciter.moshaf.find(m => 
        m.moshaf_type && 
        typeof m.moshaf_type === 'string' && 
        (m.moshaf_type.includes('ayah') || m.moshaf_type.includes('verse'))
      );
      
      if (verseMoshaf) {
        return `${verseMoshaf.server}${surahPadded}${versePadded}.mp3`;
      }
    }
    
    // Fallback to everyayah.com for individual verses
    return `https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/${surahPadded}${versePadded}.mp3`;
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
        const alternativeUrl = `https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/${surahNumber.toString().padStart(3, '0')}${verseNumber.toString().padStart(3, '0')}.mp3`;
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
