
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
  private dbVersion = 3; // زيادة رقم الإصدار
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async initDB(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      // التحقق من دعم IndexedDB
      if (!window.indexedDB) {
        reject(new Error('IndexedDB is not supported on this device'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('خطأ في فتح قاعدة البيانات:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('تم فتح قاعدة البيانات بنجاح');
        
        // إضافة معالج للأخطاء
        this.db.onerror = (event) => {
          console.error('خطأ في قاعدة البيانات:', event);
        };
        
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

      request.onblocked = () => {
        console.warn('Database upgrade blocked. Please close other tabs.');
      };
    });

    return this.initPromise;
  }

  async ensureDBReady(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  private async executeTransaction<T>(
    storeNames: string[], 
    mode: IDBTransactionMode, 
    operation: (transaction: IDBTransaction) => Promise<T>
  ): Promise<T> {
    await this.ensureDBReady();
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(storeNames, mode);
        
        transaction.onerror = () => {
          console.error('Transaction error:', transaction.error);
          reject(transaction.error);
        };
        
        transaction.onabort = () => {
          console.error('Transaction aborted');
          reject(new Error('Transaction aborted'));
        };
        
        operation(transaction).then(resolve).catch(reject);
        
      } catch (error) {
        console.error('Error creating transaction:', error);
        reject(error);
      }
    });
  }

  async saveChapter(chapter: any): Promise<void> {
    return this.executeTransaction(['chapters'], 'readwrite', async (transaction) => {
      return new Promise<void>((resolve, reject) => {
        const store = transaction.objectStore('chapters');
        
        // تحسين تنسيق البيانات
        const chapterData = {
          id: chapter.id,
          name_arabic: chapter.name_arabic || chapter.name || `السورة ${chapter.id}`,
          name_simple: chapter.name_simple || chapter.englishName || chapter.name_simple || '',
          translated_name: chapter.translated_name || { name: chapter.englishNameTranslation || '' },
          verses_count: chapter.verses_count || chapter.numberOfAyahs || 0,
          revelation_place: chapter.revelation_place || (chapter.revelationType && chapter.revelationType.toLowerCase()) || 'makkah',
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
          reject(request.error);
        };
      });
    });
  }

  async saveVerses(chapterId: number, verses: any[]): Promise<void> {
    return this.executeTransaction(['verses'], 'readwrite', async (transaction) => {
      return new Promise<void>((resolve, reject) => {
        const store = transaction.objectStore('verses');
        
        const versesData = {
          chapterId,
          verses: verses.map((verse, index) => ({
            id: verse.id || verse.numberInSurah || index + 1,
            text_uthmani: verse.text_uthmani || verse.text || '',
            text_simple: verse.text_simple || verse.text || '',
            verse_key: verse.verse_key || `${chapterId}:${verse.id || verse.numberInSurah || index + 1}`,
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
          reject(request.error);
        };
      });
    });
  }

  async getChapter(chapterId: number): Promise<any | null> {
    return this.executeTransaction(['chapters'], 'readonly', async (transaction) => {
      return new Promise<any | null>((resolve, reject) => {
        const store = transaction.objectStore('chapters');
        const request = store.get(chapterId);
        
        request.onsuccess = () => {
          const result = request.result;
          console.log(`استرجاع السورة ${chapterId}:`, result ? 'موجودة' : 'غير موجودة');
          resolve(result || null);
        };
        
        request.onerror = () => {
          console.error(`خطأ في استرجاع السورة ${chapterId}:`, request.error);
          reject(request.error);
        };
      });
    });
  }

  async getVerses(chapterId: number): Promise<any[] | null> {
    return this.executeTransaction(['verses'], 'readonly', async (transaction) => {
      return new Promise<any[] | null>((resolve, reject) => {
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
          reject(request.error);
        };
      });
    });
  }

  async getDownloadedChapters(): Promise<number[]> {
    try {
      return await this.executeTransaction(['metadata'], 'readonly', async (transaction) => {
        return new Promise<number[]>((resolve, reject) => {
          const store = transaction.objectStore('metadata');
          const request = store.get('downloadedChapters');
          
          request.onsuccess = () => {
            const result = request.result;
            const chapters = result ? result.value : [];
            console.log('السور المحملة:', chapters);
            resolve(chapters);
          };
          
          request.onerror = () => {
            console.error('خطأ في استرجاع قائمة السور المحملة:', request.error);
            resolve([]); // إرجاع مصفوفة فارغة في حالة الخطأ
          };
        });
      });
    } catch (error) {
      console.error('خطأ في الوصول لقائمة السور المحملة:', error);
      return [];
    }
  }

  async updateDownloadedChapters(chapterIds: number[]): Promise<void> {
    return this.executeTransaction(['metadata'], 'readwrite', async (transaction) => {
      return new Promise<void>((resolve, reject) => {
        const store = transaction.objectStore('metadata');
        
        const data = {
          key: 'downloadedChapters',
          value: [...new Set(chapterIds)], // إزالة التكرارات
          lastUpdated: new Date().toISOString()
        };
        
        const request = store.put(data);
        
        request.onsuccess = () => {
          console.log('تم تحديث قائمة السور المحملة:', chapterIds);
          resolve();
        };
        
        request.onerror = () => {
          console.error('خطأ في تحديث قائمة السور المحملة:', request.error);
          reject(request.error);
        };
      });
    });
  }

  async downloadChapter(chapterId: number, onProgress?: (progress: number) => void): Promise<void> {
    try {
      console.log(`بدء تحميل السورة ${chapterId}`);
      onProgress?.(5);

      // التحقق من وجود السورة مسبقاً
      const existingChapter = await this.getChapter(chapterId);
      if (existingChapter) {
        console.log(`السورة ${chapterId} موجودة مسبقاً`);
        onProgress?.(100);
        return;
      }

      onProgress?.(10);
      
      // تحميل بيانات السورة من API
      let chapterData, versesData;
      
      try {
        console.log(`تحميل بيانات السورة ${chapterId} من API الأساسي`);
        
        // محاولة API الأساسي أولاً
        const chapterResponse = await fetch(`https://api.quranapi.pages.dev/chapters/${chapterId}/verses`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!chapterResponse.ok) {
          throw new Error(`HTTP ${chapterResponse.status}: ${chapterResponse.statusText}`);
        }
        
        const data = await chapterResponse.json();
        chapterData = data.chapter;
        versesData = data.verses;
        
        console.log(`تم تحميل البيانات من API الأساسي: ${versesData.length} آية`);
        onProgress?.(60);
        
      } catch (error) {
        console.log('فشل API الأساسي، استخدام API البديل...', error);
        
        // استخدام API البديل
        try {
          const fallbackResponse = await fetch(`https://api.alquran.cloud/v1/surah/${chapterId}/quran-uthmani`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (!fallbackResponse.ok) {
            throw new Error(`HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
          }
          
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.code !== 200 || !fallbackData.data) {
            throw new Error('Invalid response from fallback API');
          }
          
          const surah = fallbackData.data;
          
          // تحويل البيانات إلى التنسيق المطلوب
          chapterData = {
            id: surah.number,
            name_arabic: surah.name,
            name_simple: surah.englishName,
            translated_name: { name: surah.englishNameTranslation },
            verses_count: surah.ayahs.length,
            revelation_place: surah.revelationType.toLowerCase(),
            bismillah_pre: surah.number !== 1 && surah.number !== 9
          };
          
          versesData = surah.ayahs.map(ayah => ({
            id: ayah.numberInSurah,
            text_uthmani: ayah.text,
            text_simple: ayah.text,
            verse_key: `${surah.number}:${ayah.numberInSurah}`,
            juz_number: ayah.juz,
            page_number: ayah.page
          }));
          
          console.log(`تم تحميل البيانات من API البديل: ${versesData.length} آية`);
          onProgress?.(60);
          
        } catch (fallbackError) {
          console.error('فشل في جميع مصادر البيانات:', fallbackError);
          throw new Error(`فشل في تحميل البيانات: ${fallbackError.message}`);
        }
      }
      
      if (!chapterData || !versesData || versesData.length === 0) {
        throw new Error('لم يتم الحصول على البيانات أو البيانات فارغة');
      }
      
      onProgress?.(70);
      
      // حفظ البيانات محلياً
      await this.saveChapter(chapterData);
      onProgress?.(85);
      
      await this.saveVerses(chapterId, versesData);
      onProgress?.(95);
      
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
        // المتابعة مع السور الأخرى حتى لو فشلت سورة واحدة
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

  async isChapterDownloaded(chapterId: number): Promise<boolean> {
    try {
      const downloadedChapters = await this.getDownloadedChapters();
      const isDownloaded = downloadedChapters.includes(chapterId);
      
      // التحقق الإضافي من وجود البيانات فعلياً
      if (isDownloaded) {
        const chapter = await this.getChapter(chapterId);
        const verses = await this.getVerses(chapterId);
        return !!(chapter && verses && verses.length > 0);
      }
      
      return false;
    } catch (error) {
      console.error(`خطأ في التحقق من تحميل السورة ${chapterId}:`, error);
      return false;
    }
  }

  async deleteChapter(chapterId: number): Promise<void> {
    return this.executeTransaction(['chapters', 'verses', 'metadata'], 'readwrite', async (transaction) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          // حذف السورة
          const chaptersStore = transaction.objectStore('chapters');
          const deleteChapterRequest = chaptersStore.delete(chapterId);
          
          deleteChapterRequest.onsuccess = async () => {
            // حذف الآيات
            const versesStore = transaction.objectStore('verses');
            const deleteVersesRequest = versesStore.delete(chapterId);
            
            deleteVersesRequest.onsuccess = async () => {
              try {
                // تحديث قائمة السور المحملة
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
            
            deleteVersesRequest.onerror = () => {
              console.error(`خطأ في حذف آيات السورة ${chapterId}:`, deleteVersesRequest.error);
              reject(deleteVersesRequest.error);
            };
          };
          
          deleteChapterRequest.onerror = () => {
            console.error(`خطأ في حذف السورة ${chapterId}:`, deleteChapterRequest.error);
            reject(deleteChapterRequest.error);
          };
          
        } catch (error) {
          console.error(`خطأ في حذف السورة ${chapterId}:`, error);
          reject(error);
        }
      });
    });
  }

  async clearAllData(): Promise<void> {
    return this.executeTransaction(['chapters', 'verses', 'metadata'], 'readwrite', async (transaction) => {
      return new Promise<void>((resolve, reject) => {
        let completed = 0;
        const total = 3;
        
        const checkComplete = () => {
          completed++;
          if (completed === total) {
            console.log('تم مسح جميع البيانات المحلية');
            resolve();
          }
        };
        
        const handleError = (error: any) => {
          console.error('خطأ في مسح البيانات:', error);
          reject(error);
        };
        
        const chaptersRequest = transaction.objectStore('chapters').clear();
        chaptersRequest.onsuccess = checkComplete;
        chaptersRequest.onerror = () => handleError(chaptersRequest.error);
        
        const versesRequest = transaction.objectStore('verses').clear();
        versesRequest.onsuccess = checkComplete;
        versesRequest.onerror = () => handleError(versesRequest.error);
        
        const metadataRequest = transaction.objectStore('metadata').clear();
        metadataRequest.onsuccess = checkComplete;
        metadataRequest.onerror = () => handleError(metadataRequest.error);
      });
    });
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

  // دالة للتحقق من صحة قاعدة البيانات
  async validateDatabase(): Promise<boolean> {
    try {
      await this.ensureDBReady();
      
      // اختبار بسيط للتأكد من عمل قاعدة البيانات
      return await this.executeTransaction(['metadata'], 'readonly', async (transaction) => {
        return new Promise<boolean>((resolve) => {
          const store = transaction.objectStore('metadata');
          const request = store.count();
          request.onsuccess = () => resolve(true);
          request.onerror = () => resolve(false);
        });
      });
      
    } catch (error) {
      console.error('خطأ في التحقق من قاعدة البيانات:', error);
      return false;
    }
  }
}

export const offlineStorageService = new OfflineStorageService();
