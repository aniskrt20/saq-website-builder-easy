
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Headphones, 
  Video, 
  Settings, 
  Info, 
  PlayCircle,
  Sparkles,
  BookOpen,
  Compass,
  Book
} from "lucide-react";

const QuickServices = () => {
  const services = [
    {
      title: "المصحف الشريف",
      description: "القرآن الكريم كاملاً مع التلاوة",
      icon: <Book className="w-6 h-6" />,
      link: "/quran",
      color: "from-emerald-500 to-green-500"
    },
    {
      title: "التسبيح الرقمي",
      description: "عداد تسبيح إلكتروني",
      icon: <Sparkles className="w-6 h-6" />,
      link: "/tasbih",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "الأذكار",
      description: "أذكار الصباح والمساء",
      icon: <BookOpen className="w-6 h-6" />,
      link: "/adhkar",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "الأدعية",
      description: "مجموعة من الأدعية المختارة",
      icon: <Compass className="w-6 h-6" />,
      link: "/duas",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "الإذاعات الإسلامية",
      description: "إذاعات قرآنية مباشرة",
      icon: <Headphones className="w-6 h-6" />,
      link: "/radio",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "الفيديوهات الإسلامية",
      description: "محتوى مرئي إسلامي",
      icon: <Video className="w-6 h-6" />,
      link: "/videos",
      color: "from-teal-500 to-blue-500"
    },
    {
      title: "الأحاديث النبوية",
      description: "أحاديث صحيحة مع البحث",
      icon: <PlayCircle className="w-6 h-6" />,
      link: "/hadith",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 arabic-text">الخدمات السريعة</h2>
        <p className="text-gray-600">اختر الخدمة التي تحتاجها</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <Link key={index} to={service.link}>
            <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1 arabic-text group-hover:text-purple-700 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Settings and About */}
      <div className="flex gap-4 mt-6">
        <Link to="/settings" className="flex-1">
          <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm arabic-text group-hover:text-purple-700 transition-colors duration-300">
                الإعدادات
              </h3>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/about" className="flex-1">
          <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm arabic-text group-hover:text-purple-700 transition-colors duration-300">
                حول التطبيق
              </h3>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default QuickServices;
