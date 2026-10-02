import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Use initializeFirestore to enable long polling and specify the correct database ID
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

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
    // We use getDocFromServer to verify if the database is reachable online
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("✅ Firestore connection: READY");
  } catch (error: any) {
    // We don't throw here to avoid crashing the app, but we log the specific reason
    if (error.message && error.message.includes('the client is offline')) {
      console.error("❌ Firestore connection: OFFLINE. Please check your Firebase configuration or network.");
    } else {
      console.error("❌ Firestore connection: ERROR", error);
      if (error.code === 'unavailable' || (error.message && error.message.includes('offline'))) {
        window.dispatchEvent(new CustomEvent('firebase-connection-failed'));
      }
    }
  }
}
testConnection();
