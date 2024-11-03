import React from "react";
import { Stack } from "expo-router";
import { Platform, View, Text } from "react-native";

import { FontLoader } from "@/hooks/fontLoader";

const RootLayout = () => {

    return (
        <>
            {Platform.OS === "web" ? (
                // TODO: Make admin stuff on web
                <View>
                    <Text>Admin Stuff</Text>
                </View>
            ) : (
                <FontLoader>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                    </Stack>
                </FontLoader>
            )}
        </>

        
    );
};

export default RootLayout;
