import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
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

    // Webview Ref
    const webViewRef = useRef<WebView>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Allow location access to find you.");
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = currentLocation.coords;

            // Set initial location
            setLocation({ lat: latitude, lng: longitude });
            fetchAddressFromOSM(latitude, longitude);
        })();
    }, []);

    // 1. Address Fetching (OSM - Free)
    const fetchAddressFromOSM = async (lat: number, lng: number) => {
        try {
            setAddress("Fetching address...");
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`,
                { headers: { 'User-Agent': 'GameKade-App/1.0' } }
            );
            const data = await response.json();
            if (data && data.display_name) {
                const addObj = data.address;
                const shortAddress = `${addObj.road || ''} ${addObj.suburb || ''} ${addObj.city || addObj.town || ''}`;
                setAddress(shortAddress.trim() === '' ? data.display_name.split(',')[0] : shortAddress);
            }
        } catch (error) {
            setAddress("Location Selected");
        }
    };

    // 2. Handle Message from Map (When user drags map)
    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'moveEnd') {
                setLocation(data.coords);
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

    // 3. HTML Content (Leaflet Map - 100% Free & No API Key)
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
                .leaflet-control-zoom { display: none !important; }
                .leaflet-control-attribution { display: none !important; }
                .center-marker {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -100%);
                    z-index: 1000;
                    pointer-events: none;
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
                var map = L.map('map', { zoomControl: false }).setView([${location?.lat || 6.9271}, ${location?.lng || 79.8612}], 18);
                
                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
                    maxZoom: 19
                }).addTo(map);

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

    return (
        <View className="flex-1 bg-white">
            {location ? (
                <WebView
                    ref={webViewRef}
                    source={{ html: mapHTML }}
                    style={{ flex: 1 }}
                    onMessage={handleMessage}
                    scrollEnabled={false}
                />
            ) : (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#D93800" />
                </View>
            )}

            <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-5 bg-white p-3 rounded-full shadow-lg">
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-2xl pb-10">
                <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-4" />
                <Text className="text-gray-500 text-xs font-bold uppercase mb-2">Selected Location</Text>
                <View className="flex-row items-center mb-6">
                    <View className="bg-orange-100 p-2 rounded-full mr-3">
                        <Ionicons name="map" size={24} color="#D93800" />
                    </View>
                    <Text className="text-xl font-bold text-gray-800 flex-1" numberOfLines={2}>
                        {address}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleConfirmLocation}
                    disabled={saving}
                    className="bg-[#D93800] p-4 rounded-2xl items-center flex-row justify-center shadow-lg shadow-orange-200"
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