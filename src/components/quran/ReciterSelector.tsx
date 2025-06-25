
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, User } from "lucide-react";

interface ReciterSelectorProps {
  selectedReciterId: number;
  onReciterChange: (reciterId: number) => void;
}

// أشهر 10 قراء مع أصوات موثوقة
const FAMOUS_RECITERS = [
  { id: 1, name: "عبد الباسط عبد الصمد" },
  { id: 2, name: "ماهر المعيقلي" },
  { id: 3, name: "مشاري العفاسي" },
  { id: 4, name: "سعد الغامدي" },
  { id: 5, name: "أحمد العجمي" },
  { id: 6, name: "محمد صديق المنشاوي" },
  { id: 7, name: "عبد الرحمن السديس" },
  { id: 8, name: "ياسر الدوسري" },
  { id: 9, name: "ناصر القطامي" },
  { id: 10, name: "خالد الجليل" }
];

const ReciterSelector = ({ selectedReciterId, onReciterChange }: ReciterSelectorProps) => {
  // Get the selected reciter name
  const selectedReciter = FAMOUS_RECITERS.find(r => r.id === selectedReciterId);

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
          {FAMOUS_RECITERS.map((reciter) => (
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
