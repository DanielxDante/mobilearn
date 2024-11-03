import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import { Card, Paragraph, Button } from 'react-native-paper';
import { router } from "expo-router";

import BackButton from '@/components/BackButton';
import HeaderText from "@/components/HeaderText";
import Search from '@/components/Search';
import icons from '@/constants/icons';
import InstructorRequestCard from '@/components/InstructorRequestCard';

const instructor_requests = [
    { id: 1, name: 'Alice Mare', email: 'alicemare@e.ntu.edu.sg', institution: 'Nanyang Technological University', request_created: '1st Sep 2024 07:00:00' },
    { id: 2, name: 'Ahmed Spade', email: 'ahmedspade@e.nus.edu.sg', institution: 'National University of Singapore', request_created: '2nd Sep 2024 07:00:00' },
]

const InstructorRequest = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton 
                    style={styles.backButton}
                />
                <HeaderText
                    text={"Instructor Requests"}
                    style={styles.headerText}
                />
            </View>
            {/* Instructor Request Search Bar */}
            <View style={styles.searchContainer}>
                <Search
                    // TODO: Replace with instructor data
                    courseListData={[]}
                />
            </View>
            {/* Instructor Request List */}
            <View style={styles.instructorRequestContainer}>
                {instructor_requests.map(request => (
                    <InstructorRequestCard
                        key={request.id}
                        title={request.name}
                        subtitle={request.email}
                        institution={request.institution}
                        request_created={request.request_created}
                    />
                ))}
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
    searchContainer: {
        marginHorizontal: 20,
        marginVertical: 8,
        marginTop: 40
    },
    instructorRequestContainer: {
        marginTop: 10,
        marginHorizontal: 20
    },
});

export default InstructorRequest;