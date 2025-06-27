
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ReciterSelectorProps {
  selectedReciter: string;
  onReciterChange: (reciter: string) => void;
}

const RECITERS = [
  {
    code: 'ar.alafasy',
    name: 'ماهر المعيقلي',
    description: 'إمام الحرم المكي'
  },
  {
    code: 'ar.abdulbasitmurattal',
    name: 'عبد الباسط عبد الصمد',
    description: 'مرتل'
  },
  {
    code: 'ar.minshawi',
    name: 'محمد صديق المنشاوي',
    description: 'مرتل'
  },
  {
    code: 'ar.muhammadayyoub',
    name: 'محمد أيوب',
    description: 'إمام الحرم المدني'
  },
  {
    code: 'ar.saoodshuraym',
    name: 'سعود الشريم',
    description: 'إمام الحرم المكي'
  },
  {
    code: 'ar.ahmedajamy',
    name: 'أحمد بن علي العجمي',
    description: 'إمام وخطيب'
  },
  {
    code: 'ar.husary',
    name: 'خليل الحصري',
    description: 'مرتل'
  },
  {
    code: 'ar.sudais',
    name: 'عبد الرحمن السديس',
    description: 'إمام الحرم المكي'
  },
  {
    code: 'ar.shaatri',
    name: 'أبو بكر الشاطري',
    description: 'قارئ'
  },
  {
    code: 'ar.hani',
    name: 'هاني الرفاعي',
    description: 'قارئ'
  }
];

export const ReciterSelector: React.FC<ReciterSelectorProps> = ({
  selectedReciter,
  onReciterChange
}) => {
  const selectedReciterData = RECITERS.find(r => r.code === selectedReciter);

  return (
    <div className="space-y-3">
      <Select value={selectedReciter} onValueChange={onReciterChange}>
        <SelectTrigger className="w-full bg-white border-amber-200 focus:ring-amber-500">
          <SelectValue placeholder="اختر القارئ">
            {selectedReciterData && (
              <div className="flex items-center gap-3">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                    {selectedReciterData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="font-medium arabic-text">{selectedReciterData.name}</div>
                  <div className="text-xs text-gray-500">{selectedReciterData.description}</div>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="bg-white border-amber-200 shadow-xl max-h-80">
          {RECITERS.map((reciter) => (
            <SelectItem key={reciter.code} value={reciter.code} className="cursor-pointer">
              <div className="flex items-center gap-3 py-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    {reciter.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="font-medium arabic-text">{reciter.name}</div>
                  <div className="text-xs text-gray-500">{reciter.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedReciterData && (
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <p className="text-sm text-amber-800 arabic-text">
            <span className="font-semibold">القارئ المحدد:</span> {selectedReciterData.name}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            {selectedReciterData.description}
          </p>
        </div>
      )}
    </div>
  );
};
