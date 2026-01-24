import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// 1. Banner Data (Updated with Food Name & Description)
const promoData = [
    {
        id: 1,
        tag: 'Special Offer!',
        foodName: 'Egg Burger',
        description: 'Bun with a fried egg, onions, and sauce.',
        discount: '30% OFF',
        btnText: 'Order Now',
        colors: ['#D93800', '#FF6F00'] as const,
        image: 'https://i.pinimg.com/736x/8e/e3/08/8ee3089ff220fda48c103b136b2640b6.jpg',
    },
    {
        id: 2,
        tag: 'Weekend Deal!',
        foodName: 'Chicken Kottu',
        description: 'The classic Sri Lankan chicken kottu with spicy gravy.',
        discount: 'Free Coke',
        btnText: 'Grab Deal',
        colors: ['#FF9900', '#FFCC00'] as const,
        image: 'https://i.pinimg.com/736x/2a/4c/7e/2a4c7e25a4be3edd84b3f4f8ef981b9c.jpg',
    },
    {
        id: 3,
        tag: 'New Arrival!',
        foodName: 'Chicken Biryani',
        description: 'Aromatic basmati rice cooked with spices and chicken.',
        discount: 'Free Coke',
        btnText: 'Try Now',
        colors: ['#11998e', '#38ef7d'] as const,
        image: 'https://i.pinimg.com/736x/87/4e/b9/874eb9bef63629c19c327cf127fcda37.jpg',
    },
];

export default function PromoCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    // 2. Auto Slide Logic
    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= promoData.length) {
                nextIndex = 0;
            }

            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setActiveIndex(nextIndex);

        }, 4000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={promoData}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                renderItem={({ item }) => (
                    <View style={{ width: width, paddingHorizontal: 24 }}>
                        <View className="rounded-3xl overflow-hidden shadow-xl mt-6">
                            <LinearGradient
                                colors={item.colors}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="p-5 flex-row items-center justify-between h-53"
                            >
                                {/* Left Side: Text Content */}
                                <View className="flex-1 pr-4">
                                    {/* Tag */}
                                    <View className="bg-white/20 self-start px-2 py-1 rounded-lg mb-2">
                                        <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                                            {item.tag}
                                        </Text>
                                    </View>

                                    {/* Main Food Name */}
                                    <Text
                                        className="text-white text-2xl font-extrabold leading-tight shadow-sm"
                                        numberOfLines={2}
                                    >
                                        {item.foodName}
                                    </Text>

                                    {/* Description */}
                                    <Text
                                        className="text-white/90 text-xs mt-1 mb-2 font-medium"
                                        numberOfLines={2}
                                    >
                                        {item.description}
                                    </Text>

                                    {/* Discount */}
                                    <Text className="text-yellow-200 text-3xl font-black shadow-sm">
                                        {item.discount}
                                    </Text>

                                    {/* Button */}
                                    <TouchableOpacity className="bg-white px-5 py-2 rounded-full mt-2 self-start shadow-sm">
                                        <Text style={{ color: item.colors[0] }} className="font-bold text-xs">
                                            {item.btnText}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Right Side: Image */}
                                <View className="shadow-2xl">
                                    <Image
                                        source={{ uri: item.image }}
                                        className="w-36 h-36 rounded-full border-4 border-white/20"
                                        resizeMode="cover"
                                    />
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                )}
            />

            {/* 3. Dots Indicator */}
            <View className="flex-row justify-center mt-4 gap-2">
                {promoData.map((_, index) => (
                    <View
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                            activeIndex === index ? 'w-6 bg-[#D93800]' : 'w-2 bg-gray-300'
                        }`}
                    />
                ))}
            </View>
        </View>
    );
}