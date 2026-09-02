import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
export { firebaseConfig };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use the specific firestoreDatabaseId provisioned for this applet
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

/**
 * Saves or updates a single document in Firestore
 */
export async function saveDocToFirestore<T extends { id: string }>(collectionName: string, data: T): Promise<void> {
  if (!data || !data.id) return;
  try {
    const docRef = doc(db, collectionName, String(data.id));
    // Remove undefined properties before sending to Firestore
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, cleanData, { merge: true });
  } catch (err) {
    console.error(`[Firestore] Error saving document to ${collectionName}/${data.id}:`, err);
  }
}

/**
 * Deletes a document from Firestore by ID
 */
export async function deleteDocFromFirestore(collectionName: string, id: string): Promise<void> {
  if (!id) return;
  try {
    const docRef = doc(db, collectionName, String(id));
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`[Firestore] Error deleting document ${collectionName}/${id}:`, err);
  }
}

/**
 * Fetches all documents from a Firestore collection once
 */
export async function fetchCollectionFromFirestore<T>(collectionName: string): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const items: T[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as T);
    });
    return items;
  } catch (err) {
    console.error(`[Firestore] Error fetching collection ${collectionName}:`, err);
    return [];
  }
}

/**
 * Subscribes to real-time updates for a Firestore collection
 */
export function subscribeCollectionFromFirestore<T>(
  collectionName: string,
  onData: (data: T[]) => void
): () => void {
  try {
    const colRef = collection(db, collectionName);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as T);
        });
        onData(items);
      },
      (err) => {
        console.warn(`[Firestore] Real-time listener warning for ${collectionName}:`, err);
      }
    );
  } catch (err) {
    console.warn(`[Firestore] Failed to attach listener for ${collectionName}:`, err);
    return () => {};
  }
}
