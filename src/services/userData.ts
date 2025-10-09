import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { USERS_COLLECTION, USER_ADDRESSES_SUB, USER_ORDERS_SUB } from "../lib/collections";
import { stripUndefined } from "../lib/firestore-utils";
import type { CartItem } from "../components/cart-sheet";

export type UserStoredData = {
  wishlist?: string[];
  cart?: CartItem[];
};

export async function loadUserData(uid: string): Promise<UserStoredData> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  return (snap.exists() ? (snap.data() as UserStoredData) : {}) as UserStoredData;
}

export async function saveWishlist(uid: string, wishlist: string[]) {
  const ref = doc(db, USERS_COLLECTION, uid);
  await setDoc(ref, stripUndefined({ wishlist }), { merge: true });
}

export async function saveCart(uid: string, cart: CartItem[]) {
  const ref = doc(db, USERS_COLLECTION, uid);
  await setDoc(ref, stripUndefined({ cart }), { merge: true });
}

export async function clearOldUserData(uid: string): Promise<void> {
  const addrSnap = await getDocs(collection(db, "users", uid, USER_ADDRESSES_SUB));
  for (const d of addrSnap.docs) {
    await deleteDoc(doc(db, "users", uid, USER_ADDRESSES_SUB, d.id));
  }
  const ordSnap = await getDocs(collection(db, "users", uid, USER_ORDERS_SUB));
  for (const d of ordSnap.docs) {
    await deleteDoc(doc(db, "users", uid, USER_ORDERS_SUB, d.id));
  }
  await deleteDoc(doc(db, "users", uid));
}
