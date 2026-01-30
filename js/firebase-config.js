// ===================================
// SkillOrbit - Firebase Configuration
// ===================================

// Firebase configuration - Replace with your own config
const firebaseConfig = {
    apiKey: "AIzaSyDFAuo5deSArYV6I8GqUmHGlVjDx27x0QM",
    authDomain: "test-projects-34f9b.firebaseapp.com",
    projectId: "test-projects-34f9b",
    storageBucket: "test-projects-34f9b.firebasestorage.app",
    messagingSenderId: "707160789934",
    appId: "1:707160789934:web:429b47ab1088dc0f95ae3f"
};

// Initialize Firebase (check if already initialized)
let app, auth, db, storage;

if (typeof firebase !== 'undefined') {
    // Using Firebase compat SDK
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
} else {
    console.warn('Firebase SDK not loaded. Running in demo mode.');
}

// Auth state observer
function initAuthObserver(callback) {
    if (auth) {
        auth.onAuthStateChanged((user) => {
            if (callback) callback(user);
        });
    }
}

// Sign up with email
async function signUpWithEmail(email, password, displayName) {
    try {
        if (!auth) throw new Error('Firebase not initialized');

        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Update display name
        await user.updateProfile({ displayName });

        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            email: user.email,
            displayName: displayName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            role: 'user',
            enrolledCourses: [],
            isActive: true
        });

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign in with email
async function signInWithEmail(email, password) {
    try {
        if (!auth) throw new Error('Firebase not initialized');

        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign in with Google
async function signInWithGoogle() {
    try {
        if (!auth) throw new Error('Firebase not initialized');

        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // Check if user document exists
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (!userDoc.exists) {
            // Create user document
            await db.collection('users').doc(user.uid).set({
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                role: 'user',
                enrolledCourses: [],
                isActive: true
            });
        }

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign out
async function signOut() {
    try {
        if (!auth) throw new Error('Firebase not initialized');
        await auth.signOut();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Password reset
async function sendPasswordReset(email) {
    try {
        if (!auth) throw new Error('Firebase not initialized');
        await auth.sendPasswordResetEmail(email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get current user
function getCurrentUser() {
    return auth ? auth.currentUser : null;
}

// Check if user is admin
async function isUserAdmin(userId) {
    try {
        if (!db) return false;
        const userDoc = await db.collection('users').doc(userId).get();
        return userDoc.exists && userDoc.data().role === 'admin';
    } catch (error) {
        return false;
    }
}

// Export functions
window.FirebaseAuth = {
    initAuthObserver,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    getCurrentUser,
    isUserAdmin
};

// Firestore helpers
window.FirestoreDB = {
    // Get all courses
    getCourses: async function () {
        try {
            if (!db) return [];
            const snapshot = await db.collection('courses').orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting courses:', error);
            return [];
        }
    },

    // Get single course
    getCourse: async function (courseId) {
        try {
            if (!db) return null;
            const doc = await db.collection('courses').doc(courseId).get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (error) {
            console.error('Error getting course:', error);
            return null;
        }
    },

    // Get user's enrolled courses
    getUserCourses: async function (userId) {
        try {
            if (!db) return [];
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) return [];

            const enrolledCourses = userDoc.data().enrolledCourses || [];
            if (enrolledCourses.length === 0) return [];

            const coursesSnapshot = await db.collection('courses')
                .where(firebase.firestore.FieldPath.documentId(), 'in', enrolledCourses)
                .get();

            return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting user courses:', error);
            return [];
        }
    },

    // Enroll user in course
    enrollInCourse: async function (userId, courseId) {
        try {
            if (!db) throw new Error('Firebase not initialized');

            await db.collection('users').doc(userId).update({
                enrolledCourses: firebase.firestore.FieldValue.arrayUnion(courseId)
            });

            // Create order record
            await db.collection('orders').add({
                userId,
                courseId,
                status: 'completed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
