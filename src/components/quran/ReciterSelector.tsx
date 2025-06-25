
import React from "react";
import { useReciters } from "@/services/api/reciterServices";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, User } from "lucide-react";

interface ReciterSelectorProps {
  selectedReciterId: number;
  onReciterChange: (reciterId: number) => void;
}

const ReciterSelector = ({ selectedReciterId, onReciterChange }: ReciterSelectorProps) => {
  const { data: reciters, isLoading } = useReciters();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-white/70 text-sm">
        <Volume2 size={16} />
        <span>جاري تحميل القراء...</span>
      </div>
    );
  }

  if (!reciters || reciters.length === 0) {
    return null;
  }

  // Get the selected reciter name
  const selectedReciter = reciters.find(r => r.id === selectedReciterId);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-white/90">
        <User size={16} />
        <span className="text-sm font-medium">القارئ:</span>
      </div>
      
      <Select 
        value={selectedReciterId.toString()} 
        onValueChange={(value) => onReciterChange(parseInt(value))}
      >
        <SelectTrigger className="w-48 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 focus:ring-2 focus:ring-white/50">
          <SelectValue>
            <span className="text-sm">{selectedReciter?.name || "اختر القارئ"}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-lg border-white/30 max-h-60">
          {reciters.map((reciter) => (
            <SelectItem 
              key={reciter.id} 
              value={reciter.id.toString()}
              className="text-right cursor-pointer hover:bg-purple-50 focus:bg-purple-100"
            >
              <span className="arabic-text">{reciter.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReciterSelector;
