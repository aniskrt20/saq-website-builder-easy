
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Download, Eye } from "lucide-react";

interface VerseImageDisplayProps {
  surahNumber: number;
  verseNumber: number;
  size?: "sm" | "md" | "lg";
  showControls?: boolean;
}

const VerseImageDisplay = ({ 
  surahNumber, 
  verseNumber, 
  size = "md",
  showControls = true
}: VerseImageDisplayProps) => {
  const [showImage, setShowImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getVerseImageUrl = (surahNum: number, verseNum: number, highRes: boolean = false) => {
    const baseUrl = highRes 
      ? "https://cdn.islamic.network/quran/images/high-resolution"
      : "https://cdn.islamic.network/quran/images";
    
    return `${baseUrl}/${surahNum}_${verseNum}.png`;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleDownload = async () => {
    try {
      const imageUrl = getVerseImageUrl(surahNumber, verseNumber, true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `آية_${surahNumber}_${verseNumber}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl"
  };

  return (
    <div className="space-y-3">
      {showControls && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImage(!showImage)}
            className="flex items-center gap-2"
          >
            <Eye size={14} />
            {showImage ? "إخفاء الصورة" : "عرض الآية كصورة"}
          </Button>
          
          {showImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download size={14} />
              تحميل الصورة
            </Button>
          )}
        </div>
      )}

      {showImage && (
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
          <div className={`${sizeClasses[size]} mx-auto`}>
            {!imageLoaded && !imageError && (
              <div className="flex items-center justify-center h-32 bg-amber-100 rounded-lg">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-amber-700">جاري تحميل صورة الآية...</p>
                </div>
              </div>
            )}
            
            {imageError && (
              <div className="flex items-center justify-center h-32 bg-red-50 rounded-lg border border-red-200">
                <div className="text-center text-red-600">
                  <Image size={24} className="mx-auto mb-2" />
                  <p className="text-sm">تعذر تحميل صورة الآية</p>
                </div>
              </div>
            )}
            
            <img
              src={getVerseImageUrl(surahNumber, verseNumber)}
              alt={`آية ${verseNumber} من سورة ${surahNumber}`}
              className={`w-full h-auto rounded-lg shadow-lg ${!imageLoaded ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default VerseImageDisplay;
