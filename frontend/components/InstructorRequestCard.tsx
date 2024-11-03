import React, { useState } from 'react';
import { Card, Paragraph, Button } from 'react-native-paper';
import { TouchableOpacity, StyleSheet, Image } from 'react-native'
import { router } from "expo-router";

import icons from '@/constants/icons';
import { Colors } from '@/constants/colors';

interface IInstructorRequestCard {
    title: string;
    subtitle: string | null;
    institution: string;
    request_created: string;
}

const InstructorRequestCard = ({ title, subtitle, institution, request_created }: IInstructorRequestCard) => {
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
                    <Paragraph>Institution: {institution}</Paragraph>
                    <Paragraph>Request Created: {request_created}</Paragraph>
                    <Button
                        mode="contained"
                        onPress={() => {
                            // TODO: go to courses assigned to instructors
                            router.back();
                        }}
                        style={styles.approveInstructorButton}
                    >
                        APPROVE
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => {
                            router.back();
                        }}
                        style={styles.rejectInstructorButton}
                    >
                        REJECT
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
    approveInstructorButton: {
        marginTop: 10,
        backgroundColor: Colors.defaultBlue
    },
    rejectInstructorButton: {
        marginTop: 10,
        backgroundColor: "red"
    }
});

export default InstructorRequestCard;

