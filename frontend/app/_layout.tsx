import React from "react";
import { Stack } from "expo-router";

import { FontLoader } from "@/hooks/fontLoader";

const RootLayout = () => {

    return (
        <FontLoader>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </FontLoader>
    );
};

export default RootLayout;
