import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import { Card, Paragraph, Button } from 'react-native-paper';
import { router } from "expo-router";

import BackButton from '@/components/BackButton';
import HeaderText from "@/components/HeaderText";
import Search from '@/components/Search';
import icons from '@/constants/icons';
import InstructorCard from '@/components/InstructorCard';

const instructors = [
    { id: 1, name: 'John Doe', email: 'johndoe@e.ntu.edu.sg', role: "instructor", latest_login: "31st Aug 2024 20:00:00", created: "30th Aug 2024 08:00:00" },
    { id: 2, name: 'Jane Smith', email: 'janesmith@e.ntu.edu.sg', role: "instructor", latest_login: "30th Aug 2024 21:00:00", created: "8th Aug 2024 08:00:00" },
];

const InstructorManage = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton 
                    style={styles.backButton}
                />
                <HeaderText
                    text={"Manage Instructors"}
                    style={styles.headerText}
                />
            </View>
            {/* Instructor Search Bar */}
            <View style={styles.searchContainer}>
                <Search
                    // TODO: Replace with instructor data
                    courseListData={[]}
                />
            </View>
            {/* Instructors List */}
            <View style={styles.instructorsContainer}>
                {instructors.map(instructor => (
                    <InstructorCard
                        key={instructor.id}
                        title={instructor.name}
                        subtitle={instructor.email}
                        role={instructor.role}
                        latest_login={instructor.latest_login}
                        created={instructor.created}
                    />
                ))}
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
    searchContainer: {
        marginHorizontal: 20,
        marginVertical: 8,
        marginTop: 40
    },
    instructorsContainer: {
        marginTop: 10,
        marginHorizontal: 20
    },
});

export default InstructorManage;
