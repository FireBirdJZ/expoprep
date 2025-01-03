// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { LineChart } from "react-native-gifted-charts";
//
// // Define the data point type
// interface DataPoint {
//     value: number;
//     date: string;
//     label?: string;
//     labelTextStyle?: {
//         color: string;
//         fontSize: number;
//     };
// }
//
// export default function HomeScreen() {
//     const usageData: DataPoint[] = Array.from({ length: 30 }, (_, i) => {
//         const date = new Date();
//         date.setDate(date.getDate() - (29 - i));
//         return {
//             value: Math.floor(Math.random() * 300 + 100),
//             date: date.toLocaleDateString("default", { month: "short", day: "numeric" }),
//             ...(i % 5 === 0 && {
//                 label: date.toLocaleDateString("default", { month: "short", day: "numeric" }),
//                 labelTextStyle: { color: "gray", fontSize: 10 },
//             }),
//         };
//     });
//
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Energy Consumption</Text>
//             <LineChart
//                 areaChart
//                 data={usageData}
//                 width={Dimensions.get("window").width - 500} // Ensure dynamic width
//                 height={500}
//                 spacing={40} // Adjust spacing for better readability
//                 thickness={2}
//                 color="#22C55E"
//                 startFillColor="rgba(34, 197, 94, 0.3)"
//                 endFillColor="rgba(34, 197, 94, 0.01)"
//                 startOpacity={0.9}
//                 endOpacity={0.2}
//                 noOfSections={4}
//                 maxValue={400}
//                 yAxisColor="gray"
//                 yAxisThickness={1}
//                 yAxisTextStyle={{ color: "gray", fontSize: 10 }}
//                 xAxisColor="gray"
//                 xAxisLabelTextStyle={{ color: "gray", fontSize: 10 }}
//                 hideDataPoints={false}
//                 rulesType="dashed"
//                 rulesColor="lightgray"
//                 pointerConfig={{
//                     pointerStripHeight: 300,
//                     pointerStripColor: "lightgray",
//                     pointerStripWidth: 1,
//                     pointerColor: "#22C55E",
//                     radius: 4,
//                     pointerLabelWidth: 100,
//                     pointerLabelHeight: 50,
//                     autoAdjustPointerLabelPosition: true,
//                     pointerLabelComponent: (items: DataPoint[]) => (
//                         <View style={styles.pointerLabel}>
//                             <Text style={styles.pointerLabelText}>{items[0]?.date}</Text>
//                             <Text style={styles.pointerLabelValue}>{items[0]?.value} kWh</Text>
//                         </View>
//                     ),
//                 }}
//             />
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center", // Center vertically
//         alignItems: "center", // Center horizontally
//         backgroundColor: "#ffffff",
//         padding: 100,
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginBottom: 20,
//         textAlign: "center",
//     },
//     pointerLabel: {
//         backgroundColor: "white",
//         borderRadius: 8,
//         padding: 8,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//         alignItems: "center",
//     },
//     pointerLabelText: {
//         color: "gray",
//         fontSize: 10,
//         marginBottom: 4,
//     },
//     pointerLabelValue: {
//         fontWeight: "bold",
//         fontSize: 14,
//         color: "#22C55E",
//     },
// });
//
//
//
//
//
//
//
//


import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

export default function HomeScreen() {
    // Create data points from your CSV data
    const chartData = [
        { value: 15.16, date: 'Dec 19', label: 'Dec 19', labelTextStyle: { color: "gray", fontSize: 10 } },
        { value: 14.82, date: 'Dec 20' },
        { value: 14.95, date: 'Dec 21' },
        { value: 15.31, date: 'Dec 22', label: 'Dec 22', labelTextStyle: { color: "gray", fontSize: 10 } },
        { value: 14.89, date: 'Dec 23' },
        { value: 15.22, date: 'Dec 24' },
        { value: 14.76, date: 'Dec 25', label: 'Dec 25', labelTextStyle: { color: "gray", fontSize: 10 } },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Energy Consumption</Text>
            <LineChart
                areaChart
                data={chartData}
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
                maxValue={20}
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
                    pointerLabelHeight: 50,
                    autoAdjustPointerLabelPosition: true,
                    pointerLabelComponent: (items) => (
                        <View style={styles.pointerLabel}>
                            <Text style={styles.pointerLabelText}>{items[0]?.date}</Text>
                            <Text style={styles.pointerLabelValue}>
                                {items[0]?.value.toFixed(2)} kWh
                            </Text>
                        </View>
                    ),
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
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
    },
});