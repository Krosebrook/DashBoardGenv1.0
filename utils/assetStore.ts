
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple IDB wrapper for Asset Management
// We use raw IDB to avoid adding 'idb' dependency as requested (minimal deps)

const DB_NAME = 'DashGenAssetsDB';
const STORE_NAME = 'assets';
const DB_VERSION = 1;

export interface Asset {
    id: string;
    name: string;
    type: string;
    blob: Blob;
    createdAt: number;
}

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
};

export const saveAsset = async (file: File): Promise<Asset> => {
    const db = await openDB();
    const asset: Asset = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: file.name,
        type: file.type,
        blob: file,
        createdAt: Date.now()
    };
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).add(asset);
        tx.oncomplete = () => resolve(asset);
        tx.onerror = () => reject(tx.error);
    });
};

export const getAllAssets = async (): Promise<Asset[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const request = tx.objectStore(STORE_NAME).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const deleteAsset = async (id: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
