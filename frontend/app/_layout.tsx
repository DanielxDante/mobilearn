import React from "react";
import { Stack } from "expo-router";
import ExpoStripeProvider from "@/components/StripeProvider";

import { FontLoader } from "@/hooks/fontLoader";

const RootLayout = () => {
  return (
      <FontLoader>
        <ExpoStripeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </ExpoStripeProvider>
      </FontLoader>
  );
};

export default RootLayout;
