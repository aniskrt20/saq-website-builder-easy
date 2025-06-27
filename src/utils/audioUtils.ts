
// وظائف مساعدة للتعامل مع الصوت

export const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  }
};

export const createAudioElement = (src: string): HTMLAudioElement => {
  const audio = new Audio(src);
  audio.preload = 'metadata';
  return audio;
};

export const preloadAudio = async (src: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(src);
    
    audio.oncanplay = () => resolve(audio);
    audio.onerror = () => reject(new Error('Failed to load audio'));
    
    audio.load();
  });
};

export const calculateAudioProgress = (currentTime: number, duration: number): number => {
  if (!duration || duration === 0) return 0;
  return Math.min(100, (currentTime / duration) * 100);
};
