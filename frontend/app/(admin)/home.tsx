import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const AdminHome = () => {
    // add this to themedtext
    const [loaded, error] = useFonts({
        'Plus-Jakarta-Sans': require('@/assets/fonts/PlusJakartaSans.ttf'),
        'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
    })

    useEffect(() => {
        if (loaded && !error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return <></>;
    }

    return (
        <SafeAreaView className='h-full w-full flex bg-white'>
            <View>
                <Text style={{ fontFamily: 'Inter-Bold' }}>Home</Text>
            </View>
        </SafeAreaView>
    )
}

export default AdminHome;
