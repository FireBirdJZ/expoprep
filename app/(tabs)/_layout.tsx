import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { EnergyProvider } from '@/hooks/useEnergy';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <EnergyProvider>
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Energy Cost',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="moon.circle.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="bar"
                options={{
                    title: 'Device Usage',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
                }}
            />

            <Tabs.Screen
            name="heat"
            options={{
                title: 'Time Patterns',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar.badge.clock" color={color} />,
            }}
        />


            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Ionicons name="settings" size={28} color={color} />,
                }}
            />
        </Tabs>
        </EnergyProvider>
    );
}