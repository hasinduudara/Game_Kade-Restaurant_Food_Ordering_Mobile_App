import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import "../../global.css";

const { width } = Dimensions.get('window');

export default function LoginScreen() {

    const handleGoogleLogin = () => {
        console.log("Google Login Clicked");
    };

    const handleFacebookLogin = () => {
        console.log("Facebook Login Clicked");
    };

    return (
        <LinearGradient
            colors={['#D93800', '#FF6F00', '#D93800']}
            locations={[0, 0.5, 1]}
            className="flex-1"
        >
            <SafeAreaView className="flex-1 justify-between px-6 py-8">

                {/* Logo සහ Text */}
                <View className="flex-1 justify-center items-center">
                    <View className="bg-white/20 p-4 rounded-full mb-6 border border-white/10 shadow-lg">
                        <Image
                            source={require('../../assets/images/burger.png')}
                            className="w-40 h-40 object-contain"
                            style={{ width: width * 0.5, height: width * 0.5 }}
                        />
                    </View>

                    <Text className="text-white text-4xl font-extrabold text-center shadow-sm">
                        Let&#39;s Sign You In
                    </Text>
                    <Text className="text-yellow-100 text-center mt-2 font-medium text-lg opacity-90">
                        Welcome back to Game Kade!
                    </Text>
                </View>

                {/* Social Login Buttons */}
                <View className="w-full gap-4 mb-4">

                    {/* Google Button */}
                    <TouchableOpacity
                        onPress={handleGoogleLogin}
                        activeOpacity={0.8}
                        className="bg-white flex-row items-center justify-center py-4 rounded-3xl shadow-lg relative"
                    >
                        <Ionicons name="logo-google" size={24} color="black" style={{ position: 'absolute', left: 24 }} />
                        <Text className="text-gray-800 font-bold text-lg">Continue with Google</Text>
                    </TouchableOpacity>

                    {/* Facebook Button */}
                    <TouchableOpacity
                        onPress={handleFacebookLogin}
                        activeOpacity={0.8}
                        className="bg-[#1877F2] flex-row items-center justify-center py-4 rounded-3xl shadow-lg relative"
                    >
                        <Ionicons name="logo-facebook" size={24} color="white" style={{ position: 'absolute', left: 24 }} />
                        <Text className="text-white font-bold text-lg">Continue with Facebook</Text>
                    </TouchableOpacity>

                    {/* Terms Text */}
                    <Text className="text-white/60 text-[10px] text-center mt-4 px-4 leading-4">
                        By clicking continue, you agree to our Terms of Service and Privacy Policy.
                    </Text>
                </View>

            </SafeAreaView>
        </LinearGradient>
    );
}