import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

interface ListItemProps {
    title: string;
    subtitle?: string;
    amount: string;
    amountColor?: string;
    onPress?: () => void;
    onDelete?: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
}

export const ListItem: React.FC<ListItemProps> = ({
    title,
    subtitle,
    amount,
    amountColor = '#333',
    onPress,
    onDelete,
    icon = 'wallet-outline'
}) => {
    const theme = useSelector((state: RootState) => state.ui.theme);
    const isDark = theme === 'dark';

    return (
        <TouchableOpacity
            style={[styles.container, isDark && styles.containerDark]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
                <Ionicons name={icon} size={24} color="#4A90E2" />
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
                {subtitle && <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{subtitle}</Text>}
            </View>
            <View style={styles.rightContent}>
                <Text style={[styles.amount, { color: amountColor }]}>{amount}</Text>
                {onDelete && (
                    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    containerDark: {
        backgroundColor: '#1E1E1E',
        borderBottomColor: '#333',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    iconContainerDark: {
        backgroundColor: '#333',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    titleDark: {
        color: 'white',
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    subtitleDark: {
        color: '#AAA',
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        marginTop: 4,
        padding: 4,
    },
});
