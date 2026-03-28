import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";

const WISHES_COLLECTION = "wishes";

export interface Wish {
  id?: string;
  name: string;
  text: string;
  attendance: string;
  timestamp: number;
}

/**
 * Add a new wish to Firestore
 */
export const addWish = async (wish: Omit<Wish, "id" | "timestamp">) => {
  try {
    const docRef = await addDoc(collection(db, WISHES_COLLECTION), {
      ...wish,
      timestamp: Date.now(), // Store as number for compatibility with existing code
      createdAt: Timestamp.now(), // Also store as Firestore Timestamp for better indexing if needed
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding wish: ", error);
    throw error;
  }
};

/**
 * Subscribe to wishes collection for real-time updates
 */
export const subscribeToWishes = (callback: (wishes: Wish[]) => void) => {
  const q = query(collection(db, WISHES_COLLECTION), orderBy("timestamp", "desc"));
  
  return onSnapshot(q, (querySnapshot) => {
    const wishes: Wish[] = [];
    querySnapshot.forEach((doc) => {
      wishes.push({ id: doc.id, ...doc.data() } as Wish);
    });
    callback(wishes);
  }, (error) => {
    console.error("Error subscribing to wishes: ", error);
  });
};
