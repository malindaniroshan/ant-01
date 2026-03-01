/**
 * firebase-init.js
 * Shared Firebase initialization for all pages.
 * Load this AFTER the Firebase CDN scripts and BEFORE db.js.
 *
 * ⚠️  databaseURL: If your Realtime Database was created in a non-US region
 *     the URL may end in  .asia-southeast1.firebasedatabase.app  (or similar).
 *     Verify it in Firebase Console → Realtime Database → Data tab.
 */

const firebaseConfig = {
    apiKey: "AIzaSyA7DOUMniUxGZue10XZbRszD2hQF3ueTVg",
    authDomain: "portfolio-3c910.firebaseapp.com",
    databaseURL: "https://portfolio-3c910-default-rtdb.firebaseio.com",
    projectId: "portfolio-3c910",
    storageBucket: "portfolio-3c910.firebasestorage.app",
    messagingSenderId: "555659527531",
    appId: "1:555659527531:web:d6a229cec75ae7059f382e",
    measurementId: "G-12FK7KPLP2"
};

// Prevent re-initialising if already done (e.g. hot-reload)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
