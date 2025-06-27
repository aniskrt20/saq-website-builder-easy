
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useQuranApi } from '@/hooks/useQuranApi';

interface ReciterSelectorProps {
  selectedReciter: string;
  onReciterChange: (reciter: string) => void;
}

export const ReciterSelector: React.FC<ReciterSelectorProps> = ({
  selectedReciter,
  onReciterChange
}) => {
  const { getReciters, getReciterName } = useQuranApi();
  const reciters = getReciters();
  
  const selectedReciterData = reciters.find(r => r.folder === selectedReciter);

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
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="bg-white border-amber-200 shadow-xl max-h-80">
          {reciters.map((reciter) => (
            <SelectItem key={reciter.folder} value={reciter.folder} className="cursor-pointer">
              <div className="flex items-center gap-3 py-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    {reciter.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="font-medium arabic-text">{reciter.name}</div>
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
        </div>
      )}
    </div>
  );
};
