import React from "react";
import { Stack } from "expo-router";

const PaymentSettingsHomeLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    )
};

export default PaymentSettingsHomeLayout;
