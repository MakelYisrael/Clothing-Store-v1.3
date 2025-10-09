import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { PRODUCTS_COLLECTION, REVIEWS_SUB } from "../lib/collections";
import { stripUndefined } from "../lib/firestore-utils";
import type { Review } from "../components/product-reviews";

export async function addProductReview(productId: string, review: Review) {
  await addDoc(collection(db, PRODUCTS_COLLECTION, productId, REVIEWS_SUB), stripUndefined({
    ...review,
    createdAt: serverTimestamp(),
  }));
}
