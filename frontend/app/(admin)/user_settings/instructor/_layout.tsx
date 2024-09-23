import React from "react";
import { Stack } from "expo-router";

const InstructorSettingsHomeLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    )
};

export default InstructorSettingsHomeLayout;