
import { useState } from 'react';

const HadithSection = () => {
  const hadiths = [
    {
      text: "حدَّثَنا عبدُ اللهِ بنُ أبي زَيادٍ أنَّ أعرابيًّا وَقَفَ قالَ قد أَعجبَني وَمِنِّي أنَّ أَعرابيًّا وَقَفَ قالَ مِن أَين أَتيتَ يا أبا فريسةَ سُئِلَ أبو فُريسةَ أنَّ أبي خَيرٍ مِن أهلٍ مِن مَوضِعِ مَسكِين وَمَن أنَّكُم هيِّر",
      narrator: "حديث رقم ١٥٦",
      source: "صح الحاكم"
    }
  ];

  const [currentHadith] = useState(hadiths[0]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">الحديث عشوائي</h3>
        <button className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm hover:bg-teal-600 transition-colors">
          حديث
        </button>
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed text-sm">
          {currentHadith.text}
        </p>
        
        <div className="border-t pt-3">
          <p className="text-gray-600 text-xs">{currentHadith.narrator}</p>
          <p className="text-gray-500 text-xs">{currentHadith.source}</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 text-sm mb-1">أقوال الصحابة</h4>
          <p className="text-xs text-gray-600">
            إنَّا الأعمالُ بالنياتِ وإنما لكلِّ امرئٍ ما نوى فمَن كانت
          </p>
          <div className="mt-2 text-xs text-gray-500">
            أبو عبد الله<br/>
            يحيى بوسف
          </div>
        </div>
      </div>
    </div>
  );
};

export default HadithSection;
