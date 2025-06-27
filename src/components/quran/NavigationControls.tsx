
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Navigation } from 'lucide-react';

interface NavigationControlsProps {
  currentSurah: number;
  currentPage: number;
  totalPages: number;
  onSurahChange: (surah: number) => void;
  onPageChange: (page: number) => void;
}

const SURAH_NAMES = [
  'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال',
  'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل',
  'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون', 'النور',
  'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان', 'السجدة',
  'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
  'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح',
  'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة',
  'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون', 'التغابن',
  'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن',
  'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
  'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية',
  'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق',
  'القدر', 'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة',
  'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص',
  'الفلق', 'الناس'
];

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentSurah,
  currentPage,
  totalPages,
  onSurahChange,
  onPageChange
}) => {
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg arabic-text flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          التنقل في المصحف
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        
        {/* اختيار السورة */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 arabic-text">
            اختيار السورة
          </label>
          <Select value={currentSurah.toString()} onValueChange={(value) => onSurahChange(Number(value))}>
            <SelectTrigger className="bg-white border-amber-200">
              <SelectValue>
                <span className="arabic-text">
                  سورة {SURAH_NAMES[currentSurah - 1]} ({currentSurah})
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-80 bg-white border-amber-200">
              {SURAH_NAMES.map((name, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  <span className="arabic-text">
                    {index + 1}. سورة {name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* تقدم القراءة */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">تقدم القراءة</span>
            <span className="text-gray-800 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-amber-100" 
          />
          <div className="text-xs text-gray-500 text-center">
            صفحة {currentPage} من {totalPages}
          </div>
        </div>

        {/* الانتقال المباشر للصفحة */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            الانتقال للصفحة
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                onPageChange(page);
              }}
              className="flex-1 px-3 py-2 border border-amber-200 rounded-md text-center focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <Button
              onClick={() => onPageChange(currentPage)}
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              انتقال
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
