// app/(tabs)/devices.tsx
import { StyleSheet, View } from 'react-native';
import { useEnergy } from '@/hooks/useEnergy';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BarChart } from "react-native-gifted-charts";

export default function DevicesScreen() {
    const { data, loading, error } = useEnergy();

    // Process data for the chart
    const processChartData = () => {
        if (!data || data.length === 0) return [];

        const totals = data.reduce((acc, curr) => ({
            fridge: (acc.fridge || 0) + curr.fridge_kwh,
            oven: (acc.oven || 0) + curr.oven_kwh,
            lights: (acc.lights || 0) + curr.lights_kwh,
            ev: (acc.ev || 0) + curr.ev_charger_kwh
        }), { fridge: 0, oven: 0, lights: 0, ev: 0 });

        return [
            {
                value: Number(totals.fridge.toFixed(2)),
                label: 'Fridge',
                frontColor: '#60A5FA',
                topLabelComponent: () => (
                    <ThemedText style={styles.topLabel}>
                        {totals.fridge.toFixed(2)}
                    </ThemedText>
                )
            },
            {
                value: Number(totals.oven.toFixed(2)),
                label: 'Oven',
                frontColor: '#F87171',
                topLabelComponent: () => (
                    <ThemedText style={styles.topLabel}>
                        {totals.oven.toFixed(2)}
                    </ThemedText>
                )
            },
            {
                value: Number(totals.lights.toFixed(2)),
                label: 'Lights',
                frontColor: '#FBBF24',
                topLabelComponent: () => (
                    <ThemedText style={styles.topLabel}>
                        {totals.lights.toFixed(2)}
                    </ThemedText>
                )
            },
            {
                value: Number(totals.ev.toFixed(2)),
                label: 'EV',
                frontColor: '#34D399',
                topLabelComponent: () => (
                    <ThemedText style={styles.topLabel}>
                        {totals.ev.toFixed(2)}
                    </ThemedText>
                )
            }
        ];
    };

    const chartData = processChartData();
    const maxValue = chartData.length > 0 ?
        Math.max(...chartData.map(item => item.value)) * 1.2 : 20; // Add 20% padding

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#808080"
                    name="bolt.circle.fill"
                    style={styles.headerImage}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Weekly Device Usage (kWh)  </ThemedText>
            </ThemedView>

            {loading ? (
                <ThemedText>Loading...</ThemedText>
            ) : error ? (
                <ThemedText>Error: {error}</ThemedText>
            ) : (
                <View style={styles.chartContainer}>
                    <BarChart
                        data={chartData}
                        barWidth={32}
                        spacing={24}

                        hideRules
                        xAxisThickness={1}
                        yAxisThickness={1}
                        yAxisTextStyle={styles.yAxisText}
                        maxValue={1000}
                        stepValue={200}
                        noOfSections={6}
                        labelWidth={30}


                        backgroundColor="transparent"
                        showYAxisIndices


                    />
                    <View style={styles.insightsContainer}>
                        <ThemedText type="defaultSemiBold">Key Insights:</ThemedText>
                        <ThemedText>• Total consumption: {chartData.reduce((sum, item) => sum + item.value, 0).toFixed(2)} kWh</ThemedText>
                        <ThemedText>• EV accounts for {((chartData.find(item => item.label === 'EV')?.value || 0) / chartData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(1)}% of total usage</ThemedText>
                        <ThemedText>• Non-EV appliances use {(chartData.reduce((sum, item) => item.label !== 'EV' ? sum + item.value : sum, 0)).toFixed(2)} kWh combined</ThemedText>
                    </View>
                </View>
            )}
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    chartContainer: {
        padding: 16,
    },
    insightsContainer: {
        marginTop: 20,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    yAxisText: {
        color: '#666',
        fontSize: 12,
    },
    topLabel: {
        fontSize: 10,
        color: '#666',
        marginBottom: 4,
    }
});