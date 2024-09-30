import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import { Card, Paragraph, Button } from 'react-native-paper';
import { router } from "expo-router";

import BackButton from '@/components/BackButton';
import HeaderText from "@/components/HeaderText";
import { Search } from '@/types/member_guest';
import icons from '@/constants/Icons';
import MemberCard from '@/components/MemberCard';

const members = [
    { id: 1, name: 'John Doe', email: 'johndoe@gmail.com', role: "member", latest_login: "31st Aug 2024 20:00:00", created: "30th Aug 2024 08:00:00" },
    { id: 2, name: 'Jane Smith', email: 'janesmith@gmail.com', role: "senior-member", latest_login: "30th Aug 2024 21:00:00", created: "8th Aug 2024 08:00:00" },
];

const MemberManage = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton 
                    style={styles.backButton}
                />
                <HeaderText
                    text={"Manage Members"}
                    style={styles.headerText}
                />
            </View>
            {/* Member Search Bar */}
            <View style={styles.searchContainer}>
                <Search
                    // TODO: Replace with member data
                    courseListData={[]}
                />
            </View>
            {/* Members List */}
            <View style={styles.membersContainer}>
                {members.map(member => (
                    <MemberCard
                        key={member.id}
                        title={member.name}
                        subtitle={member.email}
                        role={member.role}
                        latest_login={member.latest_login}
                        created={member.created}
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
    membersContainer: {
        marginTop: 10,
        marginHorizontal: 20
    },
});

export default MemberManage;
