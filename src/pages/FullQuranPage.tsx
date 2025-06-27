
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuranViewer } from '@/components/quran/QuranViewer';
import { AudioPlayer } from '@/components/quran/AudioPlayer';
import { ReciterSelector } from '@/components/quran/ReciterSelector';
import { NavigationControls } from '@/components/quran/NavigationControls';
import { ReadingProgress } from '@/components/quran/ReadingProgress';
import { useQuranNavigation } from '@/hooks/useQuranNavigation';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { BookOpen, Headphones, Settings } from 'lucide-react';

const FullQuranPage = () => {
  const [selectedReciter, setSelectedReciter] = useState('Alafasy_128kbps');
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    currentSurah,
    currentPage,
    totalPages,
    goToSurah,
    goToPage
  } = useQuranNavigation();
  
  const {
    readingProgress,
    saveProgress,
    getLastPosition
  } = useReadingProgress();

  useEffect(() => {
    // استعادة آخر موضع قراءة عند تحميل الصفحة
    const lastPosition = getLastPosition();
    if (lastPosition) {
      goToSurah(lastPosition.surah);
      goToPage(lastPosition.page);
    }
  }, []);

  const handlePageChange = (page: number) => {
    goToPage(page);
    saveProgress(currentSurah, page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden">
      {/* خلفية إسلامية */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMjAgMEwyNS45OCAxNC4wMkw0MCAyMEwyNS45OCAyNS45OEwyMCA0MEwxNC4wMiAyNS45OEwwIDIwTDE0LjAyIDE0LjAyeiIgZmlsbD0iI2Q5NzQwNiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] repeat"></div>
      </div>

      <div className="relative z-10">
        {/* شريط علوي */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-amber-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 arabic-text">المصحف الشريف</h1>
                  <p className="text-sm text-gray-600">تطبيق القرآن الكريم الكامل</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={isAudioMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAudioMode(!isAudioMode)}
                  className="gap-2"
                >
                  <Headphones className="w-4 h-4" />
                  الاستماع
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* محتوى التطبيق */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* الشريط الجانبي */}
            <div className="w-full lg:w-80 space-y-4">
              
              {/* تقدم القراءة */}
              <ReadingProgress 
                progress={readingProgress}
                currentSurah={currentSurah}
                currentPage={currentPage}
                totalPages={totalPages}
              />
              
              {/* اختيار القارئ */}
              {isAudioMode && (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg arabic-text">اختيار القارئ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReciterSelector
                      selectedReciter={selectedReciter}
                      onReciterChange={setSelectedReciter}
                    />
                  </CardContent>
                </Card>
              )}
              
              {/* المشغل الصوتي */}
              {isAudioMode && (
                <AudioPlayer
                  reciter={selectedReciter}
                  surah={currentSurah}
                  onSurahChange={goToSurah}
                />
              )}
              
              {/* أدوات التنقل */}
              <NavigationControls
                currentSurah={currentSurah}
                currentPage={currentPage}
                totalPages={totalPages}
                onSurahChange={goToSurah}
                onPageChange={handlePageChange}
              />
              
            </div>

            {/* عارض المصحف */}
            <div className="flex-1">
              <QuranViewer
                surah={currentSurah}
                page={currentPage}
                reciter={selectedReciter}
                showAudio={isAudioMode}
                onPageChange={handlePageChange}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullQuranPage;
