import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { auth, db } from "../lib/firebase";
import { USERS_COLLECTION, USER_ORDERS_SUB } from "../lib/collections";
import { clearOldUserData } from "../services/userData";
import { stripUndefined } from "../lib/firestore-utils";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  linkWithPopup,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

let pendingAccountLink: { email: string; credential: any } | null = null;

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  joinedDate: string;
  isSeller?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  shippingAddress: {
    name?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

type GoogleLoginResult = { ok: true } | { ok: false; code?: string; message?: string };

interface UserContextType {
  user: User | null;
  orders: Order[];
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<GoogleLoginResult>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<void>;
  updateUserProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // using shared stripUndefined utility for Firestore writes

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const uid = fbUser.uid;
        const profileRef = doc(db, USERS_COLLECTION, uid);
        const snap = await getDoc(profileRef);
        let profile: User = {
          id: uid,
          email: fbUser.email || "",
          name: fbUser.displayName || "",
          avatar: fbUser.photoURL ?? null,
          joinedDate: new Date().toISOString().split('T')[0],
          isSeller: false,
        };
        if (snap.exists()) {
          const data = snap.data() as Partial<User>;
          profile = { ...profile, ...data, id: uid } as User;
        } else {
          await setDoc(profileRef, stripUndefined(profile), { merge: true });
        }
        try { await clearOldUserData(uid); } catch {}
        setUser(profile);
        const q = query(collection(db, USERS_COLLECTION, uid, USER_ORDERS_SUB), orderBy("createdAt", "desc"));
        const ordersSnap = await getDocs(q);
        const loaded: Order[] = ordersSnap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) }));
        setOrders(loaded);
      } else {
        setUser(null);
        setOrders([]);
      }
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (pendingAccountLink && auth.currentUser?.email === pendingAccountLink.email) {
        try {
          await linkWithCredential(auth.currentUser!, pendingAccountLink.credential);
        } catch {}
        pendingAccountLink = null;
      }
      return true;
    } catch {
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<GoogleLoginResult> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const inIframe = typeof window !== 'undefined' && window.self !== window.top;
    try {
      if (auth.currentUser) {
        if (inIframe) {
          await signInWithRedirect(auth, provider);
          return { ok: true };
        }
        await linkWithPopup(auth.currentUser, provider);
        return { ok: true };
      }
      if (inIframe) {
        await signInWithRedirect(auth, provider);
        return { ok: true };
      }
      await signInWithPopup(auth, provider);
      return { ok: true };
    } catch (e: any) {
      const code = e?.code as string | undefined;
      if (code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user') {
        try {
          await signInWithRedirect(auth, provider);
          return { ok: true };
        } catch (e2: any) {
          return { ok: false, code: e2?.code, message: e2?.message };
        }
      }
      if (code === 'auth/account-exists-with-different-credential') {
        const email = e?.customData?.email as string | undefined;
        const cred = GoogleAuthProvider.credentialFromError?.(e);
        if (email && cred) {
          pendingAccountLink = { email, credential: cred };
          try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            if (methods.includes('password')) {
              return { ok: false, code: 'link-with-password', message: 'Email already used. Sign in with your password to link Google.' };
            }
            return { ok: false, code: 'link-with-' + (methods[0] || 'existing'), message: 'Email already used. Sign in with your existing method to link.' };
          } catch {}
        }
      }
      return { ok: false, code, message: e?.message };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        try { await updateProfile(auth.currentUser, { displayName: name }); } catch {}
      }
      const profile: User = {
        id: cred.user.uid,
        email,
        name,
        avatar: null,
        joinedDate: new Date().toISOString().split('T')[0],
        isSeller: false,
      };
      await setDoc(doc(db, USERS_COLLECTION, cred.user.uid), stripUndefined(profile), { merge: true });
      try { await clearOldUserData(cred.user.uid); } catch {}
      setUser(profile);
      setOrders([]);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setOrders([]);
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setOrders((prev) => [newOrder, ...prev]);
    if (user) {
      try {
        await addDoc(collection(db, USERS_COLLECTION, user.id, USER_ORDERS_SUB), stripUndefined({
          ...newOrder,
          createdAt: serverTimestamp(),
        }));
      } catch {}
    }
  };

  const updateUserProfile = async (updates: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => {
    if (user) {
      const next = { ...user, ...updates } as User;
      setUser(next);
      try {
        await setDoc(doc(db, USERS_COLLECTION, user.id), stripUndefined(updates), { merge: true });
      } catch {}
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      orders,
      login,
      loginWithGoogle,
      signup,
      logout,
      addOrder,
      updateUserProfile,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
