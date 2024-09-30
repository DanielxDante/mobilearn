import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, Text, Switch } from 'react-native';

import { useAdminStore } from '@/store/adminStore';
import BackButton from '@/components/BackButton';
import HeaderText from "@/components/HeaderText";
import ToggleTextButton from '@/components/ToggleTextButton';

const SystemFeatures = () => {
    const recommenderSystemFeature = useAdminStore(
        (state) => state.recommenderSystemFeature
    );
    const setRecommenderSystemFeature = useAdminStore(
        (state) => state.setRecommenderSystemFeature
    );
    const instructorAnalyticsFeature = useAdminStore(
        (state) => state.instructorAnalyticsFeature
    );
    const setInstructorAnalyticsFeature = useAdminStore(
        (state) => state.setInstructorAnalyticsFeature
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton 
                    style={styles.backButton}
                />
                <HeaderText
                    text={"System Features"}
                    style={styles.headerText}
                />
            </View>
            <View style={styles.listContainer}>
                <ToggleTextButton 
                    text={"Recommender System"}
                    defaultValue={recommenderSystemFeature}
                    onToggle={setRecommenderSystemFeature}
                />
                <ToggleTextButton 
                    text={"Instructor Analytics"}
                    defaultValue={instructorAnalyticsFeature}
                    onToggle={setInstructorAnalyticsFeature}
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
    listContainer: {
        paddingHorizontal: 25,
        paddingVertical: 20,
    },
});

export default SystemFeatures;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "white",
//     },
//     appBarContainer: {
//         flexDirection: "row",
//         marginTop: 40,
//         alignItems: "center",
//         marginLeft: 30
//     },
//     backButton: {
//         marginLeft: 5
//     },
//     headerText: {
//         fontSize: 25,
//         marginLeft: 20
//     },
//     listContainer: {
//         paddingHorizontal: 25,
//         paddingVertical: 20,
//     },
//     switchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 10,
//     },
//     textField: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         paddingHorizontal: 10,
//         marginTop: 10,
//     },

