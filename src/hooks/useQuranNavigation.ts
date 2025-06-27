
import { useState, useCallback } from 'react';

export const useQuranNavigation = () => {
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 604; // إجمالي صفحات المصحف الشريف

  const goToSurah = useCallback((surahNumber: number) => {
    if (surahNumber >= 1 && surahNumber <= 114) {
      setCurrentSurah(surahNumber);
      // يمكن تحسين هذا لحساب الصفحة الصحيحة لكل سورة
      setCurrentPage(1);
    }
  }, []);

  const goToPage = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const nextSurah = useCallback(() => {
    if (currentSurah < 114) {
      goToSurah(currentSurah + 1);
    }
  }, [currentSurah, goToSurah]);

  const previousSurah = useCallback(() => {
    if (currentSurah > 1) {
      goToSurah(currentSurah - 1);
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
