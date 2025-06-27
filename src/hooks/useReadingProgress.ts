
import { useState, useCallback, useEffect } from 'react';

interface ReadingProgress {
  currentSurah: number;
  currentPage: number;
  totalPagesRead: number;
  lastReadTime: Date | null;
  completedSurahs: number[];
  readingSessions: {
    date: string;
    duration: number;
    pagesRead: number;
  }[];
}

const STORAGE_KEY = 'quran-reading-progress';

export const useReadingProgress = () => {
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>({
    currentSurah: 1,
    currentPage: 1,
    totalPagesRead: 0,
    lastReadTime: null,
    completedSurahs: [],
    readingSessions: []
  });

  // تحميل التقدم من التخزين المحلي
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReadingProgress({
          ...parsed,
          lastReadTime: parsed.lastReadTime ? new Date(parsed.lastReadTime) : null
        });
      } catch (error) {
        console.error('Error parsing reading progress:', error);
      }
    }
  }, []);

  // حفظ التقدم في التخزين المحلي
  const saveToStorage = useCallback((progress: ReadingProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  }, []);

  // حفظ موضع القراءة الحالي
  const saveProgress = useCallback((surah: number, page: number) => {
    setReadingProgress(prev => {
      const newProgress = {
        ...prev,
        currentSurah: surah,
        currentPage: page,
        lastReadTime: new Date(),
        totalPagesRead: Math.max(prev.totalPagesRead, page)
      };
      
      saveToStorage(newProgress);
      return newProgress;
    });
  }, [saveToStorage]);

  // تسجيل إتمام سورة
  const markSurahCompleted = useCallback((surahNumber: number) => {
    setReadingProgress(prev => {
      if (prev.completedSurahs.includes(surahNumber)) {
        return prev; // السورة مكتملة بالفعل
      }

      const newProgress = {
        ...prev,
        completedSurahs: [...prev.completedSurahs, surahNumber].sort((a, b) => a - b),
        lastReadTime: new Date()
      };
      
      saveToStorage(newProgress);
      return newProgress;
    });
  }, [saveToStorage]);

  // تسجيل جلسة قراءة
  const recordReadingSession = useCallback((duration: number, pagesRead: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setReadingProgress(prev => {
      const existingSessionIndex = prev.readingSessions.findIndex(
        session => session.date === today
      );

      let newSessions;
      if (existingSessionIndex >= 0) {
        // تحديث الجلسة الموجودة
        newSessions = [...prev.readingSessions];
        newSessions[existingSessionIndex] = {
          date: today,
          duration: newSessions[existingSessionIndex].duration + duration,
          pagesRead: newSessions[existingSessionIndex].pagesRead + pagesRead
        };
      } else {
        // إضافة جلسة جديدة
        newSessions = [...prev.readingSessions, {
          date: today,
          duration,
          pagesRead
        }];
      }

      // الاحتفاظ بآخر 30 جلسة فقط
      newSessions = newSessions.slice(-30);

      const newProgress = {
        ...prev,
        readingSessions: newSessions,
        lastReadTime: new Date()
      };
      
      saveToStorage(newProgress);
      return newProgress;
    });
  }, [saveToStorage]);

  // استعادة آخر موضع قراءة
  const getLastPosition = useCallback(() => {
    return {
      surah: readingProgress.currentSurah,
      page: readingProgress.currentPage
    };
  }, [readingProgress]);

  // إحصائيات القراءة
  const getReadingStats = useCallback(() => {
    const totalDuration = readingProgress.readingSessions.reduce(
      (sum, session) => sum + session.duration, 0
    );
    
    const totalPages = readingProgress.readingSessions.reduce(
      (sum, session) => sum + session.pagesRead, 0
    );

    const averageSession = readingProgress.readingSessions.length > 0
      ? totalDuration / readingProgress.readingSessions.length
      : 0;

    return {
      totalDuration,
      totalPages,
      averageSession,
      completedSurahs: readingProgress.completedSurahs.length,
      totalSessions: readingProgress.readingSessions.length
    };
  }, [readingProgress]);

  // إعادة تعيين التقدم
  const resetProgress = useCallback(() => {
    const defaultProgress: ReadingProgress = {
      currentSurah: 1,
      currentPage: 1,
      totalPagesRead: 0,
      lastReadTime: null,
      completedSurahs: [],
      readingSessions: []
    };
    
    setReadingProgress(defaultProgress);
    saveToStorage(defaultProgress);
  }, [saveToStorage]);

  return {
    readingProgress,
    saveProgress,
    markSurahCompleted,
    recordReadingSession,
    getLastPosition,
    getReadingStats,
    resetProgress
  };
};
