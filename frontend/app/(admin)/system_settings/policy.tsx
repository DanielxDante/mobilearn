import React, { useEffect } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, BackHandler } from 'react-native'
import { router } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import WebView from "react-native-webview";

const SystemPolicy = () => {
    // OPTIONAL: Host policy.html on a web server and redirect to it
    // useEffect(() => {
    //     const openBrowser = async () => {
    //       try {
    //         await WebBrowser.openBrowserAsync('https://google.com');
    //         router.back()
    //       } catch (error) {
    //         console.error('Error opening browser:', error);
    //         router.back()
    //       }
    //     };
    
    //     openBrowser();
    
    //     // Prevent going back with the hardware back button (Android)
    //     // const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        
    
    //     return () => {
    //     //   backHandler.remove();
    //     };
    //   }, []);

    return (
        <SafeAreaView style={styles.container}>
            <WebView
            originWhitelist={['*']}
            source={require('./policy.html')}
            style={{ flex: 1 }} 
        />
        </SafeAreaView>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});

export default SystemPolicy;