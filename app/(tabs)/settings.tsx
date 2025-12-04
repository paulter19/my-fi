import { Card } from '@/components/Card';
import { auth } from '@/firebaseConfig';
import { resetAccounts } from '@/store/slices/accountsSlice';
import { logout } from '@/store/slices/authSlice';
import { resetBills } from '@/store/slices/billsSlice';
import { resetIncome } from '@/store/slices/incomeSlice';
import { resetTransactions } from '@/store/slices/transactionsSlice';
import { toggleTheme } from '@/store/slices/uiSlice';
import { RootState } from '@/store/store';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function SettingsScreen() {
    const dispatch = useDispatch();
    const handleClearData = () => {
        Alert.alert(
            'Confirm',
            'Are you sure you want to clear all data?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: () => {
                        dispatch(resetBills());
                        dispatch(resetIncome());
                        dispatch(resetTransactions());
                        dispatch(resetAccounts());
                    },
                },
            ],
            { cancelable: true }
        );
    };
    const theme = useSelector((state: RootState) => state.ui.theme);
    const isDark = theme === 'dark';

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
        } catch (error) {
            console.error('Error signing out: ', error);
            Alert.alert('Error', 'Failed to sign out');
        }
    };

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.header, isDark && styles.headerDark]}>
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Settings</Text>
            </View>

            <View style={styles.content}>
                <Card style={styles.settingItem}>
                    {/* Existing setting items */}
                    <View>
                        <Text style={[styles.settingTitle, isDark && styles.settingTitleDark]}>Dark Mode</Text>
                        <Text style={[styles.settingSubtitle, isDark && styles.settingSubtitleDark]}>Enable dark theme for the app</Text>
                    </View>
                    <Switch
                        value={theme === 'dark'}
                        onValueChange={handleToggleTheme}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={theme === 'dark' ? "#4A90E2" : "#f4f3f4"}
                    />
                </Card>
                <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
                    <Text style={styles.clearButtonText}>Clear All Data</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.clearButton, styles.logoutButton]} onPress={handleLogout}>
                    <Text style={styles.clearButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
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
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerDark: {
        backgroundColor: '#1E1E1E',
        borderBottomColor: '#333',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    headerTitleDark: {
        color: 'white',
    },
    clearButton: {
        backgroundColor: '#FF3B30',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#333',
        marginTop: 12,
    },
    content: {
        padding: 16,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    settingTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
    settingTitleDark: {
        color: 'white',
    },
    settingSubtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    settingSubtitleDark: {
        color: '#AAA',
    },
});
