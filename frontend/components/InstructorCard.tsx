import React, { useState } from 'react';
import { Card, Paragraph, Button } from 'react-native-paper';
import { TouchableOpacity, StyleSheet, Image } from 'react-native'
import { router } from "expo-router";

import icons from '@/constants/icons';
import { Colors } from '@/constants/colors';

interface IInstructorCard {
    title: string;
    subtitle: string | null;
    role: string; // consider removing role for instructors if they are all the same
    latest_login: string;
    created: string;
}

const InstructorCard = ({ title, subtitle, role, latest_login, created }: IInstructorCard) => {
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
                    {role === "instructor" && (
                        <Paragraph style={styles.instructorText}>Instructor</Paragraph>
                    )}
                    <Paragraph>Latest Login: {latest_login}</Paragraph>
                    <Paragraph>Account Created: {created}</Paragraph>
                    <Button
                        mode="contained"
                        onPress={() => {
                            // TODO: go to courses assigned to instructors
                            router.back();
                        }}
                        style={styles.viewCoursesButton}
                    >
                        View Assigned Courses
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => {
                            router.back();
                        }}
                        style={styles.disableInstructorButton}
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
    instructorText: {
        fontFamily: "Plus-Jakarta-Sans",
        color: Colors.defaultBlue
    },
    viewCoursesButton: {
        marginTop: 10,
        backgroundColor: Colors.defaultBlue
    },
    disableInstructorButton: {
        marginTop: 10,
        backgroundColor: "red"
    }
});

export default InstructorCard;

