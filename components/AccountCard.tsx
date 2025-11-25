import { Account } from '@/store/slices/accountsSlice';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AccountCardProps {
    account: Account;
    onPress: (account: Account) => void;
    isDark: boolean;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onPress, isDark }) => {
    const getIconName = (type: Account['type']) => {
        switch (type) {
            case 'checking':
                return 'wallet-outline';
            case 'savings':
                return 'cash-outline';
            case 'credit':
                return 'card-outline';
            default:
                return 'cash-outline';
        }
    };

    const getIconColor = (type: Account['type']) => {
        switch (type) {
            case 'checking':
                return '#4A90E2';
            case 'savings':
                return '#27AE60';
            case 'credit':
                return '#EB5757';
            default:
                return '#F2994A';
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, isDark && styles.containerDark]}
            onPress={() => onPress(account)}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={getIconName(account.type)} size={24} color={getIconColor(account.type)} />
            </View>
            <View style={styles.details}>
                <Text style={[styles.name, isDark && styles.textDark]}>{account.name}</Text>
                <Text style={[styles.type, isDark && styles.subTextDark]}>
                    {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                </Text>
            </View>
            <View style={styles.balanceContainer}>
                <Text style={[styles.balance, isDark && styles.textDark]}>
                    ${account.balance.toFixed(2)}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#666' : '#CCC'} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    containerDark: {
        backgroundColor: '#1E1E1E',
        shadowColor: '#000',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    type: {
        fontSize: 12,
        color: '#888',
    },
    balanceContainer: {
        marginRight: 8,
    },
    balance: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    textDark: {
        color: 'white',
    },
    subTextDark: {
        color: '#AAA',
    },
});
