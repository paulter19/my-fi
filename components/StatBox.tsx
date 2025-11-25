import { RootState } from '@/store/store';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { Card } from './Card';

interface StatBoxProps {
    label: string;
    value: string;
    color?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, color = '#333' }) => {
    const theme = useSelector((state: RootState) => state.ui.theme);
    const isDark = theme === 'dark';

    return (
        <Card style={styles.container}>
            <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
            <Text style={[styles.value, { color }]}>{value}</Text>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    labelDark: {
        color: '#AAA',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
