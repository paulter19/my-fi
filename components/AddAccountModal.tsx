import { addAccount } from '@/store/slices/accountsSlice';
import { Ionicons } from '@expo/vector-icons';
import { nanoid } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch } from 'react-redux';

interface AddAccountModalProps {
    visible: boolean;
    onClose: () => void;
    isDark: boolean;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({ visible, onClose, isDark }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [type, setType] = useState<'checking' | 'savings' | 'credit'>('checking');

    const handleSave = () => {
        if (!name || !balance) return;

        dispatch(addAccount({
            id: nanoid(),
            name,
            balance: parseFloat(balance),
            type,
            currency: 'USD',
            source: 'manual'
        }));

        setName('');
        setBalance('');
        setType('checking');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, isDark && styles.textDark]}>Add Account</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={isDark ? 'white' : '#333'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.form}>
                        <Text style={[styles.label, isDark && styles.textDark]}>Account Name</Text>
                        <TextInput
                            style={[styles.input, isDark && styles.inputDark]}
                            placeholder="e.g. Chase Checking"
                            placeholderTextColor={isDark ? '#666' : '#999'}
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={[styles.label, isDark && styles.textDark]}>Current Balance</Text>
                        <TextInput
                            style={[styles.input, isDark && styles.inputDark]}
                            placeholder="0.00"
                            placeholderTextColor={isDark ? '#666' : '#999'}
                            keyboardType="numeric"
                            value={balance}
                            onChangeText={setBalance}
                        />

                        <Text style={[styles.label, isDark && styles.textDark]}>Account Type</Text>
                        <View style={styles.typeContainer}>
                            {(['checking', 'savings', 'credit'] as const).map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={[
                                        styles.typeButton,
                                        type === t && styles.typeButtonActive,
                                        isDark && styles.typeButtonDark,
                                        type === t && isDark && styles.typeButtonActiveDark
                                    ]}
                                    onPress={() => setType(t)}
                                >
                                    <Text style={[
                                        styles.typeText,
                                        type === t && styles.typeTextActive,
                                        isDark && styles.textDark
                                    ]}>
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Account</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalContentDark: {
        backgroundColor: '#1E1E1E',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    form: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
    },
    inputDark: {
        backgroundColor: '#2C2C2C',
        color: 'white',
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    typeButtonDark: {
        borderColor: '#444',
    },
    typeButtonActive: {
        backgroundColor: '#E3F2FD',
        borderColor: '#4A90E2',
    },
    typeButtonActiveDark: {
        backgroundColor: '#1565C0',
        borderColor: '#4A90E2',
    },
    typeText: {
        color: '#666',
    },
    typeTextActive: {
        color: '#4A90E2',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#4A90E2',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textDark: {
        color: 'white',
    },
});
