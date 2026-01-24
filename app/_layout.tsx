import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/AuthContext';
import "../global.css";
import { View, ActivityIndicator } from 'react-native';

configureReanimatedLogger({
    strict: false,
});

// Loading Screen while checking auth state
function RootLayoutNav() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D93800' }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        // Wrap with AuthProvider
        <AuthProvider>
            <StatusBar style="light" backgroundColor="#000000" />
            <RootLayoutNav />
        </AuthProvider>
    );
}