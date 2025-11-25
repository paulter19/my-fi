import { mockStripeService } from '@/services/stripeService';
import { addAccount } from '@/store/slices/accountsSlice';
import { addTransaction } from '@/store/slices/transactionsSlice';
import { Ionicons } from '@expo/vector-icons';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch } from 'react-redux';

interface ConnectBankModalProps {
    visible: boolean;
    onClose: () => void;
    isDark: boolean;
}

const MOCK_BANKS = [
    { id: 'chase', name: 'Chase', color: '#117ACA' },
    { id: 'bofa', name: 'Bank of America', color: '#E31837' },
    { id: 'wells', name: 'Wells Fargo', color: '#CD1409' },
    { id: 'citi', name: 'Citi', color: '#003B70' },
];

export const ConnectBankModal: React.FC<ConnectBankModalProps> = ({ visible, onClose, isDark }) => {
    const dispatch = useDispatch();
    const [step, setStep] = useState<'loading' | 'select' | 'connecting' | 'success'>('loading');
    const [selectedBank, setSelectedBank] = useState<typeof MOCK_BANKS[0] | null>(null);

    useEffect(() => {
        if (visible) {
            setStep('loading');
            setTimeout(() => setStep('select'), 1500);
        }
    }, [visible]);

    const handleSelectBank = async (bank: typeof MOCK_BANKS[0]) => {
        setSelectedBank(bank);
        setStep('connecting');

        try {
            const data = await mockStripeService.fetchAccountData();

            const accountId = nanoid();

            // Add Account
            dispatch(addAccount({
                id: accountId,
                name: `${bank.name} Checking`,
                type: 'checking',
                balance: data.balance,
                currency: 'USD',
                source: 'stripe',
                stripeAccountId: `acct_${nanoid()}`,
                lastSynced: new Date().toISOString()
            }));

            // Add Transactions
            data.transactions.forEach(t => {
                dispatch(addTransaction({
                    ...t,
                    accountId
                }));
            });

            setStep('success');
            setTimeout(() => {
                onClose();
                setStep('loading');
                setSelectedBank(null);
            }, 1500);
        } catch (error) {
            console.error('Failed to connect bank', error);
            setStep('select');
        }
    };

    const renderContent = () => {
        switch (step) {
            case 'loading':
                return (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#635BFF" />
                        <Text style={[styles.loadingText, isDark && styles.textDark]}>
                            Initializing Stripe...
                        </Text>
                    </View>
                );

            case 'select':
                return (
                    <>
                        <Text style={[styles.title, isDark && styles.textDark]}>Select your bank</Text>
                        <FlatList
                            data={MOCK_BANKS}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.bankItem, isDark && styles.bankItemDark]}
                                    onPress={() => handleSelectBank(item)}
                                >
                                    <View style={[styles.bankIcon, { backgroundColor: item.color }]}>
                                        <Text style={styles.bankIconText}>{item.name[0]}</Text>
                                    </View>
                                    <Text style={[styles.bankName, isDark && styles.textDark]}>{item.name}</Text>
                                    <Ionicons name="chevron-forward" size={20} color={isDark ? '#666' : '#CCC'} />
                                </TouchableOpacity>
                            )}
                        />
                    </>
                );

            case 'connecting':
                return (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#635BFF" />
                        <Text style={[styles.loadingText, isDark && styles.textDark]}>
                            Connecting to {selectedBank?.name}...
                        </Text>
                    </View>
                );

            case 'success':
                return (
                    <View style={styles.centerContent}>
                        <Ionicons name="checkmark-circle" size={64} color="#27AE60" />
                        <Text style={[styles.successText, isDark && styles.textDark]}>
                            Account Connected!
                        </Text>
                    </View>
                );
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
                        <Text style={styles.stripeText}>Powered by Stripe</Text>
                    </View>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    {renderContent()}
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
        padding: 20,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    successText: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    bankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    bankItemDark: {
        borderBottomColor: '#333',
    },
    bankIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    bankIconText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    bankName: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    textDark: {
        color: 'white',
    },
});
