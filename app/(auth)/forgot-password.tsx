import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import "../../global.css";

export default function ForgotPasswordScreen() {
    // Steps: 1 = Email, 2 = OTP, 3 = New Password
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Data States
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Timer States
    const [timer, setTimer] = useState(120); // 2 minutes (120 seconds)
    const [canResend, setCanResend] = useState(false);

    // Timer Logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    // Format Time (mm:ss)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // --- STEP 1: Verify Email & Send OTP ---
    const handleSendOTP = async () => {
        if (!email) return Alert.alert("Error", "Please enter your email.");

        setLoading(true);
        try {
            // Generate 6-digit random OTP
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(code);

            console.log("\n\n========================================");
            console.log(`🔑 OTP FOR ${email}:  👉  ${code}  👈`);
            console.log("========================================\n\n");

            Alert.alert("OTP Sent", `Verification code generated for ${email}. (Check Your Console/Terminal)`);

            setStep(2);
            setTimer(120);
            setCanResend(false);

        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: Verify OTP ---
    const handleVerifyOTP = () => {
        if (otpCode !== generatedOtp) {
            Alert.alert("Invalid Code", "The code you entered is incorrect.");
            return;
        }
        if (timer === 0) {
            Alert.alert("Expired", "This code has expired. Please resend.");
            return;
        }

        // OTP Matched
        setStep(3);
    };

    // --- STEP 3: Reset Password ---
    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        setLoading(true);
        try {

            // Simulating API Call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert("Success", "Password reset successfully! Please login with your new password.", [
                { text: "OK", onPress: () => router.replace('/(auth)/login') }
            ]);

        } catch {
            Alert.alert("Error", "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#D93800', '#FF6F00', '#D93800']}
            locations={[0, 0.5, 1]}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-6">

                        {/* Header */}
                        <TouchableOpacity onPress={() => router.back()} className="absolute top-4 left-4 z-10 bg-white/20 p-2 rounded-full">
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        <View className="items-center mb-8">
                            <View className="bg-white/20 p-4 rounded-full mb-4 border border-white/10 shadow-lg">
                                <Ionicons name={step === 1 ? "mail" : step === 2 ? "key" : "lock-closed"} size={40} color="white" />
                            </View>
                            <Text className="text-white text-3xl font-extrabold text-center">
                                {step === 1 ? "Forgot Password?" : step === 2 ? "Verify OTP" : "New Password"}
                            </Text>
                            <Text className="text-yellow-100 text-center mt-2 text-sm opacity-90 px-4">
                                {step === 1 ? "Enter your email to receive a verification code."
                                    : step === 2 ? `Enter the 6-digit code sent to ${email}`
                                        : "Create a strong password for your account."}
                            </Text>
                        </View>

                        {/* Form Body */}
                        <View className="bg-white p-6 rounded-3xl shadow-xl space-y-5">

                            {/* --- STEP 1: EMAIL INPUT --- */}
                            {step === 1 && (
                                <>
                                    <View>
                                        <Text className="text-gray-600 ml-1 mb-1 font-medium">Email Address</Text>
                                        <TextInput
                                            className="bg-gray-100 p-4 rounded-xl text-gray-800 border border-gray-200 text-lg"
                                            placeholder="user@example.com"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={email}
                                            onChangeText={setEmail}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={handleSendOTP} disabled={loading} className="bg-[#D93800] py-4 rounded-xl shadow-lg mt-2">
                                        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-bold text-lg">Send OTP</Text>}
                                    </TouchableOpacity>
                                </>
                            )}

                            {/* --- STEP 2: OTP INPUT --- */}
                            {step === 2 && (
                                <>
                                    <View>
                                        <Text className="text-gray-600 ml-1 mb-1 font-medium">OTP Code</Text>
                                        <TextInput
                                            className="bg-gray-100 p-4 rounded-xl text-center text-gray-800 border border-gray-200 text-2xl tracking-widest font-bold"
                                            placeholder="000000"
                                            keyboardType="numeric"
                                            maxLength={6}
                                            value={otpCode}
                                            onChangeText={setOtpCode}
                                        />
                                    </View>

                                    <View className="items-center mb-2">
                                        {canResend ? (
                                            <TouchableOpacity onPress={handleSendOTP}>
                                                <Text className="text-[#D93800] font-bold">Resend Code</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <Text className="text-gray-400">Resend in {formatTime(timer)}</Text>
                                        )}
                                    </View>

                                    <TouchableOpacity onPress={handleVerifyOTP} className="bg-[#D93800] py-4 rounded-xl shadow-lg mt-2">
                                        <Text className="text-white text-center font-bold text-lg">Verify</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {/* --- STEP 3: NEW PASSWORD --- */}
                            {step === 3 && (
                                <>
                                    <View>
                                        <Text className="text-gray-600 ml-1 mb-1 font-medium">New Password</Text>
                                        <TextInput
                                            className="bg-gray-100 p-4 rounded-xl text-gray-800 border border-gray-200"
                                            placeholder="••••••••"
                                            secureTextEntry
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-gray-600 ml-1 mb-1 font-medium">Confirm Password</Text>
                                        <TextInput
                                            className="bg-gray-100 p-4 rounded-xl text-gray-800 border border-gray-200"
                                            placeholder="••••••••"
                                            secureTextEntry
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                        />
                                    </View>

                                    <TouchableOpacity onPress={handleResetPassword} disabled={loading} className="bg-[#D93800] py-4 rounded-xl shadow-lg mt-2">
                                        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-bold text-lg">Reset Password</Text>}
                                    </TouchableOpacity>
                                </>
                            )}

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}