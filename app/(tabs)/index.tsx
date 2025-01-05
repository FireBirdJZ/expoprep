import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useEnergy } from "@/hooks/useEnergy";
import { IconSymbol } from "@/components/ui/IconSymbol";

const PEAK_RATE = 10.5; // NOK per kWh during peak hours
const OFF_PEAK_RATE = 5.25; // NOK per kWh during off-peak hours

export default function HomeScreen() {
    const { data, loading, error } = useEnergy();

    interface DailyData {
        value: number;
        cost: number;
        date: string;
    }

    interface DailyAccumulator {
        [key: string]: DailyData;
    }

    const processedData = useMemo(() => {
        if (!data || data.length === 0) return { chartData: [], totalCost: 0, totalUsage: 0 };

        const dailyData = data.reduce((acc: DailyAccumulator, curr) => {
            const date = new Date(curr.local_time);
            const dateKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const hour = date.getHours();
            const isPeakHour = hour >= 8 && hour <= 20;

            const totalKwh =
                (curr.fridge_kwh || 0) +
                (curr.oven_kwh || 0) +
                (curr.lights_kwh || 0) +
                (curr.ev_charger_kwh || 0);

            const cost = totalKwh * (isPeakHour ? PEAK_RATE : OFF_PEAK_RATE);

            if (!acc[dateKey]) {
                acc[dateKey] = { value: 0, cost: 0, date: dateKey };
            }
            acc[dateKey].value += totalKwh;
            acc[dateKey].cost += cost;
            return acc;
        }, {});

        const chartData = Object.values(dailyData)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((day, index) => ({
                value: Number(day.value.toFixed(2)),
                date: day.date,
                cost: day.cost,
                label: index % 2 === 0 ? day.date : undefined,
                labelTextStyle: { color: "gray", fontSize: 10 },
            }));

        const totalCost = chartData.reduce((sum, day) => sum + day.cost, 0);
        const totalUsage = chartData.reduce((sum, day) => sum + day.value, 0);

        return { chartData, totalCost, totalUsage };
    }, [data]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <View style={styles.container}>
            {/* Header Section with IconSymbol */}
            <View style={styles.header}>
                <IconSymbol size={80} color="#808080" name="moon.circle.fill" />
                <Text style={styles.title}>Daily Energy Cost</Text>
            </View>

            {/* Line Chart */}
            <LineChart
                areaChart
                data={processedData.chartData}
                width={Dimensions.get("window").width - 40}
                height={300}
                spacing={40}
                thickness={2}
                color="#22C55E"
                startFillColor="rgba(34, 197, 94, 0.3)"
                endFillColor="rgba(34, 197, 94, 0.01)"
                startOpacity={0.9}
                endOpacity={0.2}
                noOfSections={4}
                maxValue={200}
                yAxisColor="gray"
                yAxisThickness={1}
                yAxisTextStyle={{ color: "gray", fontSize: 10 }}
                xAxisColor="gray"
                xAxisLabelTextStyle={{ color: "gray", fontSize: 10 }}
                hideDataPoints={false}
                rulesType="dashed"
                rulesColor="lightgray"
                pointerConfig={{
                    pointerStripHeight: 160,
                    pointerStripColor: "lightgray",
                    pointerStripWidth: 1,
                    pointerColor: "#22C55E",
                    radius: 4,
                    pointerLabelWidth: 100,
                    pointerLabelHeight: 70,
                    autoAdjustPointerLabelPosition: true,
                    pointerLabelComponent: (items: {
                        value: any;
                        date: React.ReactNode | undefined;
                        cost: number; }[]) => (
                        <View style={styles.pointerLabel}>
                            <Text style={styles.pointerLabelText}>{items[0]?.date}</Text>
                            <Text style={styles.pointerLabelValue}>
                                {items[0]?.value.toFixed(2)} kWh
                            </Text>
                            <Text style={styles.pointerLabelCost}>
                                {items[0]?.cost.toFixed(0)} NOK
                            </Text>
                        </View>
                    ),
                }}
            />

            {/* Insights Section */}
            <View style={styles.insightsContainer}>
                <Text style={styles.insightTitle}>Key Insights:</Text>
                <Text style={styles.insightText}>
                    • Total Weekly Usage: {processedData.totalUsage.toFixed(2)} kWh
                </Text>
                <Text style={styles.insightText}>
                    • Estimated Cost: {processedData.totalCost.toFixed(0)} NOK
                </Text>
                <Text style={styles.insightText}>
                    • Tip: Shifting 1.2 kWh to off-peak hours could save up to{" "}
                    {(1.2 * (PEAK_RATE - OFF_PEAK_RATE)).toFixed(0)} NOK per day.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 20,
        paddingTop: Platform.OS === "android" || Platform.OS === "ios" ? 40 : 20, // Adjust top padding for mobile devices
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 16,
    },
    pointerLabel: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignItems: "center",
    },
    pointerLabelText: {
        color: "gray",
        fontSize: 10,
        marginBottom: 4,
    },
    pointerLabelValue: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#22C55E",
        marginBottom: 2,
    },
    pointerLabelCost: {
        fontSize: 12,
        color: "#666",
    },
    insightsContainer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
    },
    insightText: {
        fontSize: 14,
        color: "#4B5563",
        marginBottom: 8,
        lineHeight: 20,
    },
});
