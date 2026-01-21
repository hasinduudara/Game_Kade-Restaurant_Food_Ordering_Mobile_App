import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import "../../global.css";

const { width } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {

    // GOOGLE AUTH SETUP
    const [gRequest, gResponse, gPromptAsync] = Google.useAuthRequest({
        webClientId: "671726402324-t2ufkeqn4j2aogohhlsegfcuuv4af7ld.apps.googleusercontent.com",
        androidClientId: "671726402324-t2ufkeqn4j2aogohhlsegfcuuv4af7ld.apps.googleusercontent.com",
    });

    // FACEBOOK AUTH SETUP
    const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
        clientId: "1600859444683956",
        responseType: ResponseType.Token,
    });

    // Handle Google Response
    useEffect(() => {
        if (gResponse?.type === 'success') {
            const { id_token } = gResponse.params;

            const token = id_token || gResponse.authentication?.idToken;

            if (!token) {
                Alert.alert("Login Failed", "No Google ID token received");
                return;
            }

            const credential = GoogleAuthProvider.credential(token);
            signInWithFirebase(credential, "Google");
        }
    }, [gResponse]);

    // Handle Facebook Response
    useEffect(() => {
        if (fbResponse?.type === 'success') {
            const { access_token } = fbResponse.params;

            if (!access_token) {
                Alert.alert("Login Failed", "No Facebook Access Token received");
                return;
            }

            // Create a Facebook credential with the token
            const credential = FacebookAuthProvider.credential(access_token);
            signInWithFirebase(credential, "Facebook");
        }
        if (fbResponse?.type === 'error') {
            Alert.alert("Facebook Login Error", fbResponse.error?.message);
        }
    }, [fbResponse]);

    // Sign in with Firebase using the provided credential
    const signInWithFirebase = (credential: any, providerName: string) => {
        signInWithCredential(auth, credential)
            .then((userCredential) => {
                console.log(`${providerName} User Signed In:`, userCredential.user.email);
                router.replace('/(tabs)/home');
            })
            .catch((error) => {
                console.error(`${providerName} Sign-In Error:`, error);
                Alert.alert(`${providerName} Login Failed`, error.message);
            });
    };

    return (
        <LinearGradient
            colors={['#D93800', '#FF6F00', '#D93800']}
            locations={[0, 0.5, 1]}
            className="flex-1"
        >
            <SafeAreaView className="flex-1 justify-between px-6 py-8">

                <View className="flex-1 justify-center items-center">
                    <View className="bg-white/20 p-4 rounded-full mb-6 border border-white/10 shadow-lg">
                        <Image
                            source={require('../../assets/images/burger.png')}
                            className="w-40 h-40 object-contain"
                            style={{ width: width * 0.5, height: width * 0.5 }}
                        />
                    </View>

                    <Text className="text-white text-4xl font-extrabold text-center">
                        Let&#39;s Sign You In
                    </Text>
                    <Text className="text-yellow-100 text-center mt-2 font-medium text-lg">
                        Welcome back to Game Kade!
                    </Text>
                </View>

                <View className="w-full gap-4 mb-4">

                    {/* Google Button */}
                    <TouchableOpacity
                        onPress={() => gPromptAsync()}
                        disabled={!gRequest}
                        activeOpacity={0.8}
                        className="bg-white flex-row items-center justify-center py-4 rounded-3xl shadow-lg relative"
                    >
                        {!gRequest ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <>
                                <Ionicons
                                    name="logo-google"
                                    size={24}
                                    color="black"
                                    style={{ position: 'absolute', left: 24 }}
                                />
                                <Text className="text-gray-800 font-bold text-lg">
                                    Continue with Google
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Facebook Button */}
                    <TouchableOpacity
                        onPress={() => fbPromptAsync()}
                        disabled={!fbRequest}
                        activeOpacity={0.8}
                        className="bg-[#1877F2] flex-row items-center justify-center py-4 rounded-3xl shadow-lg relative"
                    >
                        {!fbRequest ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Ionicons
                                    name="logo-facebook"
                                    size={24}
                                    color="white"
                                    style={{ position: 'absolute', left: 24 }}
                                />
                                <Text className="text-white font-bold text-lg">
                                    Continue with Facebook
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                </View>

            </SafeAreaView>
        </LinearGradient>
    );
}