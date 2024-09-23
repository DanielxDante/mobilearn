import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native'
import { router } from "expo-router";

import BackButton from '@/components/BackButton';
import HeaderText from "@/components/HeaderText";
import IconTextButton from '@/components/IconTextButton';
import icons from '@/constants/Icons';
import { 
    ADMIN_INSTRUCTOR_MANAGE,
    ADMIN_INSTRUCTOR_REQUEST
} from '@/constants/Pages';

const InstructorSettings = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton 
                    style={styles.backButton}
                />
                <HeaderText
                    text={"Instructor Management"}
                    style={styles.headerText}
                />
            </View>
            {/* Instructor Settings List */}
            <View style={styles.settingsContainer}>
                <IconTextButton 
                    icon={icons.tele}
                    text={"Manage Instructors"}
                    onPress={() => {
                        router.push(ADMIN_INSTRUCTOR_MANAGE);
                    }}
                    style={styles.iconTextButton}
                />
                <IconTextButton 
                    icon={icons.tele}
                    text={"Approve/Reject Instructors"}
                    onPress={() => {
                        router.push(ADMIN_INSTRUCTOR_REQUEST);
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

export default InstructorSettings;