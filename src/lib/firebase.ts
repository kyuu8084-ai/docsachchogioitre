import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Use initializeFirestore to enable long polling, which is more reliable in some proxy environments
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId
);

export const auth = getAuth();

// Removed automatic anonymous sign-in to prevent unauthorized guest login.
// Users can choose to sign in as guest via the AuthModal.
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Handle user state if needed
  }
});

// Initialize Analytics if supported
isSupported().then(yes => {
  if (yes) {
    try {
      getAnalytics(app);
    } catch (e) {
      console.warn("Analytics initialization failed:", e);
    }
  }
});

// Test connection with a more descriptive log
async function testConnection() {
  console.log("Checking Firestore connection for project:", firebaseConfig.projectId);
  try {
    // We use a simple getDoc to verify if the database is reachable
    await getDoc(doc(db, 'test', 'connection'));
    console.log("✅ Firestore connection: READY");
  } catch (error: any) {
    // We don't throw here to avoid crashing the app, but we log the specific reason
    if (error.code === 'failed-precondition' || error.message.includes('offline')) {
      console.error("❌ Firestore connection: OFFLINE. This is usually because the Database has not been created in the Firebase Console yet.");
    } else {
      console.error("❌ Firestore connection: ERROR", error);
      if (error.code === 'unavailable') {
        window.dispatchEvent(new CustomEvent('firebase-connection-failed'));
      }
    }
  }
}
testConnection();
