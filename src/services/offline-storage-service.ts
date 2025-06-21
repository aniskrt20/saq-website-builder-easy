interface OfflineQuranData {
  chapters: any[];
  verses: { [chapterId: number]: any[] };
  lastUpdated: string;
  downloadedChapters: number[];
}

interface DownloadProgress {
  chapterId: number;
  chapterName: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
}

class OfflineStorageService {
  private dbName = 'QuranOfflineDB';
  private dbVersion = 4; // زيادة رقم الإصدار لإصلاح المشاكل
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, this.dbVersion);
        
        request.onerror = () => {
          console.error('خطأ في فتح قاعدة البيانات:', request.error);
          reject(new Error('فشل في فتح قاعدة البيانات'));
        };
        
        request.onsuccess = () => {
          this.db = request.result;
          console.log('تم فتح قاعدة البيانات بنجاح');
          resolve();
        };
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          console.log('تحديث قاعدة البيانات...');
          
          // حذف المخازن القديمة إذا كانت موجودة
          const storeNames = ['chapters', 'verses', 'metadata'];
          storeNames.forEach(storeName => {
            if (db.objectStoreNames.contains(storeName)) {
              db.deleteObjectStore(storeName);
            }
          });
          
          // إنشاء مخزن للسور
          const chaptersStore = db.createObjectStore('chapters', { keyPath: 'id' });
          chaptersStore.createIndex('name', 'name_arabic', { unique: false });
          
          // إنشاء مخزن للآيات
          const versesStore = db.createObjectStore('verses', { keyPath: 'chapterId' });
          versesStore.createIndex('chapterId', 'chapterId', { unique: true });
          
          // إنشاء مخزن للبيانات الوصفية
          const metadataStore = db.createObjectStore('metadata', { keyPath: 'key' });
          
          console.log('تم إنشاء مخازن قاعدة البيانات');
        };
      } catch (error) {
        console.error('خطأ عام في تهيئة قاعدة البيانات:', error);
        reject(new Error('فشل في تهيئة قاعدة البيانات'));
      }
    });
  }

  async ensureDBReady(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
    
    // التحقق من صحة الاتصال
    if (!this.db || this.db.version === 0) {
      throw new Error('قاعدة البيانات غير جاهزة');
    }
  }

  async getDownloadedChapters(): Promise<number[]> {
    try {
      await this.ensureDBReady();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['metadata'], 'readonly');
        const store = transaction.objectStore('metadata');
        const request = store.get('downloadedChapters');
        
        let timeoutId: NodeJS.Timeout;
        let resolved = false;
        
        const resolveOnce = (value: number[]) => {
          if (!resolved) {
            resolved = true;
            if (timeoutId) clearTimeout(timeoutId);
            resolve(value);
          }
        };
        
        transaction.oncomplete = () => {
          const result = request.result;
          const chapters = result ? (Array.isArray(result.value) ? result.value : []) : [];
          console.log('السور المحملة:', chapters);
          resolveOnce(chapters);
        };
        
        transaction.onerror = () => {
          console.error('خطأ في استرجاع قائمة السور المحملة:', transaction.error);
          resolveOnce([]); // إرجاع مصفوفة فارغة بدلاً من رفض
        };
        
        // إضافة timeout للعملية
        timeoutId = setTimeout(() => {
          console.warn('انتهت مهلة استرجاع السور المحملة');
          resolveOnce([]);
        }, 5000);
      });
    } catch (error) {
      console.error('خطأ عام في استرجاع السور المحملة:', error);
      return []; // إرجاع مصفوفة فارغة في حالة الخطأ
    }
  }

  async updateDownloadedChapters(chapterIds: number[]): Promise<void> {
    try {
      await this.ensureDBReady();
      
      const uniqueChapterIds = [...new Set(chapterIds.filter(id => typeof id === 'number' && id > 0 && id <= 114))];
      
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['metadata'], 'readwrite');
        const store = transaction.objectStore('metadata');
        
        const data = {
          key: 'downloadedChapters',
          value: uniqueChapterIds,
          lastUpdated: new Date().toISOString()
        };
        
        const request = store.put(data);
        
        request.onsuccess = () => {
          console.log('تم تحديث قائمة السور المحملة:', uniqueChapterIds);
          resolve();
        };
        
        request.onerror = () => {
          console.error('خطأ في تحديث قائمة السور المحملة:', request.error);
          reject(new Error('فشل في تحديث قائمة السور المحملة'));
        };
      });
    } catch (error) {
      console.error('خطأ عام في تحديث السور المحملة:', error);
      throw new Error('فشل في تحديث قائمة السور المحملة');
    }
  }

  async saveChapter(chapter: any): Promise<void> {
    try {
      await this.ensureDBReady();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['chapters'], 'readwrite');
        const store = transaction.objectStore('chapters');
        
        const chapterData = {
          id: chapter.id,
          name_arabic: chapter.name_arabic || chapter.name || `السورة ${chapter.id}`,
          name_simple: chapter.name_simple || chapter.englishName || '',
          translated_name: chapter.translated_name || { name: chapter.englishNameTranslation || '' },
          verses_count: chapter.verses_count || chapter.numberOfAyahs || 0,
          revelation_place: chapter.revelation_place || (chapter.revelationType ? chapter.revelationType.toLowerCase() : 'makkah'),
          bismillah_pre: chapter.bismillah_pre !== false,
          savedAt: new Date().toISOString()
        };
        
        const request = store.put(chapterData);
        
        request.onsuccess = () => {
          console.log(`تم حفظ السورة ${chapter.id} بنجاح`);
          resolve();
        };
        
        request.onerror = () => {
          console.error(`خطأ في حفظ السورة ${chapter.id}:`, request.error);
          reject(new Error(`فشل في حفظ السورة ${chapter.id}`));
        };
      });
    } catch (error) {
      console.error(`خطأ عام في حفظ السورة ${chapter.id}:`, error);
      throw new Error(`فشل في حفظ السورة ${chapter.id}`);
    }
  }

  async saveVerses(chapterId: number, verses: any[]): Promise<void> {
    try {
      await this.ensureDBReady();
      
      if (!Array.isArray(verses) || verses.length === 0) {
        throw new Error('لا توجد آيات لحفظها');
      }
      
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['verses'], 'readwrite');
        const store = transaction.objectStore('verses');
        
        const versesData = {
          chapterId,
          verses: verses.map((verse, index) => ({
            id: verse.id || verse.numberInSurah || (index + 1),
            text_uthmani: verse.text_uthmani || verse.text || '',
            text_simple: verse.text_simple || verse.text || '',
            verse_key: verse.verse_key || `${chapterId}:${verse.id || verse.numberInSurah || (index + 1)}`,
            juz_number: verse.juz_number || verse.juz || 1,
            page_number: verse.page_number || verse.page || 1
          })),
          savedAt: new Date().toISOString()
        };
        
        const request = store.put(versesData);
        
        request.onsuccess = () => {
          console.log(`تم حفظ آيات السورة ${chapterId} بنجاح (${verses.length} آية)`);
          resolve();
        };
        
        request.onerror = () => {
          console.error(`خطأ في حفظ آيات السورة ${chapterId}:`, request.error);
          reject(new Error(`فشل في حفظ آيات السورة ${chapterId}`));
        };
      });
    } catch (error) {
      console.error(`خطأ عام في حفظ آيات السورة ${chapterId}:`, error);
      throw new Error(`فشل في حفظ آيات السورة ${chapterId}`);
    }
  }

  async getChapter(chapterId: number): Promise<any | null> {
    try {
      await this.ensureDBReady();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['chapters'], 'readonly');
        const store = transaction.objectStore('chapters');
        const request = store.get(chapterId);
        
        request.onsuccess = () => {
          const result = request.result;
          console.log(`استرجاع السورة ${chapterId}:`, result ? 'موجودة' : 'غير موجودة');
          resolve(result || null);
        };
        
        request.onerror = () => {
          console.error(`خطأ في استرجاع السورة ${chapterId}:`, request.error);
          resolve(null); // إرجاع null بدلاً من رفض
        };
      });
    } catch (error) {
      console.error(`خطأ عام في استرجاع السورة ${chapterId}:`, error);
      return null;
    }
  }

  async getVerses(chapterId: number): Promise<any[] | null> {
    try {
      await this.ensureDBReady();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['verses'], 'readonly');
        const store = transaction.objectStore('verses');
        const request = store.get(chapterId);
        
        request.onsuccess = () => {
          const result = request.result;
          const verses = result ? result.verses : null;
          console.log(`استرجاع آيات السورة ${chapterId}:`, verses ? `${verses.length} آية` : 'غير موجودة');
          resolve(verses);
        };
        
        request.onerror = () => {
          console.error(`خطأ في استرجاع آيات السورة ${chapterId}:`, request.error);
          resolve(null); // إرجاع null بدلاً من رفض
        };
      });
    } catch (error) {
      console.error(`خطأ عام في استرجاع آيات السورة ${chapterId}:`, error);
      return null;
    }
  }

  async downloadChapter(chapterId: number, onProgress?: (progress: number) => void): Promise<void> {
    try {
      console.log(`بدء تحميل السورة ${chapterId}`);
      onProgress?.(5);

      // التحقق من وجود السورة مسبقاً
      const existingChapter = await this.getChapter(chapterId);
      const existingVerses = await this.getVerses(chapterId);
      
      if (existingChapter && existingVerses && existingVerses.length > 0) {
        console.log(`السورة ${chapterId} موجودة مسبقاً`);
        onProgress?.(100);
        return;
      }

      onProgress?.(10);
      
      try {
        // محاولة تحميل من API الأساسي
        console.log(`تحميل بيانات السورة ${chapterId} من API الأساسي`);
        const response = await fetch(`https://api.quranapi.pages.dev/chapters/${chapterId}/verses`);
        
        if (!response.ok) {
          throw new Error('فشل API الأساسي');
        }
        
        const data = await response.json();
        
        if (!data.chapter || !data.verses || !Array.isArray(data.verses)) {
          throw new Error('بيانات غير صحيحة من API الأساسي');
        }
        
        onProgress?.(60);
        
        await this.saveChapter(data.chapter);
        onProgress?.(80);
        
        await this.saveVerses(chapterId, data.verses);
        onProgress?.(95);
        
      } catch (primaryError) {
        console.log('فشل API الأساسي، استخدام API البديل...', primaryError);
        
        // استخدام API البديل
        const fallbackResponse = await fetch(`https://api.alquran.cloud/v1/surah/${chapterId}/quran-uthmani`);
        
        if (!fallbackResponse.ok) {
          throw new Error('فشل في جميع مصادر البيانات');
        }
        
        const fallbackData = await fallbackResponse.json();
        
        if (!fallbackData.data || !fallbackData.data.ayahs) {
          throw new Error('بيانات غير صحيحة من API البديل');
        }
        
        const surah = fallbackData.data;
        
        const chapterData = {
          id: surah.number,
          name_arabic: surah.name,
          name_simple: surah.englishName,
          translated_name: { name: surah.englishNameTranslation },
          verses_count: surah.ayahs.length,
          revelation_place: surah.revelationType.toLowerCase(),
          bismillah_pre: surah.number !== 1 && surah.number !== 9
        };
        
        const versesData = surah.ayahs.map(ayah => ({
          id: ayah.numberInSurah,
          text_uthmani: ayah.text,
          text_simple: ayah.text,
          verse_key: `${surah.number}:${ayah.numberInSurah}`,
          juz_number: ayah.juz,
          page_number: ayah.page
        }));
        
        onProgress?.(60);
        
        await this.saveChapter(chapterData);
        onProgress?.(80);
        
        await this.saveVerses(chapterId, versesData);
        onProgress?.(95);
      }
      
      // تحديث قائمة السور المحملة
      const downloadedChapters = await this.getDownloadedChapters();
      if (!downloadedChapters.includes(chapterId)) {
        downloadedChapters.push(chapterId);
        await this.updateDownloadedChapters(downloadedChapters);
      }
      
      onProgress?.(100);
      console.log(`تم تحميل السورة ${chapterId} بنجاح`);
      
    } catch (error) {
      console.error(`خطأ في تحميل السورة ${chapterId}:`, error);
      throw new Error(`فشل في تحميل السورة ${chapterId}: ${error.message}`);
    }
  }

  async isChapterDownloaded(chapterId: number): Promise<boolean> {
    try {
      const chapter = await this.getChapter(chapterId);
      const verses = await this.getVerses(chapterId);
      return !!(chapter && verses && verses.length > 0);
    } catch (error) {
      console.error(`خطأ في التحقق من تحميل السورة ${chapterId}:`, error);
      return false;
    }
  }

  async deleteChapter(chapterId: number): Promise<void> {
    try {
      await this.ensureDBReady();
      
      return new Promise(async (resolve, reject) => {
        try {
          const transaction = this.db!.transaction(['chapters', 'verses'], 'readwrite');
          
          transaction.objectStore('chapters').delete(chapterId);
          transaction.objectStore('verses').delete(chapterId);
          
          transaction.oncomplete = async () => {
            try {
              const downloadedChapters = await this.getDownloadedChapters();
              const updatedChapters = downloadedChapters.filter(id => id !== chapterId);
              await this.updateDownloadedChapters(updatedChapters);
              
              console.log(`تم حذف السورة ${chapterId} بنجاح`);
              resolve();
            } catch (error) {
              console.error(`خطأ في تحديث قائمة السور بعد الحذف:`, error);
              resolve(); // نكمل حتى لو فشل تحديث القائمة
            }
          };
          
          transaction.onerror = () => {
            console.error(`خطأ في حذف السورة ${chapterId}:`, transaction.error);
            reject(new Error(`فشل في حذف السورة ${chapterId}`));
          };
          
        } catch (error) {
          console.error(`خطأ في حذف السورة ${chapterId}:`, error);
          reject(new Error(`فشل في حذف السورة ${chapterId}`));
        }
      });
    } catch (error) {
      console.error(`خطأ عام في حذف السورة ${chapterId}:`, error);
      throw new Error(`فشل في حذف السورة ${chapterId}`);
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await this.ensureDBReady();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['chapters', 'verses', 'metadata'], 'readwrite');
        
        let completed = 0;
        const total = 3;
        
        const checkComplete = () => {
          completed++;
          if (completed === total) {
            console.log('تم مسح جميع البيانات المحلية');
            resolve();
          }
        };
        
        transaction.objectStore('chapters').clear().onsuccess = checkComplete;
        transaction.objectStore('verses').clear().onsuccess = checkComplete;
        transaction.objectStore('metadata').clear().onsuccess = checkComplete;
        
        transaction.onerror = () => {
          console.error('خطأ في مسح البيانات:', transaction.error);
          reject(new Error('فشل في مسح البيانات'));
        };
      });
    } catch (error) {
      console.error('خطأ عام في مسح البيانات:', error);
      throw new Error('فشل في مسح البيانات');
    }
  }

  async getStorageSize(): Promise<{ used: number; quota: number }> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0
        };
      }
    } catch (error) {
      console.error('خطأ في حساب حجم التخزين:', error);
    }
    
    return { used: 0, quota: 0 };
  }

  async validateDatabase(): Promise<boolean> {
    try {
      await this.ensureDBReady();
      
      return new Promise((resolve) => {
        const transaction = this.db!.transaction(['metadata'], 'readonly');
        const store = transaction.objectStore('metadata');
        
        const request = store.count();
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
        
        // إضافة timeout
        setTimeout(() => resolve(false), 3000);
      });
      
    } catch (error) {
      console.error('خطأ في التحقق من قاعدة البيانات:', error);
      return false;
    }
  }

  async downloadMultipleChapters(
    chapterIds: number[], 
    onProgress?: (overall: number, current: DownloadProgress) => void
  ): Promise<void> {
    const total = chapterIds.length;
    let completed = 0;
    
    console.log(`بدء تحميل ${total} سورة`);
    
    for (let i = 0; i < chapterIds.length; i++) {
      const chapterId = chapterIds[i];
      const overallProgress = Math.round((completed / total) * 100);
      
      try {
        onProgress?.(overallProgress, {
          chapterId,
          chapterName: `السورة ${chapterId}`,
          progress: 0,
          status: 'downloading'
        });
        
        await this.downloadChapter(chapterId, (progress) => {
          onProgress?.(overallProgress, {
            chapterId,
            chapterName: `السورة ${chapterId}`,
            progress,
            status: 'downloading'
          });
        });
        
        completed++;
        
        onProgress?.(Math.round((completed / total) * 100), {
          chapterId,
          chapterName: `السورة ${chapterId}`,
          progress: 100,
          status: 'completed'
        });
        
      } catch (error) {
        console.error(`فشل تحميل السورة ${chapterId}:`, error);
        onProgress?.(overallProgress, {
          chapterId,
          chapterName: `السورة ${chapterId}`,
          progress: 0,
          status: 'error'
        });
      }
    }
    
    onProgress?.(100, {
      chapterId: 0,
      chapterName: 'اكتمل التحميل',
      progress: 100,
      status: 'completed'
    });
    
    console.log(`تم الانتهاء من تحميل ${completed} من ${total} سورة`);
  }
}

export const offlineStorageService = new OfflineStorageService();
