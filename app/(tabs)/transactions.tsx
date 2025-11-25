import { AddButton } from '@/components/AddButton';
import { ListItem } from '@/components/ListItem';
import { ModalForm } from '@/components/ModalForm';
import { addTransaction, deleteTransaction, Transaction } from '@/store/slices/transactionsSlice';
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function TransactionsScreen() {
    const dispatch = useDispatch();
    const transactions = useSelector((state: RootState) => state.transactions.items);
    const theme = useSelector((state: RootState) => state.ui.theme);
    const isDark = theme === 'dark';
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 500);
    };

    useFocusEffect(
        React.useCallback(() => {
            setRefreshing(false);
        }, [])
    );

    // Form State
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                item.category.toLowerCase().includes(searchText.toLowerCase());
            const matchesType = filterType === 'all' || item.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [transactions, searchText, filterType]);

    const handleAddTransaction = () => {
        if (title && amount) {
            const newTransaction: Transaction = {
                id: Date.now().toString(),
                title,
                amount: parseFloat(amount),
                date: new Date().toISOString(),
                category: category || 'General',
                type,
            };
            dispatch(addTransaction(newTransaction));
            setModalVisible(false);
            resetForm();
        }
    };

    const handleDeleteTransaction = (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => dispatch(deleteTransaction(id)) },
            ],
            { cancelable: true }
        );
    };

    const resetForm = () => {
        setTitle('');
        setAmount('');
        setCategory('');
        setType('expense');
    };

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.header, isDark && styles.headerDark]}>
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Transactions</Text>
                <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
                    <Ionicons name="search" size={20} color={isDark ? "#AAA" : "#666"} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, isDark && styles.searchInputDark]}
                        placeholder="Search transactions..."
                        placeholderTextColor={isDark ? '#888' : '#666'}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            isDark && styles.filterButtonDark,
                            filterType === 'all' && styles.activeFilter
                        ]}
                        onPress={() => setFilterType('all')}
                    >
                        <Text style={[
                            styles.filterText,
                            isDark && styles.filterTextDark,
                            filterType === 'all' && styles.activeFilterText
                        ]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            isDark && styles.filterButtonDark,
                            filterType === 'income' && styles.activeFilter
                        ]}
                        onPress={() => setFilterType('income')}
                    >
                        <Text style={[
                            styles.filterText,
                            isDark && styles.filterTextDark,
                            filterType === 'income' && styles.activeFilterText
                        ]}>Income</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            isDark && styles.filterButtonDark,
                            filterType === 'expense' && styles.activeFilter
                        ]}
                        onPress={() => setFilterType('expense')}
                    >
                        <Text style={[
                            styles.filterText,
                            isDark && styles.filterTextDark,
                            filterType === 'expense' && styles.activeFilterText
                        ]}>Expense</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredTransactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ListItem
                        title={item.title}
                        subtitle={`${new Date(item.date).toLocaleDateString()} • ${item.category}`}
                        amount={`${item.type === 'income' ? '+' : '-'}$${item.amount}`}
                        amountColor={item.type === 'income' ? '#27AE60' : '#EB5757'}
                        onDelete={() => handleDeleteTransaction(item.id)}
                        icon={item.type === 'income' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.listContent}
            />

            <AddButton onPress={() => setModalVisible(true)} />

            <ModalForm
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                title="Add Transaction"
                onSubmit={handleAddTransaction}
            >
                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDark && styles.labelDark]}>Type</Text>
                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                isDark && styles.typeButtonDark,
                                type === 'expense' && styles.activeTypeExpense
                            ]}
                            onPress={() => setType('expense')}
                        >
                            <Text style={[
                                styles.typeText,
                                isDark && styles.typeTextDark,
                                type === 'expense' && styles.activeTypeText
                            ]}>Expense</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                isDark && styles.typeButtonDark,
                                type === 'income' && styles.activeTypeIncome
                            ]}
                            onPress={() => setType('income')}
                        >
                            <Text style={[
                                styles.typeText,
                                isDark && styles.typeTextDark,
                                type === 'income' && styles.activeTypeText
                            ]}>Income</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDark && styles.labelDark]}>Title</Text>
                    <TextInput
                        style={[styles.input, isDark && styles.inputDark]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="e.g. Groceries"
                        placeholderTextColor={isDark ? '#888' : '#ccc'}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDark && styles.labelDark]}>Amount</Text>
                    <TextInput
                        style={[styles.input, isDark && styles.inputDark]}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        keyboardType="numeric"
                        placeholderTextColor={isDark ? '#888' : '#ccc'}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDark && styles.labelDark]}>Category</Text>
                    <TextInput
                        style={[styles.input, isDark && styles.inputDark]}
                        value={category}
                        onChangeText={setCategory}
                        placeholder="e.g. Food"
                        placeholderTextColor={isDark ? '#888' : '#ccc'}
                    />
                </View>
            </ModalForm>
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
        marginBottom: 12,
    },
    headerTitleDark: {
        color: 'white',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    searchContainerDark: {
        backgroundColor: '#333',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
    },
    searchInputDark: {
        color: 'white',
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
    },
    filterButtonDark: {
        backgroundColor: '#333',
    },
    activeFilter: {
        backgroundColor: '#4A90E2',
    },
    filterText: {
        color: '#666',
        fontWeight: '500',
    },
    filterTextDark: {
        color: '#AAA',
    },
    activeFilterText: {
        color: 'white',
    },
    listContent: {
        paddingBottom: 100,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666',
    },
    labelDark: {
        color: '#AAA',
    },
    input: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 16,
    },
    inputDark: {
        backgroundColor: '#333',
        borderColor: '#444',
        color: 'white',
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    typeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    typeButtonDark: {
        borderColor: '#444',
    },
    activeTypeExpense: {
        backgroundColor: '#EB5757',
        borderColor: '#EB5757',
    },
    activeTypeIncome: {
        backgroundColor: '#27AE60',
        borderColor: '#27AE60',
    },
    typeText: {
        color: '#666',
        fontSize: 16,
    },
    typeTextDark: {
        color: '#AAA',
    },
    activeTypeText: {
        color: 'white',
    },
});
