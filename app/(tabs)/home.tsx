import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import "../../global.css";
import { router } from 'expo-router';

import { categories, foodItems } from '../../constants/menuData';
import PromoCarousel from '../../components/PromoCarousel';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function HomeScreen() {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [activeCategoryId, setActiveCategoryId] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState<any>(null);

    // Filter Logic
    const filteredFood = foodItems.filter((item) => {
        if (searchQuery.length > 0) {
            return item.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return item.categoryId === activeCategoryId;
    });

    // 3. Handle Quick Add
    const handleQuickAdd = (item: any) => {
        addToCart(item);
        setLastAddedItem(item);
        setShowSuccessModal(true);
    };

    return (
        <View className="flex-1 bg-gray-50">

            {/* Header Section */}
            <View className="bg-white px-6 pt-6 pb-4 shadow-sm z-10">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity onPress={() => router.push('/map')}>
                        <Text className="text-gray-500 text-sm font-medium">Deliver to</Text>
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="location" size={20} color="#D93800" />
                            <Text className="text-gray-800 text-lg font-bold max-w-[250px]" numberOfLines={1}>
                                {user?.address || "Set Current Location"}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color="gray" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="mt-4 flex-row items-center bg-gray-100 p-3 rounded-xl">
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput
                        placeholder="Search for food..."
                        className="flex-1 ml-2 text-gray-700 font-medium"
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                    {searchQuery.length > 0 ? (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="gray" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity>
                            <Ionicons name="options-outline" size={20} color="#D93800" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <PromoCarousel />

                {/* Categories */}
                <View className="mt-8">
                    <Text className="mx-6 text-lg font-bold text-gray-800 mb-4">Categories</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
                        {categories.map((cat) => {
                            const isActive = activeCategoryId === cat.id;
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => { setActiveCategoryId(cat.id); setSearchQuery(''); }}
                                    className={`flex-row items-center p-3 rounded-full border ${isActive ? 'bg-[#D93800] border-[#D93800]' : 'bg-white border-gray-200'}`}
                                >
                                    <View className={`p-2 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                                        <Ionicons name={cat.icon as any} size={20} color={isActive ? 'white' : 'gray'} />
                                    </View>
                                    <Text className={`ml-2 font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>{cat.name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Popular Items List */}
                <View className="mt-8 mb-24 px-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-gray-800">{searchQuery.length > 0 ? 'Search Results' : 'Popular Now'}</Text>
                        {searchQuery.length === 0 && (<TouchableOpacity><Text className="text-[#FF6F00] font-semibold">See all</Text></TouchableOpacity>)}
                    </View>

                    {filteredFood.length > 0 ? (
                        filteredFood.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.9}
                                onPress={() => router.push({
                                    pathname: '/food/[id]',
                                    params: { id: item.id }
                                })}
                                className="bg-white rounded-3xl mb-4 shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <View className="flex-row p-3">
                                    <Image source={{ uri: item.image }} className="w-28 h-28 rounded-2xl bg-gray-100" resizeMode="cover" />
                                    <View className="flex-1 ml-3 justify-between py-1">
                                        <View>
                                            <Text className="text-lg font-bold text-gray-800 leading-6" numberOfLines={1}>{item.name}</Text>
                                            <Text className="text-gray-500 text-xs mt-1 leading-4" numberOfLines={2}>{item.description}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-end mt-2">
                                            <View>
                                                <Text className="text-[#D93800] font-extrabold text-xl">{item.price}</Text>
                                                <View className="flex-row items-center mt-1">
                                                    <Ionicons name="star" size={12} color="#D97706" />
                                                    <Text className="text-xs font-bold ml-1 text-gray-600">{item.rating} • 20 min</Text>
                                                </View>
                                            </View>

                                            {/* Quick Add Button */}
                                            <TouchableOpacity
                                                onPress={() => handleQuickAdd(item)}
                                                className="bg-black p-3 rounded-2xl"
                                            >
                                                <Ionicons name="add" size={20} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View className="items-center mt-10">
                            <Ionicons name="search-outline" size={50} color="#ccc" />
                            <Text className="text-gray-400 mt-2">No food found!</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* 4. Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/60">
                    <View className="bg-white w-[85%] p-6 rounded-3xl items-center shadow-2xl">

                        {/* Success Icon */}
                        <View className="bg-green-100 p-4 rounded-full mb-4">
                            <Ionicons name="checkmark-circle" size={60} color="#22c55e" />
                        </View>

                        <Text className="text-2xl font-bold text-gray-800 mb-2">Added to Cart!</Text>
                        <Text className="text-gray-500 text-center mb-6">
                            {lastAddedItem?.name} has been added to your cart.
                        </Text>

                        {/* Buttons */}
                        <View className="w-full gap-3">
                            <TouchableOpacity
                                onPress={() => { setShowSuccessModal(false); router.push('/(tabs)/cart'); }}
                                className="bg-[#D93800] w-full py-3 rounded-xl items-center"
                            >
                                <Text className="text-white font-bold text-lg">Go to Cart</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setShowSuccessModal(false)}
                                className="bg-gray-100 w-full py-3 rounded-xl items-center"
                            >
                                <Text className="text-gray-700 font-bold text-lg">Keep Shopping</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
}