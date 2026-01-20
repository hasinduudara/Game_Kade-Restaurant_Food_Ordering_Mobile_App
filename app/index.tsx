import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import "../global.css"; // ඔයාගේ global css file path එක

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {

    const handleStart = () => {
        console.log("Navigating...");
    };

    return (
        <View className="flex-1 bg-[#FF4200]">
            <StatusBar style="light" />

            {/* Background Pattern (Optional: Subtle circles to match the vibe) */}
            <View className="absolute top-0 left-0 w-full h-full opacity-10">
                <View className="absolute top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                <View className="absolute bottom-20 -right-20 w-80 h-80 bg-yellow-400 rounded-full blur-3xl" />
            </View>

            <SafeAreaView className="flex-1 justify-between items-center px-6 py-4">

                {/* 1. Top Section: Tag & Title */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="items-center mt-4"
                >
                    {/* Top Tag (Brush stroke effect simulation) */}
                    <View className="bg-white/20 px-6 py-2 rounded-full mb-6 border border-white/10">
                        <Text className="text-white font-bold tracking-wider text-xs uppercase">
                            Earn Rewards - Join Now
                        </Text>
                    </View>

                    {/* Main Title */}
                    <Text className="text-white text-5xl font-extrabold text-center leading-tight shadow-sm">
                        Welcome to{"\n"}
                        <Text className="text-yellow-100">Game Kade</Text>
                    </Text>
                </Animated.View>

                {/* 2. Middle Section: Center Image */}
                <Animated.View
                    entering={FadeInDown.delay(300).springify()}
                    className="flex-1 justify-center items-center relative z-10"
                >
                    {/* Food Image - Sri Lankan Style Plate */}
                    <Image
                        source={{ uri: 'https://png.pngtree.com/png-clipart/20231019/original/pngtree-sri-lankan-rice-and-curry-dish-png-image_13373729.png' }}
                        className="w-80 h-80 object-contain"
                        style={{ width: width * 0.85, height: width * 0.85 }}
                    />
                </Animated.View>

                {/* 3. Bottom Section: Buttons */}
                <Animated.View
                    entering={FadeInDown.delay(500).springify()}
                    className="w-full gap-4 mb-4"
                >
                    {/* Light Button (Continue with Email style) */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="w-full bg-[#FFF0E5] py-4 rounded-3xl items-center justify-center shadow-lg"
                    >
                        <Text className="text-[#FF4200] font-bold text-lg">
                            Start Your Journey
                        </Text>
                    </TouchableOpacity>

                    {/* Footer / Legal Text */}
                    <Text className="text-white/60 text-center text-[10px] mt-2 px-4 leading-4">
                        By tapping Continue or Order Delivery, you agree to Game Kade Terms & Conditions and Privacy Policy.
                    </Text>
                </Animated.View>

            </SafeAreaView>
        </View>
    );
}