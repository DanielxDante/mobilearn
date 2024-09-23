import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native'
import { router } from "expo-router";

import BackButton from '@/components/BackButton';
import HeaderText from "@/components/HeaderText";
import IconTextButton from '@/components/IconTextButton';
import icons from '@/constants/Icons';
import { 
    ADMIN_CHANNELS_MANAGE,
    ADMIN_COURSES_MANAGE,
    ADMIN_COURSES_REQUEST
} from '@/constants/Pages';

const ContentSettings = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton 
                    style={styles.backButton}
                />
                <HeaderText
                    text={"Content Management"}
                    style={styles.headerText}
                />
            </View>
            {/* Content Settings List */}
            <View style={styles.settingsContainer}>
                <IconTextButton 
                    icon={icons.tele}
                    text={"Manage Channels"}
                    onPress={() => {
                        router.push(ADMIN_CHANNELS_MANAGE);
                    }}
                    style={styles.iconTextButton}
                />
                <IconTextButton 
                    icon={icons.tele}
                    text={"Manage Courses"}
                    onPress={() => {
                        router.push(ADMIN_COURSES_MANAGE);
                    }}
                    style={styles.iconTextButton}
                />
                <IconTextButton 
                    icon={icons.tele}
                    text={"Approve/Reject Courses"}
                    onPress={() => {
                        router.push(ADMIN_COURSES_REQUEST);
                    }}
                    style={styles.iconTextButton}
                />
            </View>
        </SafeAreaView>
    );
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
});

export default ContentSettings;