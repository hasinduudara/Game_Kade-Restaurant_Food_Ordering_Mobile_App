import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

import { useCart } from '../../context/CartContext';
import { useOrders, Order } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

// Restaurant Location (Static)
const RESTAURANT_LOC = { latitude: 6.927079, longitude: 79.861244 };
const DEFAULT_LOC = { latitude: 6.9000, longitude: 79.8500 };

export default function OrdersScreen() {
    const params = useLocalSearchParams();
    const { user } = useAuth();
    const { items, getTotalPrice, clearCart } = useCart();
    const { orders, activeOrder, setActiveOrder, addOrderToHistory, loadingOrders } = useOrders();

    // View Modes
    const [viewMode, setViewMode] = useState<'history' | 'summary' | 'details' | 'tracking'>('history');

    // Form States
    const [tempName, setTempName] = useState(user?.fullName || '');
    const [tempPhone, setTempPhone] = useState(user?.phone || '');
    const [tempAddress, setTempAddress] = useState(user?.address || '');

    // Location Picker States
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState(DEFAULT_LOC);
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Modal States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingStar, setRatingStar] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Custom Alert State
    const [alertConfig, setAlertConfig] = useState({
        visible: false, title: "", message: "", onClose: () => {}
    });

    // Tracking States
    const [orderStatus, setOrderStatus] = useState("Preparing");
    const [riderLoc, setRiderLoc] = useState(RESTAURANT_LOC);

    useEffect(() => {
        if (activeOrder) {
            setViewMode('tracking');
            if(activeOrder.deliveryDetails?.coordinates) {
                setSelectedCoords(activeOrder.deliveryDetails.coordinates);
            }
        } else if (params.view === 'checkout' && items.length > 0) {
            setViewMode((prev) => (prev === 'details' ? 'details' : 'summary'));
        } else {
            setViewMode('history');
        }
    }, [params.view, activeOrder, items.length]);

    // --- HELPER: Custom Alert ---
    const showCustomAlert = (title: string, message: string, callback?: () => void) => {
        setAlertConfig({
            visible: true, title, message,
            onClose: () => {
                setAlertConfig(prev => ({ ...prev, visible: false }));
                if (callback) callback();
            }
        });
    };

    const renderCustomAlert = () => (
        <Modal visible={alertConfig.visible} transparent animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/60">
                <View className="bg-white w-[85%] p-6 rounded-3xl items-center">
                    <Text className="text-xl font-bold mb-2">{alertConfig.title}</Text>
                    <Text className="text-gray-500 mb-6 text-center">{alertConfig.message}</Text>
                    <TouchableOpacity onPress={alertConfig.onClose} className="bg-black w-full py-3 rounded-xl items-center">
                        <Text className="text-white font-bold">OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    // GET CURRENT LOCATION
    const getUserLocation = async () => {
        setLoadingLocation(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Allow location access to select delivery point.');
                setLoadingLocation(false);
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setSelectedCoords({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        } catch {
            Alert.alert("Error", "Could not get current location.");
        } finally {
            setLoadingLocation(false);
        }
    };

    const openMapPicker = () => {
        setShowMapPicker(true);
        getUserLocation();
    };

    // --- MAP PICKER: Handle Message from WebView ---
    const handlePickerMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'moveEnd') {
                setSelectedCoords(data.coords);
            }
        } catch(e) { console.log(e); }
    };

    const handleCancel = () => {
        router.push('/(tabs)/cart');
        setViewMode('history');
    };

    const handlePayment = (method: string) => {
        setShowPaymentModal(false);
        showCustomAlert("Order Placed!", `Paid via ${method}. Waiting for restaurant confirmation.`, () => {
            const newOrder: Order = {
                id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                items: [...items],
                total: getTotalPrice(),
                date: new Date().toLocaleString(),
                status: 'Preparing',
                deliveryDetails: {
                    name: tempName,
                    phone: tempPhone,
                    address: tempAddress,
                    paymentMethod: method,
                    coordinates: selectedCoords
                }
            };
            setActiveOrder(newOrder);
            clearCart();
            setViewMode('tracking');
            startOrderSimulation(newOrder.deliveryDetails?.coordinates || DEFAULT_LOC);
        });
    };

    const startOrderSimulation = (targetLoc: any) => {
        setOrderStatus("Preparing");
        setRiderLoc(RESTAURANT_LOC);
        setTimeout(() => {
            showCustomAlert("Order Ready!", "Your food is ready! The rider is picking it up.", () => {
                setOrderStatus("Delivering");
                startRiderMovement(targetLoc);
            });
        }, 10000);
    };

    const startRiderMovement = (targetLoc: any) => {
        let steps = 0;
        const maxSteps = 40;
        const interval = setInterval(() => {
            steps++;
            const lat = RESTAURANT_LOC.latitude + (targetLoc.latitude - RESTAURANT_LOC.latitude) * (steps / maxSteps);
            const lng = RESTAURANT_LOC.longitude + (targetLoc.longitude - RESTAURANT_LOC.longitude) * (steps / maxSteps);
            setRiderLoc({ latitude: lat, longitude: lng });
            if (steps >= maxSteps) {
                clearInterval(interval);
                setOrderStatus("Completed");
                setShowRatingModal(true);
            }
        }, 200);
    };

    const submitRating = async () => {
        if (activeOrder) {
            setIsSubmitting(true);
            await addOrderToHistory({ ...activeOrder, status: 'Completed' });
            setIsSubmitting(false);
            setActiveOrder(null);
        }
        setShowRatingModal(false);
        setRatingStar(0);
        router.push('/(tabs)/home');
    };

    // --- HTML FOR PICKER MAP ---
    const pickerMapHTML = `
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
                var map = L.map('map', { zoomControl: false }).setView([${selectedCoords.latitude}, ${selectedCoords.longitude}], 16);
                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                map.on('moveend', function() {
                    var center = map.getCenter();
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'moveEnd', coords: { latitude: center.lat, longitude: center.lng } }));
                });
            </script>
        </body>
        </html>
    `;

    // --- HTML FOR TRACKING MAP ---
    const getTrackingHTML = () => {
        const targetCoords = activeOrder?.deliveryDetails?.coordinates || selectedCoords;
        return `
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
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script>
                    var map = L.map('map', { zoomControl: false }).setView([${RESTAURANT_LOC.latitude}, ${RESTAURANT_LOC.longitude}], 14);
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

                    var restIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
                    });
                     var userIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
                    });

                    L.marker([${RESTAURANT_LOC.latitude}, ${RESTAURANT_LOC.longitude}], {icon: restIcon}).addTo(map).bindPopup("Restaurant");
                    L.marker([${targetCoords.latitude}, ${targetCoords.longitude}], {icon: userIcon}).addTo(map).bindPopup("You");

                    ${orderStatus === 'Delivering' ? `
                        var riderIcon = L.icon({
                            iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png',
                            iconSize: [40, 40], iconAnchor: [20, 20]
                        });
                        L.marker([${riderLoc.latitude}, ${riderLoc.longitude}], {icon: riderIcon}).addTo(map);
                    ` : ''}

                    var latlngs = [
                        [${RESTAURANT_LOC.latitude}, ${RESTAURANT_LOC.longitude}],
                        [${targetCoords.latitude}, ${targetCoords.longitude}]
                    ];
                    var polyline = L.polyline(latlngs, {color: '#D93800', weight: 4}).addTo(map);
                    map.fitBounds(polyline.getBounds(), {padding: [50, 50]});
                </script>
            </body>
            </html>
        `;
    }

    // --- VIEWS ---
    if (viewMode === 'summary') {
        return (
            <View className="flex-1 bg-white pt-12 px-6">
                <Text className="text-2xl font-bold text-gray-800 mb-6">Order Summary</Text>
                <ScrollView className="flex-1 mb-24" showsVerticalScrollIndicator={false}>
                    {items.map((item) => (
                        <View key={item.id} className="flex-row justify-between mb-4 border-b border-gray-100 pb-2">
                            <Text className="text-gray-600 flex-1">{item.quantity} x {item.name}</Text>
                            <Text className="font-bold">Rs. {(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(0)}</Text>
                        </View>
                    ))}
                    <View className="flex-row justify-between mt-4 border-t border-gray-200 pt-4">
                        <Text className="text-xl font-bold">Total</Text>
                        <Text className="text-xl font-extrabold text-[#D93800]">Rs. {getTotalPrice().toFixed(0)}</Text>
                    </View>
                </ScrollView>
                <View className="absolute bottom-6 left-6 right-6 gap-3 bg-white pt-2">
                    <TouchableOpacity onPress={() => setViewMode('details')} className="bg-black py-4 rounded-xl items-center shadow-lg">
                        <Text className="text-white font-bold text-lg">Order Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCancel} className="bg-gray-100 py-4 rounded-xl items-center">
                        <Text className="text-gray-700 font-bold text-lg">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (viewMode === 'details') {
        return (
            <View className="flex-1 bg-white pt-12 px-6">
                <Text className="text-2xl font-bold text-gray-800 mb-6">Delivery Details</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-gray-500 mb-1 font-medium">Contact Name</Text>
                    <TextInput value={tempName} onChangeText={setTempName} className="bg-gray-100 p-4 rounded-xl mb-4 text-lg text-gray-800" />
                    <Text className="text-gray-500 mb-1 font-medium">Phone Number</Text>
                    <TextInput value={tempPhone} onChangeText={setTempPhone} keyboardType="phone-pad" className="bg-gray-100 p-4 rounded-xl mb-4 text-lg text-gray-800" />
                    <Text className="text-gray-500 mb-1 font-medium">Delivery Address</Text>
                    <View className="flex-row gap-2 mb-6">
                        <View className="bg-gray-100 p-4 rounded-xl flex-1 flex-row items-center">
                            <Ionicons name="location" size={24} color="#D93800" />
                            <TextInput value={tempAddress} onChangeText={setTempAddress} className="flex-1 ml-2 text-lg text-gray-800" multiline placeholder="Type address or pick on map ->" />
                        </View>
                        <TouchableOpacity onPress={openMapPicker} className="bg-black w-14 justify-center items-center rounded-xl"><Ionicons name="map" size={24} color="white" /></TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setShowPaymentModal(true)} className="bg-black py-4 rounded-xl items-center shadow-lg mb-4"><Text className="text-white font-bold text-lg">Proceed to Payment</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setViewMode('summary')} className="items-center py-2"><Text className="text-gray-500 font-bold">Back</Text></TouchableOpacity>
                </ScrollView>

                {/* --- LOCATION PICKER MODAL (Leaflet) --- */}
                <Modal visible={showMapPicker} animationType="slide">
                    <View className="flex-1 bg-white">
                        <WebView
                            source={{ html: pickerMapHTML }}
                            style={{ flex: 1 }}
                            onMessage={handlePickerMessage}
                        />
                        {loadingLocation && (
                            <View className="absolute top-20 self-center bg-white px-4 py-2 rounded-full shadow-md flex-row items-center"><ActivityIndicator size="small" color="#D93800" /><Text className="ml-2 font-bold text-gray-600">Locating you...</Text></View>
                        )}
                        <View className="absolute bottom-8 left-6 right-6">
                            <TouchableOpacity onPress={() => setShowMapPicker(false)} className="bg-[#D93800] py-4 rounded-xl items-center shadow-lg"><Text className="text-white font-bold text-lg">Confirm Location</Text></TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setShowMapPicker(false)} className="absolute top-12 left-4 bg-white p-2 rounded-full shadow-md mt-12"><Ionicons name="close" size={20} color="black" /></TouchableOpacity>
                    </View>
                </Modal>

                <Modal visible={showPaymentModal} transparent animationType="slide">
                    <View className="flex-1 justify-end bg-black/50">
                        <View className="bg-white p-6 rounded-t-3xl">
                            <Text className="text-xl font-bold mb-4">Select Payment Method</Text>
                            <TouchableOpacity onPress={() => handlePayment('Saved Card')} className="bg-gray-100 p-4 rounded-xl mb-3 flex-row items-center"><Ionicons name="card" size={24} color="black" /><Text className="ml-3 text-lg font-medium">Saved Card (**** 1234)</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => handlePayment('Cash On Delivery')} className="bg-gray-100 p-4 rounded-xl mb-6 flex-row items-center"><Ionicons name="cash" size={24} color="green" /><Text className="ml-3 text-lg font-medium">Cash On Delivery</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowPaymentModal(false)} className="items-center bg-gray-200 p-3 rounded-xl"><Text className="text-red-500 font-bold">Cancel</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {renderCustomAlert()}
            </View>
        );
    }

    if (viewMode === 'tracking' && activeOrder) {
        return (
            <View className="flex-1 bg-white">
                <View className="h-[60%] w-full">
                    {/* Tracking Map WebView */}
                    <WebView
                        source={{ html: getTrackingHTML() }}
                        style={{ flex: 1 }}
                    />
                </View>
                <View className="flex-1 bg-white -mt-6 rounded-t-3xl p-6 shadow-2xl">
                    <Text className="text-gray-500 text-center mb-2">Estimated Arrival: 15 mins</Text>
                    <Text className="text-2xl font-bold text-center text-gray-800 mb-6">{orderStatus}</Text>
                    <View className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden"><View className={`h-full bg-[#D93800] ${orderStatus === 'Preparing' ? 'w-1/3' : orderStatus === 'Delivering' ? 'w-2/3' : 'w-full'}`} /></View>
                    <View className="flex-row items-center bg-gray-50 p-4 rounded-xl">
                        <View className="bg-gray-300 w-12 h-12 rounded-full items-center justify-center"><Ionicons name="person" size={24} color="gray" /></View>
                        <View className="ml-3"><Text className="font-bold text-lg">Kamal Rider</Text><Text className="text-gray-500">Yamaha FZ - WP BEO 1234</Text></View>
                        <TouchableOpacity className="ml-auto bg-green-100 p-2 rounded-full"><Ionicons name="call" size={24} color="green" /></TouchableOpacity>
                    </View>
                </View>
                <Modal visible={showRatingModal} transparent animationType="fade">
                    <View className="flex-1 justify-center items-center bg-black/60">
                        <View className="bg-white w-[85%] p-6 rounded-3xl items-center">
                            <Text className="text-2xl font-bold mb-2">Order Completed!</Text>
                            <Text className="text-gray-500 mb-6">Please rate your food</Text>
                            <View className="flex-row gap-2 mb-6">{[1, 2, 3, 4, 5].map((star) => (<TouchableOpacity key={star} onPress={() => setRatingStar(star)}><Ionicons name={star <= ratingStar ? "star" : "star-outline"} size={32} color="#FFD700" /></TouchableOpacity>))}</View>
                            <TextInput placeholder="Write a review..." className="bg-gray-100 w-full p-3 rounded-xl mb-4" />
                            <TouchableOpacity onPress={submitRating} disabled={isSubmitting} className="bg-black w-full py-3 rounded-xl items-center"><Text className="text-white font-bold">Submit</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {renderCustomAlert()}
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 pt-12 px-6">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-gray-800">My Orders</Text>
                <TouchableOpacity onPress={() => setViewMode('history')}><Ionicons name="refresh" size={24} color="black" /></TouchableOpacity>
            </View>
            {loadingOrders ? (
                <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#D93800" /><Text className="text-gray-400 mt-2">Loading History...</Text></View>
            ) : orders.length === 0 ? (
                <View className="flex-1 justify-center items-center"><Ionicons name="receipt-outline" size={80} color="#ccc" /><Text className="text-gray-400 mt-4">No past orders</Text></View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
                            <View className="flex-row justify-between border-b border-gray-100 pb-2 mb-2">
                                <Text className="font-bold">#{item.id.slice(0, 8)}...</Text>
                                <Text className={`text-xs font-bold ${item.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}>{item.status}</Text>
                            </View>
                            <Text className="text-gray-500 text-xs mb-2">{item.date}</Text>
                            <Text className="text-gray-600 font-medium mb-1">{item.items.map(i => `${i.quantity} x ${i.name}`).join(', ')}</Text>
                            <Text className="text-lg font-extrabold text-[#D93800] text-right mt-2">Rs. {item.total.toFixed(0)}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}