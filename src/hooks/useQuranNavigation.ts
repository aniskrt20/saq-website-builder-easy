
import { useState, useCallback } from 'react';

export const useQuranNavigation = () => {
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 604; // إجمالي صفحات المصحف الشريف

  const goToSurah = useCallback((surahNumber: number) => {
    console.log('Navigating to surah:', surahNumber);
    if (surahNumber >= 1 && surahNumber <= 114) {
      setCurrentSurah(surahNumber);
      // حساب الصفحة الأولى للسورة تقريبياً
      const approximatePage = Math.max(1, Math.floor((surahNumber - 1) * 5.3) + 1);
      setCurrentPage(approximatePage);
    }
  }, []);

  const goToPage = useCallback((pageNumber: number) => {
    console.log('Navigating to page:', pageNumber);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    console.log('Going to next page, current:', currentPage);
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      console.log('New page set to:', newPage);
    }
  }, [currentPage, totalPages]);

  const previousPage = useCallback(() => {
    console.log('Going to previous page, current:', currentPage);
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      console.log('New page set to:', newPage);
    }
  }, [currentPage]);

  const nextSurah = useCallback(() => {
    console.log('Going to next surah, current:', currentSurah);
    if (currentSurah < 114) {
      const newSurah = currentSurah + 1;
      goToSurah(newSurah);
    }
  }, [currentSurah, goToSurah]);

  const previousSurah = useCallback(() => {
    console.log('Going to previous surah, current:', currentSurah);
    if (currentSurah > 1) {
      const newSurah = currentSurah - 1;
      goToSurah(newSurah);
    }
  }, [currentSurah, goToSurah]);

  return {
    currentSurah,
    currentPage,
    totalPages,
    goToSurah,
    goToPage,
    nextPage,
    previousPage,
    nextSurah,
    previousSurah
  };
};
