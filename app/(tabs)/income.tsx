// IncomeScreen component
import { AddButton } from '@/components/AddButton';
import { ListItem } from '@/components/ListItem';
import { ModalForm } from '@/components/ModalForm';
import { addIncome, deleteIncome, Income } from '@/store/slices/incomeSlice';
import { RootState } from '@/store/store';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function IncomeScreen() {
    const dispatch = useDispatch();
    const incomeItems = useSelector((state: RootState) => state.income.items);
    const theme = useSelector((state: RootState) => state.ui.theme);
    const isDark = theme === 'dark';
    const [isModalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState<'monthly' | 'one-time'>('monthly');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // In a real app, you would refetch data here
        // For this example, we just simulate a delay
        setTimeout(() => setRefreshing(false), 500);
    };

    useFocusEffect(
        React.useCallback(() => {
            // Reset refreshing state when screen comes into focus
            setRefreshing(false);
        }, [])
    );

    const handleAddIncome = () => {
        if (title && amount) {
            const newIncome: Income = {
                id: Date.now().toString(),
                title,
                amount: parseFloat(amount),
                frequency,
            };
            dispatch(addIncome(newIncome));
            setModalVisible(false);
            resetForm();
        }
    };

    const handleDeleteIncome = (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this income?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => dispatch(deleteIncome(id)) },
            ],
            { cancelable: true }
        );
    };

    const resetForm = () => {
        setTitle('');
        setAmount('');
        setFrequency('monthly');
    };

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.header, isDark && styles.headerDark]}>
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Income</Text>
            </View>

            <FlatList
                data={incomeItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ListItem
                        title={item.title}
                        subtitle={item.frequency}
                        amount={`$${item.amount}`}
                        amountColor="#27AE60"
                        onDelete={() => handleDeleteIncome(item.id)}
                        icon="cash-outline"
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.listContent}
            />

            <AddButton onPress={() => setModalVisible(true)} />

            <ModalForm
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                title="Add Income"
                onSubmit={handleAddIncome}
            >
                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDark && styles.labelDark]}>Title</Text>
                    <TextInput
                        style={[styles.input, isDark && styles.inputDark]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="e.g. Salary"
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
                    <Text style={[styles.label, isDark && styles.labelDark]}>Frequency</Text>
                    <View style={styles.frequencyContainer}>
                        <TouchableOpacity
                            style={[
                                styles.frequencyButton,
                                isDark && styles.frequencyButtonDark,
                                frequency === 'monthly' && styles.activeFrequency
                            ]}
                            onPress={() => setFrequency('monthly')}
                        >
                            <Text style={[
                                styles.frequencyText,
                                isDark && styles.frequencyTextDark,
                                frequency === 'monthly' && styles.activeFrequencyText
                            ]}>Monthly</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.frequencyButton,
                                isDark && styles.frequencyButtonDark,
                                frequency === 'one-time' && styles.activeFrequency
                            ]}
                            onPress={() => setFrequency('one-time')}
                        >
                            <Text style={[
                                styles.frequencyText,
                                isDark && styles.frequencyTextDark,
                                frequency === 'one-time' && styles.activeFrequencyText
                            ]}>One-time</Text>
                        </TouchableOpacity>
                    </View>
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
    },
    headerTitleDark: {
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
    frequencyContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    frequencyButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    frequencyButtonDark: {
        borderColor: '#444',
    },
    activeFrequency: {
        backgroundColor: '#4A90E2',
        borderColor: '#4A90E2',
    },
    frequencyText: {
        color: '#666',
        fontSize: 16,
    },
    frequencyTextDark: {
        color: '#AAA',
    },
    activeFrequencyText: {
        color: 'white',
    },
});
