import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { OrderProvider } from '../context/OrderContext';
import { View, ActivityIndicator, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import "../global.css";

configureReanimatedLogger({
    strict: false,
});

function RootLayoutNav() {
    const { loading } = useAuth();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setBackgroundColorAsync("white");
            NavigationBar.setButtonStyleAsync("dark");
        }
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D93800' }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    return (
        <View
            style={{
                flex: 1,
                paddingBottom: insets.bottom,
                backgroundColor: 'white'
            }}
        >
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="food/[id]" options={{ presentation: 'card', headerShown: false }} />
                <Stack.Screen name="map" options={{ presentation: 'fullScreenModal', headerShown: false }} />
            </Stack>
        </View>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <CartProvider>
                    <OrderProvider>
                        <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />
                        <RootLayoutNav />
                    </OrderProvider>
                </CartProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}