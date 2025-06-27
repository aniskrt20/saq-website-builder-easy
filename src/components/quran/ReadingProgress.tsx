
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Target } from 'lucide-react';

interface ReadingProgressProps {
  progress: {
    currentSurah: number;
    currentPage: number;
    totalPagesRead: number;
    lastReadTime: Date | null;
    completedSurahs: number[];
  };
  currentSurah: number;
  currentPage: number;
  totalPages: number;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  progress,
  currentSurah,
  currentPage,
  totalPages
}) => {
  const overallProgress = totalPages > 0 ? (progress.totalPagesRead / totalPages) * 100 : 0;
  const readingStreak = progress.lastReadTime 
    ? Math.floor((Date.now() - progress.lastReadTime.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg arabic-text flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            تقدم القراءة
          </span>
          <Badge variant="outline" className="bg-white">
            {Math.round(overallProgress)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        
        {/* التقدم العام */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">إجمالي التقدم</span>
            <span className="font-medium text-emerald-700">
              {progress.totalPagesRead} / {totalPages} صفحة
            </span>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-3 bg-emerald-100"
          />
        </div>

        {/* الموضع الحالي */}
        <div className="bg-white/60 rounded-lg p-3 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">الموضع الحالي</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg arabic-text font-semibold text-emerald-800">
            سورة {currentSurah} - صفحة {currentPage}
          </div>
        </div>

        {/* السور المكتملة */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">السور المكتملة</span>
            <Badge variant="secondary" className="bg-emerald-200 text-emerald-800">
              {progress.completedSurahs.length} / 114
            </Badge>
          </div>
          
          {progress.completedSurahs.length > 0 && (
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {progress.completedSurahs.slice(-10).map((surahNum) => (
                <Badge 
                  key={surahNum} 
                  variant="outline" 
                  className="text-xs bg-emerald-50 border-emerald-300"
                >
                  {surahNum}
                </Badge>
              ))}
              {progress.completedSurahs.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{progress.completedSurahs.length - 10}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* آخر قراءة */}
        {progress.lastReadTime && (
          <div className="bg-white/60 rounded-lg p-3 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">آخر قراءة</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-sm text-emerald-700 mt-1">
              {readingStreak === 0 
                ? 'اليوم' 
                : readingStreak === 1 
                  ? 'أمس' 
                  : `منذ ${readingStreak} أيام`
              }
            </div>
          </div>
        )}

        {/* تشجيع */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg p-3 text-center">
          <div className="text-sm font-medium">
            {overallProgress < 10 
              ? 'بداية موفقة! واصل القراءة' 
              : overallProgress < 50 
                ? 'تقدم ممتاز! استمر'
                : overallProgress < 90 
                  ? 'قريب من الإنجاز!'
                  : 'تهانينا! أوشكت على الإتمام'
            }
          </div>
          <div className="text-xs opacity-90 mt-1">
            "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
