import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

interface HeatmapCellProps {
    value: number;
    maxValue: number;
}

function HeatmapCell({ value, maxValue }: HeatmapCellProps) {
    const percentage = value / maxValue;

    // Green to Red gradient calculation
    let red, green, blue;
    if (percentage <= 0.5) {
        // Green to White transition (first half)
        const factor = percentage * 2;
        red = Math.round(255 * factor);
        green = 255;
        blue = Math.round(255 * factor);
    } else {
        // White to Red transition (second half)
        const factor = (percentage - 0.5) * 2;
        red = 255;
        green = Math.round(255 * (1 - factor));
        blue = Math.round(255 * (1 - factor));
    }

    const bgColor = `rgb(${red}, ${green}, ${blue})`;

    return (
        <View style={[styles.cell, { backgroundColor: bgColor }]}>
            <Text style={[styles.cellText, { color: percentage < 0.3 ? "#fff" : "#000" }]}>
                {value.toFixed(2)}
            </Text>
        </View>
    );
}

export function EnergyHeatmap() {
    const [data, setData] = useState<{ day: string; hour: string; total: number }[]>([]);
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        const mockData = days.flatMap((day) =>
            hours.map((hour) => ({
                day,
                hour,
                total: parseFloat((Math.random() * 10).toFixed(2)),
            }))
        );
        setData(mockData);
    }, []);

    const maxValue = Math.max(...data.map((d) => d.total), 1);

    return (
        <ScrollView style={styles.mainContainer} contentContainerStyle={styles.mainContentContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Energy Consumption Heatmap</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        {/* Hours Label */}
                        <View style={styles.headerRow}>
                            <View style={[styles.dayLabel, { height: 30 }]}>
                                <Text style={styles.headerText}>Day</Text>
                            </View>
                            {hours.map((hour) => (
                                <View key={hour} style={styles.hourLabel}>
                                    <Text style={styles.hourText}>{hour}:00</Text>
                                </View>
                            ))}
                        </View>

                        {/* Heatmap grid */}
                        {days.map((day) => (
                            <View key={day} style={styles.row}>
                                <View style={styles.dayLabel}>
                                    <Text style={styles.dayText} numberOfLines={1}>{day}</Text>
                                </View>
                                {hours.map((hour) => {
                                    const entry = data.find((d) => d.day === day && d.hour === hour);
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

                <View style={styles.legend}>
                    <Text style={styles.legendTitle}>Legend</Text>
                    <Text style={styles.legendText}>Green: Low consumption</Text>
                    <Text style={styles.legendText}>White: Moderate consumption</Text>
                    <Text style={styles.legendText}>Red: High consumption</Text>
                    <Text style={styles.legendText}>Values shown in kWh</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    mainContentContainer: {
        flexGrow: 1,
    },
    container: {
        padding: 10,
        paddingBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
        paddingLeft: 0,
    },
    hourLabel: {
        width: 45,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 0.5,  // Match cell margin
    },
    hourText: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#333",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 1,
    },
    dayLabel: {
        width: 80,
        height: 45,
        justifyContent: "center",
        paddingLeft: 5,
    },
    dayText: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#333",
    },
    headerText: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#000",
    },
    cell: {
        width: 45,
        height: 45,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: "#e5e5e5",
        marginHorizontal: 0.5,
    },
    cellText: {
        fontSize: 11,
        fontWeight: "bold",
    },
    legend: {
        marginTop: 10,
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 8,
    },
    legendTitle: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    legendText: {
        fontSize: 12,
        marginBottom: 2,
    },
});