import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image } from 'react-native'

import BackButton from '@/components/BackButton';
import images from '@/constants/images';
import { VERSION } from "@/constants/Routes";

const SystemInfo = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton 
                    style={styles.backButton}
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.titleText}>
                    Mobilearn E-learning Platform
                </Text>
                <Text style={styles.versionText}>
                    Version {VERSION}
                </Text>
                <Image
                    source={images.mobilearnHat}
                    style={styles.logo}
                />
                <Text style={styles.footerText}>
                    ©2024 - 2025 Daniel Tay, Gerard Sin, Matthew Ashok
                </Text>
            </View>
        </SafeAreaView>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    appBarContainer: {
        flexDirection: "row",
        marginTop: 40,
        alignItems: "center",
        marginLeft: 30
    },
    backButton: {
        marginLeft: 5
    },
    headerText: {
        fontSize: 25,
        marginLeft: 20
    },
    settingsContainer: {
        flexDirection: "column",
        marginTop: 30,
    },
    iconTextButton: {
        paddingBottom: 40
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: 200,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    versionText: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 20,
    },
    logo: {
        height: 120,
        marginBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: 'gray',
        marginTop: 20,
    },
});

export default SystemInfo;