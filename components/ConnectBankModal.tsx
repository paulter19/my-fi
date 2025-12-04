import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch } from 'react-redux';

interface ConnectBankModalProps {
    visible: boolean;
    onClose: () => void;
    isDark: boolean;
}

export const ConnectBankModal: React.FC<ConnectBankModalProps> = ({ visible, onClose, isDark }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // const { collectBankAccountToken } = useFinancialConnectionsSheet();

    const handleConnect = async () => {
        setLoading(true);
        try {
            // 1. Get Client Secret from Backend
            // const { clientSecret, publishableKey } = await stripeService.createSession();

            // 2. Present Stripe Sheet
            // const { session, error } = await collectBankAccountToken(clientSecret);

            // if (error) {
            //     console.log('Stripe Error:', error);
            //     setLoading(false);
            //     return;
            // }

            // if (session) {
            //     // 3. Fetch Account Details from Backend
            //     const accounts = await stripeService.fetchAccounts(session.id);

            //     for (const acc of accounts) {
            //         const accountId = nanoid();

            //         // Add Account
            //         dispatch(addAccount({
            //             id: accountId,
            //             name: acc.institution_name + ' ' + acc.last4,
            //             type: 'checking', // Simplified mapping
            //             balance: acc.balance.current, // Assuming USD
            //             currency: acc.currency,
            //             source: 'stripe',
            //             stripeAccountId: acc.id,
            //             lastSynced: new Date().toISOString()
            //         }));

            //         // 4. Fetch Transactions
            //         const transactions = await stripeService.fetchTransactions(acc.id);
            //         transactions.forEach((t: any) => {
            //             dispatch(addTransaction({
            //                 id: t.id,
            //                 title: t.description,
            //                 amount: Math.abs(t.amount / 100), // Stripe amounts are in cents
            //                 date: new Date(t.transacted_at * 1000).toISOString().split('T')[0],
            //                 category: 'Uncategorized', // Stripe categories might need mapping
            //                 type: t.amount < 0 ? 'expense' : 'income',
            //                 accountId
            //             }));
            //         });
            //     }

            //     onClose();
            // }
            console.log("Stripe integration disabled");
        } catch (e) {
            console.error('Connection failed', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, isDark && styles.containerDark]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={isDark ? 'white' : '#333'} />
                    </TouchableOpacity>
                    <View style={styles.stripeBadge}>
                        <Text style={styles.stripeText}>Stripe Secured</Text>
                    </View>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    <Text style={[styles.title, isDark && styles.textDark]}>Connect your bank</Text>
                    <Text style={[styles.subtitle, isDark && styles.subTextDark]}>
                        Link your bank account to automatically sync balances and transactions.
                    </Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#635BFF" style={{ marginTop: 40 }} />
                    ) : (
                        <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
                            <Text style={styles.connectButtonText}>Connect with Stripe</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    stripeBadge: {
        backgroundColor: '#635BFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    stripeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    connectButton: {
        backgroundColor: '#635BFF',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    connectButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textDark: {
        color: 'white',
    },
    subTextDark: {
        color: '#AAA',
    },
});
