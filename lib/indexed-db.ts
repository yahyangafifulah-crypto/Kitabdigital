export interface PesantrenKitab {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  blob: Blob;
}

const DB_NAME = "KitabPesantrenDB";
const DB_VERSION = 1;
const STORE_NAME = "kitabs";

// In-memory fallback for sandboxed iframes or private browsing where IndexedDB is blocked
let memoryKitabs: PesantrenKitab[] = [];
let useMemoryFallback = false;

export function isUsingMemoryFallback(): boolean {
  return useMemoryFallback;
}

export function initDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        useMemoryFallback = true;
        resolve(null);
        return;
      }
      
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.warn("IndexedDB blocked or failed to open. Falling back to in-memory session storage:", event);
        useMemoryFallback = true;
        resolve(null);
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    } catch (e) {
      console.warn("IndexedDB access threw an error. Using session-based memory fallback:", e);
      useMemoryFallback = true;
      resolve(null);
    }
  });
}

export async function saveKitab(kitab: PesantrenKitab): Promise<void> {
  const db = await initDB();
  if (!db || useMemoryFallback) {
    const index = memoryKitabs.findIndex(k => k.id === kitab.id);
    if (index > -1) {
      memoryKitabs[index] = { ...kitab };
    } else {
      memoryKitabs.push({ ...kitab });
    }
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(kitab);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.warn("Put transaction failed. Falling back to memory storage.");
        const index = memoryKitabs.findIndex(k => k.id === kitab.id);
        if (index > -1) {
          memoryKitabs[index] = { ...kitab };
        } else {
          memoryKitabs.push({ ...kitab });
        }
        resolve();
      };
    } catch (e) {
      console.warn("Transaction execution failed. Falling back to memory storage:", e);
      const index = memoryKitabs.findIndex(k => k.id === kitab.id);
      if (index > -1) {
        memoryKitabs[index] = { ...kitab };
      } else {
        memoryKitabs.push({ ...kitab });
      }
      resolve();
    }
  });
}

export async function getAllKitabs(): Promise<PesantrenKitab[]> {
  const db = await initDB();
  if (!db || useMemoryFallback) {
    return [...memoryKitabs];
  }

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => {
        console.warn("Get transaction failed. Returning memory fallback.");
        resolve([...memoryKitabs]);
      };
    } catch (e) {
      console.warn("Transaction execution failed. Returning memory fallback:", e);
      resolve([...memoryKitabs]);
    }
  });
}

export async function deleteKitab(id: string): Promise<void> {
  const db = await initDB();
  if (!db || useMemoryFallback) {
    memoryKitabs = memoryKitabs.filter(k => k.id !== id);
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        memoryKitabs = memoryKitabs.filter(k => k.id !== id);
        resolve();
      };
    } catch (e) {
      memoryKitabs = memoryKitabs.filter(k => k.id !== id);
      resolve();
    }
  });
}
