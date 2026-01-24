import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {configureReanimatedLogger} from "react-native-reanimated";

configureReanimatedLogger({
    strict: false,
});

export default function RootLayout() {

  return (
      <>
        <StatusBar style="light" backgroundColor="black" />
        <Stack screenOptions={{ headerShown: false }} />
      </>
  );
}