import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth } from '../firebaseConfig'; // Ensure Firebase Auth is set up

const db = getFirestore();

export const addToFavorites = async (article) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const userFavoritesRef = doc(db, 'favorites', user.uid);
    const docSnapshot = await getDoc(userFavoritesRef);

    if (!docSnapshot.exists()) {
        await setDoc(userFavoritesRef, { articles: [article] });
    } else {
        await updateDoc(userFavoritesRef, {
            articles: arrayUnion(article)
        });
    }
};

export const getFavorites = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const userFavoritesRef = doc(db, 'favorites', user.uid);
    const docSnapshot = await getDoc(userFavoritesRef);

    if (docSnapshot.exists()) {
        return docSnapshot.data().articles || [];
    } else {
        return [];
    }
};
