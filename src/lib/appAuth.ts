import { auth } from './firebase';
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';

export interface AppAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
}

const STORAGE_AUTH_KEY = 'doc_va_tre_auth_session_v1';
const AUTH_EVENT = 'doc_va_tre_auth_changed';

export function getStoredAuthUser(): AppAuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_AUTH_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return null;
}

export function setStoredAuthUser(user: AppAuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_AUTH_KEY);
    }
  } catch (e) {}
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: user }));
}

export function subscribeAuth(callback: (user: AppAuthUser | null) => void): () => void {
  // 1. Initial callback with stored or Firebase user
  const stored = getStoredAuthUser();
  if (stored) {
    callback(stored);
  } else if (auth.currentUser) {
    const u = auth.currentUser;
    const appUser: AppAuthUser = {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
      isAnonymous: u.isAnonymous,
      emailVerified: u.emailVerified,
    };
    callback(appUser);
  } else {
    callback(null);
  }

  // 2. Listen to custom auth event
  const handleCustomEvent = (e: any) => {
    callback(e.detail || null);
  };
  window.addEventListener(AUTH_EVENT, handleCustomEvent);

  // 3. Listen to Firebase auth
  const unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const appUser: AppAuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        isAnonymous: firebaseUser.isAnonymous,
        emailVerified: firebaseUser.emailVerified,
      };
      setStoredAuthUser(appUser);
      callback(appUser);
    } else {
      // Only set null if there was no stored fallback user
      const currentStored = getStoredAuthUser();
      if (!currentStored) {
        callback(null);
      }
    }
  });

  return () => {
    window.removeEventListener(AUTH_EVENT, handleCustomEvent);
    unsubscribeFirebase();
  };
}

export async function appSignOut() {
  try {
    await firebaseSignOut(auth);
  } catch (e) {}
  setStoredAuthUser(null);
}
