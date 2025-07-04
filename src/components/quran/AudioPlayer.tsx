
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Repeat
} from 'lucide-react';
import { useQuranApi } from '@/hooks/useQuranApi';
import { formatTime } from '@/utils/audioUtils';
import { toast } from 'sonner';

interface AudioPlayerProps {
  reciter: string;
  surah: number;
  onSurahChange: (surah: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  reciter,
  surah,
  onSurahChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { getSurahAudioUrl, getReciterName, getSurahName } = useQuranApi();

  useEffect(() => {
    loadSurah();
  }, [reciter, surah]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const loadSurah = async () => {
    if (!audioRef.current) return;

    setIsLoading(true);
    setIsPlaying(false);
    
    try {
      const audioUrl = getSurahAudioUrl(reciter, surah);
      console.log('Loading audio URL:', audioUrl);
      
      audioRef.current.src = audioUrl;
      
      // إعداد مستمعي الأحداث
      audioRef.current.onloadedmetadata = () => {
        console.log('Audio metadata loaded');
        setDuration(audioRef.current?.duration || 0);
        setIsLoading(false);
      };

      audioRef.current.oncanplaythrough = () => {
        console.log('Audio can play through');
        setIsLoading(false);
      };

      audioRef.current.onerror = (e) => {
        console.error('Audio loading error:', e);
        setIsLoading(false);
        toast.error('فشل في تحميل الصوت. جاري المحاولة مع مصدر آخر...');
        
        // محاولة مع رابط بديل
        setTimeout(() => {
          if (audioRef.current) {
            const backupUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah.toString().padStart(3, '0')}.mp3`;
            audioRef.current.src = backupUrl;
            audioRef.current.load();
          }
        }, 1000);
      };

      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        if (isRepeat) {
          audioRef.current?.play();
          setIsPlaying(true);
        }
      };

      audioRef.current.load();
    } catch (error) {
      setIsLoading(false);
      console.error('Error loading surah audio:', error);
      toast.error('حدث خطأ في تحميل الصوت');
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // التأكد من تحميل الصوت قبل التشغيل
        if (audioRef.current.readyState === 0) {
          setIsLoading(true);
          await new Promise((resolve) => {
            audioRef.current!.oncanplay = resolve;
          });
          setIsLoading(false);
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Play/pause error:', error);
      setIsLoading(false);
      toast.error('خطأ في تشغيل الصوت');
    }
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current || duration === 0) return;
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg arabic-text flex items-center justify-between">
          <span>مشغل التلاوة</span>
          <Badge variant="outline" className="bg-white">
            {getSurahName(surah)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* معلومات التلاوة */}
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-gray-800 arabic-text">
            سورة {getSurahName(surah)}
          </h3>
          <p className="text-sm text-gray-600">
            {getReciterName(reciter)}
          </p>
        </div>

        {/* شريط التقدم */}
        <div className="space-y-2">
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
            disabled={isLoading || duration === 0}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* أزرار التحكم الإضافية */}
        <div className="flex items-center justify-between">
          <Button
            onClick={toggleRepeat}
            variant="ghost"
            size="sm"
            className={`rounded-full w-8 h-8 p-0 ${isRepeat ? 'text-purple-600 bg-purple-100' : ''}`}
          >
            <Repeat className="w-3 h-3" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-0"
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="w-16"
            />
          </div>
        </div>

        <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
      </CardContent>
    </Card>
  );
};
