import React, { useState } from 'react';
import { Card, Paragraph, Button } from 'react-native-paper';
import { TouchableOpacity, StyleSheet, Image } from 'react-native'
import { router } from "expo-router";

import icons from '@/constants/icons';

interface IMemberCard {
    title: string;
    subtitle: string | null;
    role: string;
    latest_login: string;
    created: string;
}

const MemberCard = ({ title, subtitle, role, latest_login, created }: IMemberCard) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card style={styles.card}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.cardHeader}>
                <Card.Title 
                    title={title} 
                    subtitle={subtitle}
                    titleStyle={styles.cardTitle}
                />
                <Image
                    source={expanded ? icons.chevronUp : icons.chevronDown}
                />
            </TouchableOpacity>
            {expanded && (
                <Card.Content style={styles.cardContent}>
                    {role === "senior-member" && (
                        <Paragraph style={styles.seniorMemberText}>Senior Member</Paragraph>
                    )}
                    {role === "member" && (
                        <Paragraph style={styles.memberText}>Member</Paragraph>
                    )}
                    <Paragraph>Latest Login: {latest_login}</Paragraph>
                    <Paragraph>Account Created: {created}</Paragraph>
                    <Button
                        mode="contained"
                        onPress={() => {
                            // TODO: go to courses registered by member
                            router.back();
                        }}
                        style={styles.viewCoursesButton}
                    >
                        View Registered Courses
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => {
                            router.back();
                        }}
                        style={styles.disableMemberButton}
                    >
                        DISABLE
                    </Button>
                </Card.Content>
            )}
        </Card>
    )
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
        backgroundColor: "#FFFFFF"
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,
        marginVertical: 5
    },
    cardTitle: {
        fontFamily: "Plus-Jakarta-Sans"
    },
    cardContent: {
        backgroundColor: "#F5F5F5",
        padding: 10
    },
    memberText: {
        fontFamily: "Plus-Jakarta-Sans",
        color: "#228B22"
    },
    seniorMemberText: {
        fontFamily: "Plus-Jakarta-Sans",
        color: "#3CB371"
    },
    viewCoursesButton: {
        marginTop: 10,
    },
    disableMemberButton: {
        marginTop: 10,
        backgroundColor: "red"
    }
});

export default MemberCard;

