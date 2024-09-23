import React, { ReactNode, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Define font sources
const fontSources = {
  "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
  "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
  "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
  "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
  "Plus-Jakarta-Sans": require("@/assets/fonts/PlusJakartaSans.ttf"),
};

export const useCustomFonts = () => {
  const [fontsLoaded, fontError] = useFonts(fontSources);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn('Error preventing splash screen auto-hide:', e);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (fontsLoaded) {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn('Error hiding splash screen:', e);
        } finally {
          setIsReady(true);
        }
      }
    };

    hideSplashScreen();
  }, [fontsLoaded]);

  return { isReady, fontError };
};

interface IFontLoader {
  children: ReactNode;
}

export const FontLoader = ({ children }: IFontLoader) => {
  const { isReady, fontError } = useCustomFonts();

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  if (fontError) {
    console.error('Font loading error:', fontError);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading fonts. Please try again.</Text>
      </View>
    );
  }

  return <>{children}</>;
};