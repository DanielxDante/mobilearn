import React from "react";
import { Stack } from "expo-router";

const ContentSettingsHomeLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    )
};

export default ContentSettingsHomeLayout;
