import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";
import { USERS_COLLECTION, USER_ADDRESSES_SUB } from "../lib/collections";
import { stripUndefined } from "../lib/firestore-utils";

export type Address = {
  id?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
};

export async function listAddresses(uid: string): Promise<Address[]> {
  const col = collection(db, USERS_COLLECTION, uid, USER_ADDRESSES_SUB);
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Address, "id">) }));
}

export async function addAddress(uid: string, address: Address): Promise<Address | null> {
  const col = collection(db, USERS_COLLECTION, uid, USER_ADDRESSES_SUB);
  const ref = await addDoc(col, stripUndefined(address));
  return { ...address, id: ref.id };
}

export async function deleteAddress(uid: string, addressId: string): Promise<void> {
  await deleteDoc(doc(db, USERS_COLLECTION, uid, USER_ADDRESSES_SUB, addressId));
}

export async function updateAddress(uid: string, addressId: string, partial: Partial<Address>): Promise<void> {
  await updateDoc(doc(db, USERS_COLLECTION, uid, USER_ADDRESSES_SUB, addressId), stripUndefined(partial) as any);
}

export async function setDefaultAddress(uid: string, addressId: string): Promise<void> {
  const col = collection(db, USERS_COLLECTION, uid, USER_ADDRESSES_SUB);
  const snap = await getDocs(col);
  const batch = writeBatch(db);
  snap.docs.forEach(d => {
    const target = doc(db, USERS_COLLECTION, uid, USER_ADDRESSES_SUB, d.id);
    const makeDefault = d.id === addressId;
    batch.update(target, { isDefault: makeDefault });
  });
  await batch.commit();
}
