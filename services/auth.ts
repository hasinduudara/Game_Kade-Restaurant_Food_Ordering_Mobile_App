import { auth, db } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// 1. Log Out Function
export const logout = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Logout Error:", error);
        throw error;
    }
};

// 2. Get User Data from Firestore
export const getUserData = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return null;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return {
                uid: user.uid,
                email: user.email,
                fullName: user.displayName || "User",
                phone: "Not Provided",
                photoURL: user.photoURL
            };
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};