import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useEnergy } from "@/hooks/useEnergy";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface HeatmapCellProps {
    value: number;
    maxValue: number;
}

function HeatmapCell({ value, maxValue }: HeatmapCellProps) {
    const percentage = value / maxValue;
    const orangeGradient = `rgba(255, 102, 26, ${percentage})`;

    return (
        <View style={[styles.cell, { backgroundColor: orangeGradient }]}>
            <Text style={[
                styles.cellText,
                { color: percentage > 0.5 ? '#fff' : '#666' }
            ]}>
                {value.toFixed(1)}
            </Text>
        </View>
    );
}

export default function EnergyHeatmapScreen() {
    const { data, loading, error } = useEnergy();

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const processedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        return days.flatMap((day, dayIndex) =>
            hours.map((hour, hourIndex) => {
                const total = data
                    .filter((entry) => {
                        const date = new Date(entry.local_time);
                        return date.getDay() === (dayIndex + 1) % 7 && date.getHours() === hourIndex;
                    })
                    .reduce(
                        (sum, entry) =>
                            sum +
                            (entry.fridge_kwh || 0) +
                            (entry.oven_kwh || 0) +
                            (entry.lights_kwh || 0) +
                            (entry.ev_charger_kwh || 0),
                        0
                    );
                return { day, hour, total };
            })
        );
    }, [data]);

    const maxValue = useMemo(
        () => Math.max(...processedData.map((d) => d.total), 1),
        [processedData]
    );

    // NEW: Add insights calculations
    const insights = useMemo(() => {
        if (processedData.length === 0) return { dayWithHighest: '', quietTime: '' };

        // Find the day with highest total consumption
        const dailyTotals = days.map(day => ({
            day,
            total: processedData
                .filter(d => d.day === day)
                .reduce((sum, d) => sum + d.total, 0)
        }));

        const highestDay = dailyTotals.reduce((max, curr) =>
                curr.total > max.total ? curr : max
            , dailyTotals[0]);

        // Find the quietest 3-hour window
        let lowestAvg = Infinity;
        let quietStart = '00';

        hours.forEach(hour => {
            const hourNum = Number(hour);
            const next3Hours = [hourNum, (hourNum + 1) % 24, (hourNum + 2) % 24]
                .map(h => h.toString().padStart(2, '0'));

            const avgUsage = next3Hours.reduce((sum, h) => {
                const hourData = processedData.filter(d => d.hour === h);
                return sum + (hourData.reduce((s, d) => s + d.total, 0) / hourData.length);
            }, 0) / 3;

            if (avgUsage < lowestAvg) {
                lowestAvg = avgUsage;
                quietStart = hour;
            }
        });

        return {
            dayWithHighest: `${highestDay.day} has highest daily usage (${highestDay.total.toFixed(1)} kWh)`,
            quietTime: `${quietStart}:00-${(Number(quietStart) + 3).toString().padStart(2, '0')}:00 is best for scheduled tasks`
        };
    }, [processedData]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#808080"
                    name="clock.fill"
                    style={styles.headerImage}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Weekly Energy Consumption Heatmap (kWh)</ThemedText>
            </ThemedView>

            <ScrollView horizontal showsHorizontalScrollIndicator>
                <View>
                    <View style={styles.headerRow}>
                        <View style={[styles.dayLabel, { height: 30 }]}>
                            <Text style={styles.dayLabelText}>Day</Text>
                        </View>
                        {hours.map((hour) => (
                            <View key={hour} style={styles.hourLabel}>
                                <Text style={styles.hourLabelText}>{hour}:00</Text>
                            </View>
                        ))}
                    </View>

                    {days.map((day) => (
                        <View key={day} style={styles.row}>
                            <View style={styles.dayLabel}>
                                <Text style={styles.dayLabelText}>{day}</Text>
                            </View>
                            {hours.map((hour) => {
                                const entry = processedData.find(
                                    (d) => d.day === day && d.hour === hour
                                );
                                return (
                                    <HeatmapCell
                                        key={`${day}-${hour}`}
                                        value={entry?.total || 0}
                                        maxValue={maxValue}
                                    />
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>


            <View style={styles.insightsContainer}>
                <ThemedText type="defaultSemiBold">Key Insights:</ThemedText>
                <ThemedText>
                    • {insights.dayWithHighest}
                </ThemedText>
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
        paddingLeft: 0,
    },
    dayLabel: {
        width: 80,
        height: 45,
        justifyContent: "center",
        paddingLeft: 5,
    },
    dayLabelText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },
    hourLabel: {
        width: 40,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 0.5,
    },
    hourLabelText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#333",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 1,
    },
    cell: {
        width: 40,
        height: 40,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: "#e5e5e5",
        marginHorizontal: 0.5,
    },
    cellText: {
        fontSize: 10,
        fontWeight: "bold",
    },
    insightsContainer: {
        marginTop: 20,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    }
});