import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Collection name
const RESEARCH_GROUPS_COLLECTION = 'researchGroups';

// Research Group interface
export interface ResearchGroup {
  id: string;
  name: string;
  description: string;
  howToJoin: string;
  docsLink: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simple password hashing function (SHA-256)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const adminHash = await hashPassword('admin2025');
  const inputHash = await hashPassword(password);

  // Check if it's admin password or matches the stored hash
  return inputHash === adminHash || inputHash === hash;
}

// Create a new research group
export async function createResearchGroup(
  data: Omit<ResearchGroup, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'> & { password: string }
): Promise<string> {
  try {
    const passwordHash = await hashPassword(data.password);
    const docRef = await addDoc(collection(db, RESEARCH_GROUPS_COLLECTION), {
      name: data.name,
      description: data.description,
      howToJoin: data.howToJoin,
      docsLink: data.docsLink,
      passwordHash,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating research group:', error);
    throw error;
  }
}

// Get all research groups
export async function getAllResearchGroups(): Promise<ResearchGroup[]> {
  try {
    const q = query(collection(db, RESEARCH_GROUPS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      howToJoin: doc.data().howToJoin,
      docsLink: doc.data().docsLink,
      passwordHash: doc.data().passwordHash,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error getting research groups:', error);
    throw error;
  }
}

// Update a research group
export async function updateResearchGroup(
  id: string,
  data: Partial<Omit<ResearchGroup, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>>
): Promise<void> {
  try {
    const docRef = doc(db, RESEARCH_GROUPS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating research group:', error);
    throw error;
  }
}

// Delete a research group
export async function deleteResearchGroup(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, RESEARCH_GROUPS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting research group:', error);
    throw error;
  }
}
