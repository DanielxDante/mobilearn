import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import VideoPlayer from "@/components/VideoPlayer";
import Lesson from "@/types/shared/Course/Lesson";
import { Colors } from "@/constants/colors";

const LessonContent = () => {
    const { lessonSelected } = useLocalSearchParams();
    const lesson: Lesson =
        typeof lessonSelected == "string" ? JSON.parse(lessonSelected) : [];
    console.log(lesson);
    return (
        <SafeAreaView style={styles.container}>
            {/* Check if lesson has a video */}
            {lesson.contentUrl ? (
                <VideoPlayer uri={lesson.contentUrl} />
            ) : (
                <View></View>
            )}
            {/* Lesson Content */}
            <View style={styles.content}>
                <Text style={styles.title}>{lesson.title}</Text>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{lesson.description}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    title: {
        color: Colors.defaultBlue,
        fontFamily: "Inter-SemiBold",
        fontSize: 20,
    },
    descriptionContainer: {
        paddingVertical: 24,
    },
    description: {
        color: "black",
        fontFamily: "Inter-Regular",
        fontSize: 12,
    },
});

export default LessonContent;
