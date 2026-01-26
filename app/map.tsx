import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview'; // 👈 MapView වෙනුවට WebView
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { updateAddress } from '../services/userService';
import { useAuth } from '../context/AuthContext';

export default function MapScreen() {
    const { refreshUserData } = useAuth();
    const [location, setLocation] = useState<any>(null);
    const [address, setAddress] = useState("Locating...");
    const [saving, setSaving] = useState(false);

    // Map එක පටන් ගන්න තැන (Default: Colombo)
    const [initialRegion, setInitialRegion] = useState({ lat: 6.9271, lng: 79.8612 });
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Allow location access to find you.");
                setMapReady(true); // Default location එකෙන් පටන් ගන්නවා
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                lat: currentLocation.coords.latitude,
                lng: currentLocation.coords.longitude
            });

            // මුලින්ම Address එක හොයනවා
            fetchAddressFromOSM(currentLocation.coords.latitude, currentLocation.coords.longitude);
            setMapReady(true);
        })();
    }, []);

    const fetchAddressFromOSM = async (lat: number, lng: number) => {
        try {
            setAddress("Checking...");
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
            );
            const data = await response.json();
            if (data && data.display_name) {
                const addObj = data.address;
                const shortAddress = `${addObj.road || ''}, ${addObj.city || addObj.town || addObj.suburb || ''}`;
                setAddress(shortAddress.trim() === ',' ? data.display_name.split(',')[0] : shortAddress);
            }
        } catch (error) {
            setAddress("Unknown Location");
        }
    };

    // Web Map එකෙන් එන පණිවිඩ ලබා ගැනීම (Drag කළාම)
    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'move') {
                setLocation(data.coords); // මැද ලක්ෂ්‍යය සේව් කරගන්නවා
            } else if (data.type === 'moveEnd') {
                // Drag කරලා ඉවර වුනාම Address එක හොයනවා
                fetchAddressFromOSM(data.coords.lat, data.coords.lng);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleConfirmLocation = async () => {
        if (!location) return;
        setSaving(true);
        try {
            await updateAddress(address, { latitude: location.lat, longitude: location.lng });
            await refreshUserData();
            Alert.alert("Success", "Location Updated!");
            router.back();
        } catch (error) {
            Alert.alert("Error", "Could not save location.");
        } finally {
            setSaving(false);
        }
    };

    // --- HTML Map Code (Leaflet Map) ---
    // මේක App එක ඇතුලේ පොඩි වෙබ් පිටුවක් වගේ වැඩ කරනවා
    const mapHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                body { margin: 0; padding: 0; }
                #map { height: 100vh; width: 100vw; }
                .center-marker {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -100%); /* Pin එකේ තුඩ හරියටම මැදට ගන්න */
                    z-index: 1000;
                    pointer-events: none; /* Map එක click කරන්න ඉඩ දෙනවා */
                }
            </style>
        </head>
        <body>
            <div id="map"></div>
            
            <div class="center-marker">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#D93800">
                    <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 7 13 7 13s7-7.75 7-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
            </div>

            <script>
                // Map එක පටන් ගන්නවා
                var map = L.map('map', { zoomControl: false }).setView([${initialRegion.lat}, ${initialRegion.lng}], 15);
                
                // OpenStreetMap Tiles දානවා
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(map);

                // Map එක හොලවද්දි App එකට පණිවිඩ යවනවා
                map.on('move', function() {
                    var center = map.getCenter();
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'move',
                        coords: center
                    }));
                });

                map.on('moveend', function() {
                    var center = map.getCenter();
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'moveEnd',
                        coords: center
                    }));
                });
            </script>
        </body>
        </html>
    `;

    if (!mapReady) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#D93800" />
                <Text className="mt-2 text-gray-500">Loading Map...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* WebView Map */}
            <WebView
                source={{ html: mapHTML }}
                style={{ flex: 1 }}
                onMessage={handleMessage}
                scrollEnabled={false} // Map එක ඇතුලේ Scroll වෙන්න දෙනවා
            />

            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-5 bg-white p-3 rounded-full shadow-lg">
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/* Bottom Panel */}
            <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-2xl">
                <Text className="text-gray-500 text-xs font-bold uppercase mb-2">Selected Location</Text>
                <View className="flex-row items-center mb-6">
                    <Ionicons name="map-outline" size={24} color="#D93800" />
                    <Text className="text-xl font-bold text-gray-800 ml-2 flex-1" numberOfLines={2}>
                        {address}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleConfirmLocation}
                    disabled={saving}
                    className="bg-[#D93800] p-4 rounded-2xl items-center flex-row justify-center"
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text className="text-white font-bold text-lg mr-2">Confirm Location</Text>
                            <Ionicons name="checkmark-circle" size={24} color="white" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}