import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { logout } from '../../services/auth';
import { uploadProfileImage, updateUserProfile, addCard, removeCard, updateAddress } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import "../../global.css";

export default function ProfileScreen() {
    const { user, refreshUserData } = useAuth();
    const [uploading, setUploading] = useState(false);

    // --- UI Modals States ---
    const [showEditModal, setShowEditModal] = useState(false);   // Profile Edit
    const [showCardModal, setShowCardModal] = useState(false);   // Add Card
    const [showAddressModal, setShowAddressModal] = useState(false); // Edit Address

    // --- Form Data States ---
    // 1. Profile Data
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newEmail, setNewEmail] = useState('');

    // 2. Card Data
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');

    // 3. Address Data
    const [newAddress, setNewAddress] = useState('');

    // 1. Image Upload Logic
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5,
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

    // 2. Profile Update Logic (Name, Email, Phone)
    const handleUpdateProfile = async () => {
        if (!newName.trim() || !newEmail.trim()) return Alert.alert("Error", "Name and Email cannot be empty");

        try {
            await updateUserProfile({
                fullName: newName,
                phone: newPhone,
                email: newEmail
            });
            await refreshUserData();
            setShowEditModal(false);
            Alert.alert("Success", "Profile Updated!");
        } catch (error) {
            Alert.alert("Error", "Could not update profile.");
        }
    };

    const openEditModal = () => {
        setNewName(user?.fullName || '');
        setNewPhone(user?.phone || '');
        setNewEmail(user?.email || '');
        setShowEditModal(true);
    };

    // 3. Card Logic (Add & Remove)
    const handleAddCard = async () => {
        if (!cardNumber || cardNumber.length < 16) return Alert.alert("Error", "Invalid Card Number");
        if (!cardExpiry) return Alert.alert("Error", "Expiry Date Required");

        const newCard = {
            id: Date.now().toString(),
            last4: cardNumber.slice(-4),
            expiry: cardExpiry,
            type: "Visa"
        };

        try {
            await addCard(newCard);
            await refreshUserData();
            setShowCardModal(false);
            setCardNumber(''); setCardExpiry(''); setCardCVC('');
            Alert.alert("Success", "Card Added!");
        } catch (error) {
            Alert.alert("Error", "Failed to add card");
        }
    };

    const handleRemoveCard = (card: any) => {
        Alert.alert("Remove Card", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove", style: 'destructive',
                onPress: async () => {
                    try {
                        await removeCard(card);
                        await refreshUserData();
                    } catch (error) {
                        Alert.alert("Error", "Failed to remove card");
                    }
                }
            }
        ]);
    };

    // 4. Address Update Logic
    const handleUpdateAddress = async () => {
        if(!newAddress) return Alert.alert("Error", "Address cannot be empty");
        try {
            await updateAddress(newAddress);
            await refreshUserData();
            setShowAddressModal(false);
            Alert.alert("Success", "Address Updated!");
        } catch (error) {
            Alert.alert("Error", "Could not update address.");
        }
    };


    const handleLogout = async () => {
        Alert.alert("Log Out", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Log Out", style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } }
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

                {/* --- Header Section --- */}
                <View className="mt-6 mb-6 items-center">
                    <Text className="text-2xl font-bold text-gray-800 mb-4">My Profile</Text>

                    <TouchableOpacity onPress={pickImage} disabled={uploading} className="relative">
                        <View className="w-28 h-28 bg-gray-200 rounded-full justify-center items-center overflow-hidden border-4 border-white shadow-sm">
                            {uploading ? <ActivityIndicator color="#D93800" /> : user?.photoURL ? <Image source={{ uri: user.photoURL }} className="w-full h-full" /> : <Ionicons name="person" size={50} color="gray" />}
                        </View>
                        <View className="absolute bottom-0 right-0 bg-[#D93800] p-2 rounded-full border-2 border-white"><Ionicons name="camera" size={16} color="white" /></View>
                    </TouchableOpacity>

                    <Text className="text-xl font-bold text-gray-800 mt-3">{user?.fullName || "Guest User"}</Text>
                    <Text className="text-gray-500">{user?.email}</Text>
                    {user?.phone ? <Text className="text-gray-600 mt-1 font-medium">{user.phone}</Text> : <Text className="text-gray-400 mt-1 text-sm">No phone number</Text>}

                    <TouchableOpacity onPress={openEditModal} className="mt-4 bg-gray-100 px-6 py-2 rounded-full flex-row items-center">
                        <Ionicons name="create-outline" size={18} color="#D93800" />
                        <Text className="ml-2 text-gray-700 font-semibold">Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* --- Address Section --- */}
                <View className="mb-6">
                    <Text className="text-gray-800 font-bold text-lg mb-3">Delivery Address</Text>
                    <TouchableOpacity
                        onPress={() => { setNewAddress(user?.address || ''); setShowAddressModal(true); }}
                        className="bg-white p-4 rounded-2xl flex-row items-center shadow-sm border border-gray-100"
                    >
                        <View className="bg-orange-100 p-2 rounded-full"><Ionicons name="location" size={24} color="#D93800" /></View>
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-800 font-medium" numberOfLines={1}>{user?.address || "Set Default Location"}</Text>
                            <Text className="text-gray-400 text-xs">Tap to edit address</Text>
                        </View>
                        <Ionicons name="pencil" size={20} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* --- Payment Methods Section --- */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-800 font-bold text-lg">Payment Methods</Text>
                        <TouchableOpacity onPress={() => setShowCardModal(true)}>
                            <Text className="text-[#D93800] font-bold text-sm">+ Add Card</Text>
                        </TouchableOpacity>
                    </View>

                    {user?.savedCards && user.savedCards.length > 0 ? (
                        user.savedCards.map((card: any, index: number) => (
                            <View key={index} className="bg-white p-4 rounded-2xl mb-3 flex-row items-center shadow-sm border border-gray-100 justify-between">
                                <View className="flex-row items-center">
                                    <View className="bg-blue-50 p-2 rounded-lg mr-3"><Ionicons name="card" size={24} color="#1A1F71" /></View>
                                    <View>
                                        <Text className="text-gray-800 font-bold text-base">**** **** **** {card.last4}</Text>
                                        <Text className="text-gray-400 text-xs">Expires: {card.expiry}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleRemoveCard(card)} className="p-2">
                                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <View className="bg-gray-100 p-6 rounded-2xl items-center justify-center border-dashed border-2 border-gray-300">
                            <Ionicons name="card-outline" size={30} color="gray" />
                            <Text className="text-gray-400 mt-2">No cards added yet</Text>
                        </View>
                    )}
                </View>

                {/* Logout */}
                <TouchableOpacity onPress={handleLogout} className="mt-auto mb-10 bg-red-50 p-4 rounded-2xl flex-row justify-center items-center border border-red-100">
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <Text className="ml-2 text-[#FF3B30] font-bold text-lg">Log Out</Text>
                </TouchableOpacity>

            </ScrollView>


            {/* 1. Edit Profile Modal */}
            <Modal visible={showEditModal} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white p-6 rounded-t-3xl">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Edit Profile</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}><Ionicons name="close" size={24} color="gray" /></TouchableOpacity>
                        </View>
                        <Text className="text-gray-600 font-medium mb-2 ml-1">Full Name</Text>
                        <TextInput className="bg-gray-100 p-4 rounded-xl mb-4 text-gray-800" value={newName} onChangeText={setNewName} placeholder="Full Name" />
                        <Text className="text-gray-600 font-medium mb-2 ml-1">Email</Text>
                        <TextInput className="bg-gray-100 p-4 rounded-xl mb-4 text-gray-800" value={newEmail} onChangeText={setNewEmail} keyboardType="email-address" autoCapitalize="none" placeholder="Email" />
                        <Text className="text-gray-600 font-medium mb-2 ml-1">Phone</Text>
                        <TextInput className="bg-gray-100 p-4 rounded-xl mb-6 text-gray-800" value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" placeholder="Phone" />
                        <TouchableOpacity onPress={handleUpdateProfile} className="bg-[#D93800] p-4 rounded-xl items-center mb-3"><Text className="text-white font-bold text-lg">Save Changes</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* 2. Add Card Modal */}
            <Modal visible={showCardModal} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white p-6 rounded-t-3xl h-[65%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Add New Card</Text>
                            <TouchableOpacity onPress={() => setShowCardModal(false)}><Ionicons name="close" size={24} color="gray" /></TouchableOpacity>
                        </View>
                        {/* Card Preview */}
                        <View className="items-center mb-6">
                            <View className="w-full h-40 bg-[#1A1F71] rounded-2xl justify-center items-center shadow-lg">
                                <Text className="text-white font-bold text-2xl tracking-widest">VISA</Text>
                            </View>
                        </View>
                        <Text className="text-gray-600 font-medium mb-2 ml-1">Card Number</Text>
                        <TextInput className="bg-gray-100 p-4 rounded-xl mb-4 text-gray-800 font-bold tracking-widest" value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" maxLength={16} placeholder="0000 0000 0000 0000" />
                        <View className="flex-row gap-4 mb-6">
                            <View className="flex-1">
                                <Text className="text-gray-600 font-medium mb-2 ml-1">Expiry</Text>
                                <TextInput className="bg-gray-100 p-4 rounded-xl text-gray-800" value={cardExpiry} onChangeText={setCardExpiry} maxLength={5} placeholder="MM/YY" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-600 font-medium mb-2 ml-1">CVC</Text>
                                <TextInput className="bg-gray-100 p-4 rounded-xl text-gray-800" value={cardCVC} onChangeText={setCardCVC} keyboardType="numeric" maxLength={3} secureTextEntry placeholder="123" />
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleAddCard} className="bg-[#D93800] p-4 rounded-xl items-center mb-3"><Text className="text-white font-bold text-lg">Add Card Now</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* 3. Edit Address Modal */}
            <Modal visible={showAddressModal} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white p-6 rounded-t-3xl">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Update Address</Text>
                            <TouchableOpacity onPress={() => setShowAddressModal(false)}><Ionicons name="close" size={24} color="gray" /></TouchableOpacity>
                        </View>
                        <TextInput className="bg-gray-100 p-4 rounded-xl mb-6" value={newAddress} onChangeText={setNewAddress} placeholder="Enter your address (City, Street)" />
                        <TouchableOpacity onPress={handleUpdateAddress} className="bg-[#D93800] p-4 rounded-xl items-center mb-3"><Text className="text-white font-bold">Save Address</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}