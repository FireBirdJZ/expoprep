import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';

export default function WaterStatsCard({
                                           title,
                                           description,
                                           icon,
                                       }: {
    title: string;
    description: string;
    icon: IconSymbolName; // Ensures only valid icon names are used
}) {
    return (
        <View style={styles.card}>
            <IconSymbol name={icon} size={24} color="#3DBFF2" />
            <View style={styles.textContainer}>
                <ThemedText type="subtitle">{title}</ThemedText>
                <ThemedText>{description}</ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#E6F7FB',
        borderRadius: 10,
    },
    textContainer: {
        marginLeft: 16,
        flex: 1,
    },
});
