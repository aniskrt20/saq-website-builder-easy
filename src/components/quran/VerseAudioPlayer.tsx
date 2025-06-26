
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

  // Calculate global ayah number for the verse
  const calculateGlobalAyahNumber = (surahNum: number, verseNum: number) => {
    // Array of verse counts for each surah
    const surahVerseCounts = [
      7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
      112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53,
      89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12,
      12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26,
      30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6
    ];
    
    let globalAyahNumber = 0;
    
    // Sum up all verses from surahs before the current one
    for (let i = 0; i < surahNum - 1; i++) {
      globalAyahNumber += surahVerseCounts[i];
    }
    
    // Add the current verse number
    globalAyahNumber += verseNum;
    
    return globalAyahNumber;
  };

  const getVerseAudioUrl = (reciterId: number, surahNum: number, verseNum: number) => {
    const selectedReciter = reciters?.find(r => r.id === reciterId);
    const globalAyahNumber = calculateGlobalAyahNumber(surahNum, verseNum);
    
    // Use Islamic Network CDN for verse audio
    const bitrate = 128; // Default bitrate
    const edition = "ar.alafasy"; // Default edition
    
    const islamicNetworkUrl = `https://cdn.islamic.network/quran/audio/${bitrate}/${edition}/${globalAyahNumber}.mp3`;
    
    console.log(`Using Islamic Network CDN for verse ${surahNum}:${verseNum} (global ${globalAyahNumber}): ${islamicNetworkUrl}`);
    
    return islamicNetworkUrl;
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
      
      console.log(`Playing individual verse audio: ${audioUrl}`);
      
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
        
        // Try alternative source with different bitrate
        const alternativeUrl = `https://cdn.islamic.network/quran/audio/64/ar.alafasy/${calculateGlobalAyahNumber(surahNumber, verseNumber)}.mp3`;
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
