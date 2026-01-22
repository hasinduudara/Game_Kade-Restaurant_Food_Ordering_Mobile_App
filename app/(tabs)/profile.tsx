import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getUserData, logout } from '../../services/auth';
import "../../global.css";

export default function ProfileScreen() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        const data = await getUserData();
        setUser(data);
        setLoading(false);
    };

    const handleLogout = async () => {
        Alert.alert("Log Out", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Log Out",
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/(auth)/login');
                }
            }
        ]);
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#D93800" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 px-6">
            <View className="mt-6 mb-8 items-center">
                <Text className="text-2xl font-bold text-gray-800">My Profile</Text>
            </View>

            <View className="bg-white p-6 rounded-3xl shadow-sm items-center border border-gray-100">
                <View className="w-24 h-24 bg-gray-200 rounded-full mb-4 justify-center items-center">
                    <Ionicons name="person" size={40} color="gray" />
                </View>
                <Text className="text-xl font-bold text-gray-800">{user?.fullName || "User"}</Text>
                <Text className="text-gray-500 mt-1">{user?.email}</Text>
                {user?.phone && <Text className="text-[#D93800] mt-2 font-medium">{user.phone}</Text>}
            </View>

            <TouchableOpacity
                onPress={handleLogout}
                className="mt-auto mb-8 bg-red-50 p-4 rounded-2xl flex-row justify-center items-center border border-red-100"
            >
                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                <Text className="ml-2 text-[#FF3B30] font-bold text-lg">Log Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}