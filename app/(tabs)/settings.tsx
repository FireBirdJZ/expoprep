import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEnergy } from '@/hooks/useEnergy';

const SettingsScreen = () => {
    const { selectedTimezone, updateTimezone, data, loading, error } = useEnergy();

    const timezones = useMemo(() => [
        { id: 'local', label: 'Your Local Time', value: Intl.DateTimeFormat().resolvedOptions().timeZone },
        { id: 'oslo', label: 'Oslo', value: 'Europe/Oslo' },
        { id: 'utc', label: 'UTC', value: 'UTC' },
        { id: 'chicago', label: 'Chicago', value: 'America/Chicago' }
    ], []);

    const latestReading = useMemo(() => {
        if (!data || data.length === 0) return null;
        return data[data.length - 1];
    }, [data]);

    const formatNumber = (num: number) => {
        return Number(num).toFixed(2);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Timezone Settings</Text>
                    </View>
                    <View style={styles.cardContent}>
                        {timezones.map((tz) => (
                            <TouchableOpacity
                                key={tz.id}
                                style={[
                                    styles.timezoneRow,
                                    selectedTimezone === tz.value && styles.selectedRow
                                ]}
                                onPress={() => updateTimezone(tz.value)}
                            >
                                <View style={styles.timezoneLabelContainer}>
                                    <Ionicons
                                        name="time-outline"
                                        size={24}
                                        color={selectedTimezone === tz.value ? '#3b82f6' : '#6b7280'}
                                    />
                                    <View style={styles.timezoneTexts}>
                                        <Text style={styles.timezoneLabel}>{tz.label}</Text>
                                        <Text style={styles.timezoneValue}>
                                            {tz.value.replace('_', ' ')}
                                        </Text>
                                    </View>
                                </View>
                                {selectedTimezone === tz.value && (
                                    <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Current Data</Text>
                    </View>
                    <View style={styles.cardContent}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#3b82f6" />
                        ) : error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : latestReading ? (
                            <View style={styles.readingContainer}>
                                <Text style={styles.readingTitle}>Latest Reading:</Text>
                                <Text style={styles.readingText}>Time: {latestReading.local_time}</Text>
                                <Text style={styles.readingText}>
                                    Fridge: {formatNumber(latestReading.fridge_kwh)} kWh
                                </Text>
                                <Text style={styles.readingText}>
                                    Oven: {formatNumber(latestReading.oven_kwh)} kWh
                                </Text>
                                <Text style={styles.readingText}>
                                    Lights: {formatNumber(latestReading.lights_kwh)} kWh
                                </Text>
                                <Text style={styles.readingText}>
                                    EV Charger: {formatNumber(latestReading.ev_charger_kwh)} kWh
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.noDataText}>No data available</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1f2937',
    },
    cardContent: {
        padding: 8,
    },
    timezoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginVertical: 2,
    },
    selectedRow: {
        backgroundColor: '#f0f7ff',
    },
    timezoneLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timezoneTexts: {
        marginLeft: 12,
    },
    timezoneLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    timezoneValue: {
        fontSize: 16,
        color: '#6b7280',
    },
    readingContainer: {
        padding: 8,
    },
    readingTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: '#1f2937',
    },
    readingText: {
        fontSize: 16,
        color: '#4b5563',
        marginBottom: 12,
    },
    errorText: {
        color: '#ef4444',
        padding: 16,
    },
    noDataText: {
        color: '#6b7280',
        padding: 16,
    },
});

export default SettingsScreen;