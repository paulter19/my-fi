import { ListItem } from '@/components/ListItem';
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function AccountDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const account = useSelector((state: RootState) =>
        state.accounts.items.find(a => a.id === id)
    );
    const transactions = useSelector((state: RootState) =>
        state.transactions.items.filter(t => t.accountId === id)
    );
    const theme = useSelector((state: RootState) => state.ui.theme);
    const isDark = theme === 'dark';

    if (!account) {
        return (
            <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
                <Text style={[styles.errorText, isDark && styles.textDark]}>Account not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, isDark && styles.textDark]}>{account.name}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.balanceCard, isDark && styles.cardDark]}>
                    <Text style={[styles.balanceLabel, isDark && styles.subTextDark]}>Current Balance</Text>
                    <Text style={[styles.balanceValue, isDark && styles.textDark]}>
                        ${account.balance.toFixed(2)}
                    </Text>
                    <Text style={[styles.accountType, isDark && styles.subTextDark]}>
                        {account.type.toUpperCase()}
                    </Text>
                </View>

                <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Transactions</Text>

                {transactions.length > 0 ? (
                    <View style={[styles.transactionsList, isDark && styles.cardDark]}>
                        {transactions.map((transaction) => (
                            <ListItem
                                key={transaction.id}
                                title={transaction.title}
                                subtitle={transaction.date}
                                amount={`$${transaction.amount}`}
                                amountColor={transaction.type === 'income' ? '#27AE60' : '#EB5757'}
                                icon={transaction.type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'}
                            />
                        ))}
                    </View>
                ) : (
                    <Text style={styles.emptyText}>No transactions found for this account.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 16,
    },
    balanceCard: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardDark: {
        backgroundColor: '#1E1E1E',
    },
    balanceLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    balanceValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    accountType: {
        fontSize: 12,
        color: '#888',
        letterSpacing: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    transactionsList: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    textDark: {
        color: 'white',
    },
    subTextDark: {
        color: '#AAA',
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
});
