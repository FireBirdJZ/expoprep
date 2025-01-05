import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
    return (
        <PlatformPressable
            {...props}
            onPressIn={(ev) => {
                if (Platform.OS === 'ios') {
                    // iOS: Use a soft haptic feedback.
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
                        // Handle cases where haptics are not supported (fallback to no-op).
                    });
                } else if (Platform.OS === 'android') {
                    // Android: Use a minimal vibration if supported.
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
                        // Handle cases where haptics are not supported (fallback to no-op).
                    });
                } else {
                    // Fallback for other platforms: Do nothing.
                }
                props.onPressIn?.(ev);
            }}
        />
    );
}
