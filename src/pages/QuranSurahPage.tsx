import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuranApiChapter } from "@/services/api/quranApiService";
import { useSuwar } from "@/services/api/quranServices";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, BookOpen, Star, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import VerseAudioPlayer from "@/components/quran/VerseAudioPlayer";
import SurahAudioPlayer from "@/components/quran/SurahAudioPlayer";
import VerseImageDisplay from "@/components/quran/VerseImageDisplay";

const QuranSurahPage = () => {
  const { surahId } = useParams<{ surahId: string }>();
  const navigate = useNavigate();
  const surahNumber = surahId ? parseInt(surahId) : 1;
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);
  const [selectedReciterId, setSelectedReciterId] = useState(1);
  
  const { data, isLoading, error } = useQuranApiChapter(surahNumber);
  const { data: suwarData } = useSuwar();

  const handleBack = () => {
    navigate("/quran");
  };

  const handleReciterChange = (reciterId: number) => {
    setSelectedReciterId(reciterId);
    console.log(`Reciter changed to: ${reciterId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        {/* Decorative Islamic Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-islamic-pattern"></div>
        </div>
        
        {/* Elegant Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/10 to-yellow-500/10"></div>
          
          <div className="relative z-10 px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handleBack}
                  className="group flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-white/30">
                    <ChevronRight size={18} />
                  </div>
                  <span className="font-medium">العودة</span>
                </button>
                
                <div className="text-center text-white">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-400/30 flex items-center justify-center">
                      <BookOpen className="text-yellow-200" size={16} />
                    </div>
                    <h1 className="text-2xl font-bold arabic-text">جاري التحميل</h1>
                  </div>
                </div>
                
                <div className="w-16"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center py-16">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          </div>
          <span className="mt-4 text-amber-700 text-lg font-medium arabic-text">جاري تحميل السورة الكريمة...</span>
        </div>
        
        <div className="pb-20">
          <BottomNavigation />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        {/* Modern Error Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500"></div>
          
          <div className="relative z-10 px-6 py-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={handleBack}
                  className="group flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/30">
                    <ChevronRight size={20} />
                  </div>
                  <span className="font-medium text-lg">العودة</span>
                </button>
                
                <div className="text-center text-white">
                  <h1 className="text-4xl font-bold arabic-text">خطأ في التحميل</h1>
                </div>
                
                <div className="w-20"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur-2xl opacity-20"></div>
            <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-400 to-pink-400 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-white" size={24} />
                </div>
                <p className="text-red-600 mb-2 text-lg font-medium">حدث خطأ أثناء تحميل السورة</p>
                <p className="text-gray-500 mb-4">يرجى المحاولة مرة أخرى لاحقاً</p>
                <Button 
                  onClick={handleBack}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-8 py-3 font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  العودة للمصحف
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="pb-20">
          <BottomNavigation />
        </div>
      </div>
    );
  }

  const { chapter, verses } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Authentic Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-islamic-pattern"></div>
      </div>
      
      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-600/20 to-transparent rounded-br-full"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-600/20 to-transparent rounded-bl-full"></div>
      
      {/* Elegant Mushaf Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/10 to-yellow-500/10"></div>
        
        {/* Decorative Border Pattern */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
        
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBack}
                className="group flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-white/30">
                  <ChevronRight size={18} />
                </div>
                <span className="font-medium">العودة</span>
              </button>
              
              <div className="text-center text-white">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-400/30 flex items-center justify-center">
                    <BookOpen className="text-yellow-200" size={16} />
                  </div>
                  <h1 className="text-2xl font-bold arabic-text bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                    {chapter.name_arabic}
                  </h1>
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {chapter.translated_name.name} • {chapter.verses_count} آية • {chapter.revelation_place === "makkah" ? "مكية" : "مدنية"}
                </p>
              </div>
              
              <div className="w-16"></div>
            </div>

            {/* Surah Info with Authentic Design */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/40 via-amber-600/40 to-yellow-600/40 rounded-2xl blur opacity-60"></div>
              <div className="relative bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
                <div className="text-center text-white">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg border-2 border-white/30">
                      <span className="text-white font-bold text-lg arabic-text">{chapter.id}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold arabic-text bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent mb-1">
                        سورة {chapter.name_arabic}
                      </h2>
                      <p className="text-white/90 text-sm">{chapter.translated_name.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-pink-400 flex items-center justify-center shadow-md">
                        <Heart className="text-white" size={14} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center shadow-md">
                        <Bookmark className="text-white" size={14} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                      <BookOpen className="text-yellow-300" size={14} />
                      <span className="font-medium text-sm">{chapter.verses_count} آية</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                      <Star className="text-blue-300" size={14} />
                      <span className="font-medium text-sm">{chapter.revelation_place === "makkah" ? "مكية" : "مدنية"}</span>
                    </div>
                  </div>

                  {/* Surah Audio Player */}
                  <SurahAudioPlayer 
                    surahNumber={surahNumber} 
                    surahName={chapter.name_arabic}
                    onReciterChange={handleReciterChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Authentic Mushaf Pages */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-300/20 to-yellow-300/20 rounded-3xl blur"></div>
          <Card className="relative bg-gradient-to-br from-amber-50/90 to-yellow-50/90 backdrop-blur-sm border-2 border-amber-200/50 shadow-2xl rounded-3xl overflow-hidden">
            {/* Decorative Header Border */}
            <div className="h-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>
            
            <CardContent className="p-6">
              {verses && verses.length > 0 && (
                <>
                  {/* Bismillah with Authentic Styling */}
                  {chapter.bismillah_pre && surahNumber !== 1 && (
                    <div className="text-center mb-8">
                      <div className="relative">
                        <div className="absolute -inset-3 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-xl blur"></div>
                        <div className="relative bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-4 border-2 border-amber-300/50 shadow-lg">
                          <div className="text-center">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-3"></div>
                            <h2 className="text-2xl font-bold arabic-text text-amber-800 leading-relaxed">
                              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </h2>
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Verses with Authentic Mushaf Design */}
                  <div className="space-y-6">
                    {verses.map((verse, index) => {
                      const verseText = verse.text_uthmani;
                      const isHighlighted = highlightedVerse === verse.id;

                      return (
                        <div 
                          key={verse.id} 
                          id={`verse-${verse.id}`}
                          className={`group relative transition-all duration-500 ${
                            isHighlighted ? 'ring-2 ring-amber-400 ring-opacity-60' : ''
                          }`}
                        >
                          <div className={`absolute -inset-2 bg-gradient-to-r from-amber-200/20 to-yellow-200/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 ${
                            isHighlighted ? 'opacity-100 from-amber-300/30 to-yellow-300/30' : ''
                          }`}></div>
                          
                          <div className={`relative bg-gradient-to-r from-white/60 to-amber-50/60 rounded-xl p-4 border border-amber-200/50 group-hover:border-amber-300/70 transition-all duration-300 ${
                            isHighlighted ? 'border-amber-400/70 bg-gradient-to-r from-amber-50/80 to-yellow-50/80' : ''
                          }`}>
                            <div className="flex items-start gap-3">
                              {/* Authentic Verse Number */}
                              <div className="relative flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300 border-2 border-white/50 ${
                                  isHighlighted ? 'from-amber-700 to-yellow-700 shadow-xl' : ''
                                }`}>
                                  <span className="text-white font-bold text-sm arabic-text">{verse.id}</span>
                                </div>
                                
                                {/* Decorative Corner */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                              </div>
                              
                              {/* Verse Text with Authentic Typography */}
                              <div className="flex-1 text-right">
                                <p className={`arabic-text text-xl leading-loose text-amber-900 group-hover:text-amber-800 transition-colors duration-300 font-medium ${
                                  isHighlighted ? 'text-amber-800 font-semibold text-shadow' : ''
                                }`} style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
                                  {verseText}
                                </p>
                              </div>
                              
                              {/* Action Icons with Authentic Design */}
                              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <VerseAudioPlayer 
                                  surahNumber={surahNumber} 
                                  verseNumber={verse.id} 
                                  size="sm"
                                  selectedReciterId={selectedReciterId}
                                />
                                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-red-400 to-pink-400 flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer">
                                  <Heart className="text-white" size={12} />
                                </div>
                                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200 cursor-pointer">
                                  <Bookmark className="text-white" size={12} />
                                </div>
                              </div>
                            </div>
                            
                            {/* Verse Image Display */}
                            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <VerseImageDisplay 
                                surahNumber={surahNumber}
                                verseNumber={verse.id}
                                size="sm"
                                showControls={true}
                              />
                            </div>
                          </div>
                          
                          {/* Verse Separator with Islamic Design */}
                          {index < verses.length - 1 && (
                            <div className="flex justify-center my-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
            
            {/* Decorative Footer Border */}
            <div className="h-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>
          </Card>
        </div>
      </div>
      
      <div className="pb-20">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default QuranSurahPage;
