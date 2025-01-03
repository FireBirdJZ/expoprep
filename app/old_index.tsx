import {ActivityIndicator, StyleSheet, Text, View} from "react-native";

import React, { useEffect, useState } from "react"; // added this to test talking to backend

import {EnergyHeatmap} from '@/components/plots/HeatMap';

// export default function Page() {
//   return (
//     <View style={styles.container}>
//       <View style={styles.main}>
//         <Text style={styles.title}>Hello World</Text>
//         <Text style={styles.subtitle}>This is the first page of your app.</Text>
//       </View>
//     </View>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     padding: 24,
//   },
//   main: {
//     flex: 1,
//     justifyContent: "center",
//     maxWidth: 960,
//     marginHorizontal: "auto",
//   },
//   title: {
//     fontSize: 64,
//     fontWeight: "bold",
//   },
//   subtitle: {
//     fontSize: 36,
//     color: "#38434D",
//   },
// });

export default function Page() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Fetch data when the component mounts
  useEffect(() => {
    fetch("https://expoprep.onrender.com")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();
        })
        .then((text) => {
          setData(text);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
  }, []);

  return (
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.title}>Hello World</Text>
          <Text style={styles.subtitle}>This is the first page of your app.</Text>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {error && <Text style={styles.error}>Error: {error}</Text>}
          {data && (
              <View style={styles.dataContainer}>
                {/* Display the fetched data here */}
                <Text style={styles.dataText}>{JSON.stringify(data)}</Text>
              </View>
          )}
          <EnergyHeatmap />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  dataText: {
    fontSize: 16,
    color: "#333",
  },
});
