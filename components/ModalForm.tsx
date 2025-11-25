import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

interface ModalFormProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit: () => void;
}

export const ModalForm: React.FC<ModalFormProps> = ({ visible, onClose, title, children, onSubmit }) => {
    const theme = useSelector((state: RootState) => state.ui.theme);
    const isDark = theme === 'dark';

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={[styles.container, isDark && styles.containerDark]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={isDark ? "white" : "#333"} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        {children}
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
                        <Text style={styles.submitText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    containerDark: {
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
    titleDark: {
        color: 'white',
    },
    content: {
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#4A90E2',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
