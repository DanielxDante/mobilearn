import React, { useEffect } from 'react'
import { View, StyleSheet, BackHandler } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useSegments } from "expo-router";

import LargeButton from "@/components/LargeButton";
import HeaderText from "@/components/HeaderText";
import IconTextButton from '@/components/IconTextButton';
import icons from '@/constants/Icons';
import { 
    ADMIN_NAMESPACE,
    ADMIN_USER_SETTINGS,
    ADMIN_CONTENT_SETTINGS,
    ADMIN_PAYMENT_SETTINGS,
    ADMIN_SYSTEM_SETTINGS 
} from '@/constants/pages';
import useAuthStore from '@/store/authStore';

const AdminHome = () => {
    const logout = useAuthStore(
        (state) => state.logout
    );
    const segments = useSegments();

    // hardware back doesnt automatically log out the admin
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Get the current route
            const currentRoute = segments[segments.length - 1];

            // If we're on the admin home page, go to hardware home
            if (currentRoute === ADMIN_NAMESPACE) { // (admin) = index.tsx under /(admin)
                BackHandler.exitApp(); // Exit the app
                return true;
            }

            return false;
        });

        return () => backHandler.remove();
    }, [router, segments]);

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <HeaderText
                    text={"Settings"}
                    style={styles.headerText}
                />
            </View>
            {/* Settings List */}
            <View style={styles.settingsContainer}>
                <IconTextButton 
                    icon={icons.card}
                    text={"User Management"}
                    onPress={() => {
                        router.push(ADMIN_USER_SETTINGS);
                    }}
                    style={styles.iconTextButton}
                />
                <IconTextButton 
                    icon={icons.doc}
                    text={"Content Management"}
                    onPress={() => {
                        router.push(ADMIN_CONTENT_SETTINGS);
                    }}
                    style={styles.iconTextButton}
                />
                <IconTextButton 
                    icon={icons.mic}
                    text={"Payment Management"}
                    onPress={() => {
                        router.push(ADMIN_PAYMENT_SETTINGS);
                    }}
                    style={styles.iconTextButton}
                />
                <IconTextButton 
                    icon={icons.tele}
                    text={"System Management"}
                    onPress={() => {
                        router.push(ADMIN_SYSTEM_SETTINGS);
                    }}
                />
            </View>
            {/* Logout Button */}
            <View style={styles.footerContainer}>
                <LargeButton
                    text={"LOGOUT"}
                    isBlue={true}
                    onPress={async () => {
                        await logout();
                        router.push("/shared/signinupPage");
                        console.log("Admin logout");
                    }}
                />
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
    headerText: {
        fontSize: 25,
        marginLeft: 25
    },
    settingsContainer: {
        flexDirection: "column",
        marginTop: 30,
    },
    iconTextButton: {
        paddingBottom: 40
    },
    footerContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto",
        marginBottom: 30,
    },
});

export default AdminHome;
