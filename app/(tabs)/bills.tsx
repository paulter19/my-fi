import { AddButton } from '@/components/AddButton';
import { ListItem } from '@/components/ListItem';
import { ModalForm } from '@/components/ModalForm';
import { addBill, Bill, deleteBill, setBillsStatus, toggleBillPaid, updateBill } from '@/store/slices/billsSlice';
import { RootState } from '@/store/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, Platform, RefreshControl, StyleSheet, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function BillsScreen() {
    const dispatch = useDispatch();
    const billItems = useSelector((state: RootState) => state.bills.items);
    const theme = useSelector((state: RootState) => state.ui.theme);
    const isDark = theme === 'dark';
    const [isModalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        setRefreshing(true);
        // Simulate a short delay for refresh
        setTimeout(() => setRefreshing(false), 500);
    };
    useFocusEffect(
        React.useCallback(() => {
            // Reset refreshing when screen gains focus
            setRefreshing(false);
        }, [])
    );
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [category, setCategory] = useState('');

    const [billType, setBillType] = useState<'monthly' | 'one-time'>('one-time');

    // No filter: display all bills directly

    // Determine if all bills are currently paid
    const allBillsPaid = billItems.length > 0 && billItems.every(b => b.isPaid);
    const [toggleAllPaid, setToggleAllPaid] = useState(allBillsPaid);

    // Sync toggle state with actual bill data
    useEffect(() => {
        setToggleAllPaid(billItems.length > 0 && billItems.every(b => b.isPaid));
    }, [billItems]);

    const handleToggleAll = (value: boolean) => {
        const ids = billItems.map(b => b.id);
        dispatch(setBillsStatus({ ids, isPaid: value }));
        setToggleAllPaid(value);
    };

    const handleSaveBill = () => {
        if (title && amount) {
            if (editingId) {
                const existingBill = billItems.find(b => b.id === editingId);
                if (existingBill) {
                    const updatedBill: Bill = {
                        ...existingBill,
                        title,
                        amount: parseFloat(amount),
                        dueDate: billType === 'monthly'
                            ? (typeof dueDate === 'string' ? dueDate : dueDate.getDate().toString())
                            : (dueDate instanceof Date ? dueDate.toISOString().split('T')[0] : dueDate),
                        category: category || existingBill.category,
                        type: billType,
                    };
                    dispatch(updateBill(updatedBill));
                }
            } else {
                const newBill: Bill = {
                    id: Date.now().toString(),
                    title,
                    amount: parseFloat(amount),
                    dueDate: billType === 'monthly'
                        ? (typeof dueDate === 'string' ? dueDate : dueDate.getDate().toString())
                        : (dueDate instanceof Date ? dueDate.toISOString().split('T')[0] : dueDate),
                    category: category || 'General',
                    isPaid: false,
                    type: billType,
                };
                dispatch(addBill(newBill));
            }
            closeModal();
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        resetForm();
        setModalVisible(true);
    };

    const openEditModal = (bill: Bill) => {
        setEditingId(bill.id);
        setTitle(bill.title);
        setAmount(bill.amount.toString());
        setDueDate(bill.type === 'monthly' ? new Date(new Date().setDate(parseInt(bill.dueDate))) : new Date(bill.dueDate));
        setCategory(bill.category);
        setBillType(bill.type);
        setModalVisible(true);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dueDate;
        setShowDatePicker(Platform.OS === 'ios');
        setDueDate(currentDate);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingId(null);
        resetForm();
    };

    const handleDeleteBill = (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this bill?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => dispatch(deleteBill(id)) },
            ],
            { cancelable: true }
        );
    };
    const handleTogglePaid = (id: string) => {
        dispatch(toggleBillPaid(id));
    };

    const resetForm = () => {
        setTitle('');
        setAmount('');
        setDueDate(new Date());
        setCategory('');
        setBillType('one-time'); // Reset bill type
    };

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <View style={[styles.header, isDark && styles.headerDark]}>
                        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Bills</Text>
                <View style={styles.headerToggleContainer}>
                    <Text style={[styles.headerToggleLabel, isDark && styles.headerToggleLabelDark]}>Mark All {toggleAllPaid ? 'Unpaid' : 'Paid'}</Text>
                    <Switch
                        value={toggleAllPaid}
                        onValueChange={handleToggleAll}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={toggleAllPaid ? "#4A90E2" : "#f4f3f4"}
                    />
                </View>
            </View>



            <FlatList
                data={billItems}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.billItemContainer, isDark && styles.billItemContainerDark]}>
                        <View style={{ flex: 1 }}>
                            <ListItem
                                title={item.title}
                                subtitle={
                                    item.type === 'monthly'
                                        ? `Day ${item.dueDate} • ${item.category}`
                                        : `Due: ${item.dueDate} • ${item.category}`
                                }
                                amount={`$${item.amount}`}
                                amountColor="#EB5757"
                                onPress={() => openEditModal(item)}
                                icon="receipt-outline"
                            />
                        </View>
                        <View style={styles.paidToggle}>
                            <Text style={styles.paidText}>{item.isPaid ? 'Paid' : 'Unpaid'}</Text>
                            <Switch
                                value={item.isPaid}
                                onValueChange={() => handleTogglePaid(item.id)}
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={item.isPaid ? "#4A90E2" : "#f4f3f4"}
                            />
                        </View>
                    </View>
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.listContent}
                    />

                    <AddButton onPress={openAddModal} />
                </View>
            </TouchableWithoutFeedback>

            <ModalForm
                visible={isModalVisible}
                onClose={closeModal}
                title={editingId ? "Edit Bill" : "Add Bill"}
                onSubmit={handleSaveBill}
            >
                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDark && styles.labelDark]}>Title</Text>
                    <TextInput
                        style={[styles.input, isDark && styles.inputDark]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="e.g. Rent"
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
                    <Text style={[styles.label, isDark && styles.labelDark]}>Due Date</Text>
                    {billType === 'one-time' && (
                        Platform.OS === 'android' ? (
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, isDark && styles.inputDark]}>
                                <Text style={isDark ? { color: 'white' } : { color: 'black' }}>
                                    {dueDate.toISOString().split('T')[0]}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={dueDate}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                themeVariant={isDark ? 'dark' : 'light'}
                                style={Platform.OS === 'ios' ? { alignSelf: 'flex-start' } : undefined}
                            />
                        )
                    )}
                    {billType === 'monthly' && (
                        <TextInput
                            style={[styles.input, isDark && styles.inputDark]}
                            value={dueDate instanceof Date ? dueDate.getDate().toString() : dueDate}
                            onChangeText={(text) => setDueDate(text as any)}
                            placeholder="Day of month"
                            keyboardType="numeric"
                            placeholderTextColor={isDark ? '#888' : '#ccc'}
                        />
                    )}
                </View>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDark && styles.labelDark]}>Bill Type</Text>
                    <View style={styles.typeToggleContainer}>
                        <TouchableOpacity
                            style={[styles.typeButton, billType === 'monthly' && styles.typeButtonActive]}
                            onPress={() => setBillType('monthly')}
                        >
                            <Text>Monthly</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, billType === 'one-time' && styles.typeButtonActive]}
                            onPress={() => setBillType('one-time')}
                        >
                            <Text>One‑Time</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, isDark && styles.labelDark]}>Category</Text>
                    <TextInput
                        style={[styles.input, isDark && styles.inputDark]}
                        value={category}
                        onChangeText={setCategory}
                        placeholder="e.g. Housing"
                        placeholderTextColor={isDark ? '#888' : '#ccc'}
                    />
                </View>
                {editingId && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                            handleDeleteBill(editingId);
                            closeModal();
                        }}
                    >
                        <Text style={styles.deleteButtonText}>Delete Bill</Text>
                    </TouchableOpacity>
                )}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    headerToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerToggleLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    headerToggleLabelDark: {
        color: '#AAA',
    },

    listContent: {
        paddingBottom: 100,
    },
    billItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingRight: 16,
    },
    billItemContainerDark: {
        backgroundColor: '#1E1E1E',
        borderBottomColor: '#333',
    },
    paidToggle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    paidText: {
        fontSize: 10,
        color: '#666',
        marginBottom: 4,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666',
    },
    typeToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    typeButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
    },
    typeButtonActive: {
        backgroundColor: '#4A90E2',
        color: 'white',
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
    deleteButton: {
        backgroundColor: '#FF3B30',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
