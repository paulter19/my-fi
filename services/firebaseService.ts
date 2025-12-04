import { db } from '@/firebaseConfig';
import { RootState } from '@/store/store';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const firebaseService = {
    saveUserData: async (userId: string, data: Partial<RootState>) => {
        try {
            const userRef = doc(db, 'users', userId);

            // Save each slice as a separate collection or document to avoid size limits
            // For simplicity in this MVP, we'll save to a 'data' subcollection

            if (data.bills) {
                await setDoc(doc(db, 'users', userId, 'data', 'bills'), data.bills);
            }
            if (data.income) {
                await setDoc(doc(db, 'users', userId, 'data', 'income'), data.income);
            }
            if (data.transactions) {
                await setDoc(doc(db, 'users', userId, 'data', 'transactions'), data.transactions);
            }
            if (data.accounts) {
                await setDoc(doc(db, 'users', userId, 'data', 'accounts'), data.accounts);
            }

            console.log('Data saved to Firestore');
        } catch (error) {
            console.error('Error saving data to Firestore:', error);
        }
    },

    fetchUserData: async (userId: string) => {
        try {
            const billsSnap = await getDoc(doc(db, 'users', userId, 'data', 'bills'));
            const incomeSnap = await getDoc(doc(db, 'users', userId, 'data', 'income'));
            const transactionsSnap = await getDoc(doc(db, 'users', userId, 'data', 'transactions'));
            const accountsSnap = await getDoc(doc(db, 'users', userId, 'data', 'accounts'));

            return {
                bills: billsSnap.exists() ? billsSnap.data() : undefined,
                income: incomeSnap.exists() ? incomeSnap.data() : undefined,
                transactions: transactionsSnap.exists() ? transactionsSnap.data() : undefined,
                accounts: accountsSnap.exists() ? accountsSnap.data() : undefined,
            };
        } catch (error) {
            console.error('Error fetching data from Firestore:', error);
            return null;
        }
    }
};
