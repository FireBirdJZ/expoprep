import React from 'react';
import { Animated } from 'react-native';
import { Svg, Path } from 'react-native-svg';

export default function AnimatedWave({ size, color }: { size: number; color: string }) {
    const waveAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(waveAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        ).start();
    }, [waveAnim]);

    return (
        <Animated.View style={{ transform: [{ translateX: waveAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] }) }] }}>
            <Svg width={size} height={size / 2} viewBox="0 0 100 50" fill="none">
                <Path
                    d="M0 25 Q 25 0, 50 25 T 100 25"
                    stroke={color}
                    strokeWidth={2}
                    fill="none"
                />
            </Svg>
        </Animated.View>
    );
}
