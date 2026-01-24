import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { logout } from '../../services/auth';
import { uploadProfileImage, updateUserProfile } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import "../../global.css";

export default function ProfileScreen() {
    const { user, refreshUserData } = useAuth();
    const [uploading, setUploading] = useState(false);

    // Edit Modal States
    const [showEditModal, setShowEditModal] = useState(false);

    // Form Data States
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newEmail, setNewEmail] = useState('');

    // Image Upload Logic
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.canceled) {
            handleImageUpload(result.assets[0].uri);
        }
    };

    const handleImageUpload = async (uri: string) => {
        setUploading(true);
        try {
            await uploadProfileImage(uri);
            await refreshUserData();
            Alert.alert("Success", "Profile Picture Updated!");
        } catch (error) {
            Alert.alert("Error", "Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    // 👇 Profile Update Logic (Name, Email, Phone)
    const handleUpdateProfile = async () => {
        if (!newName.trim() || !newEmail.trim()) {
            Alert.alert("Error", "Name and Email cannot be empty");
            return;
        }

        try {
            await updateUserProfile({
                fullName: newName,
                phone: newPhone,
                email: newEmail
            });

            await refreshUserData(); // Context Refresh
            setShowEditModal(false);
            Alert.alert("Success", "Profile Updated!");
        } catch (error) {
            Alert.alert("Error", "Could not update profile.");
        }
    };

    // Fill form with current data when opening modal
    const openEditModal = () => {
        setNewName(user?.fullName || '');
        setNewPhone(user?.phone || '');
        setNewEmail(user?.email || '');
        setShowEditModal(true);
    };

    const handleLogout = async () => {
        Alert.alert("Log Out", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Log Out", style: 'destructive',
                onPress: async () => { await logout(); router.replace('/(auth)/login'); }
            }
        ]);
    };

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#D93800" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 px-6">
            <ScrollView showsVerticalScrollIndicator={false}>

                <View className="mt-6 mb-6 items-center">
                    <Text className="text-2xl font-bold text-gray-800 mb-4">My Profile</Text>

                    {/* Profile Image */}
                    <TouchableOpacity onPress={pickImage} disabled={uploading} className="relative">
                        <View className="w-28 h-28 bg-gray-200 rounded-full justify-center items-center overflow-hidden border-4 border-white shadow-sm">
                            {uploading ? (
                                <ActivityIndicator color="#D93800" />
                            ) : user?.photoURL ? (
                                <Image source={{ uri: user.photoURL }} className="w-full h-full" />
                            ) : (
                                <Ionicons name="person" size={50} color="gray" />
                            )}
                        </View>
                        <View className="absolute bottom-0 right-0 bg-[#D93800] p-2 rounded-full border-2 border-white">
                            <Ionicons name="camera" size={16} color="white" />
                        </View>
                    </TouchableOpacity>

                    {/* User Details Display */}
                    <Text className="text-xl font-bold text-gray-800 mt-3">{user?.fullName || "Guest User"}</Text>
                    <Text className="text-gray-500">{user?.email}</Text>

                    {user?.phone ? (
                        <Text className="text-gray-600 mt-1 font-medium">{user.phone}</Text>
                    ) : (
                        <Text className="text-gray-400 mt-1 text-sm">No phone number</Text>
                    )}

                    {/* Edit Button */}
                    <TouchableOpacity
                        onPress={openEditModal}
                        className="mt-4 bg-gray-100 px-6 py-2 rounded-full flex-row items-center"
                    >
                        <Ionicons name="create-outline" size={18} color="#D93800" />
                        <Text className="ml-2 text-gray-700 font-semibold">Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Placeholders */}
                <View className="mb-6 opacity-50">
                    <Text className="text-gray-400 text-center">Payment & Address settings coming soon...</Text>
                </View>

                {/* Logout */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="mt-auto mb-10 bg-red-50 p-4 rounded-2xl flex-row justify-center items-center border border-red-100"
                >
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <Text className="ml-2 text-[#FF3B30] font-bold text-lg">Log Out</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* 👇 Edit Profile Modal (Updated with Email) */}
            <Modal visible={showEditModal} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white p-6 rounded-t-3xl">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Edit Profile</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <Ionicons name="close" size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        {/* Name Input */}
                        <Text className="text-gray-600 font-medium mb-2 ml-1">Full Name</Text>
                        <TextInput
                            placeholder="Enter your name"
                            className="bg-gray-100 p-4 rounded-xl mb-4 text-gray-800"
                            value={newName}
                            onChangeText={setNewName}
                        />

                        {/* Email Input (New) */}
                        <Text className="text-gray-600 font-medium mb-2 ml-1">Email Address</Text>
                        <TextInput
                            placeholder="Enter email address"
                            keyboardType="email-address"
                            className="bg-gray-100 p-4 rounded-xl mb-4 text-gray-800"
                            value={newEmail}
                            onChangeText={setNewEmail}
                            autoCapitalize="none"
                        />
                        <Text className="text-xs text-gray-400 mb-4 ml-1">
                            Note: Changing email here will not change your login email.
                        </Text>

                        {/* Phone Input */}
                        <Text className="text-gray-600 font-medium mb-2 ml-1">Phone Number</Text>
                        <TextInput
                            placeholder="Enter phone number"
                            keyboardType="phone-pad"
                            className="bg-gray-100 p-4 rounded-xl mb-8 text-gray-800"
                            value={newPhone}
                            onChangeText={setNewPhone}
                        />

                        <TouchableOpacity onPress={handleUpdateProfile} className="bg-[#D93800] p-4 rounded-xl items-center mb-3">
                            <Text className="text-white font-bold text-lg">Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}