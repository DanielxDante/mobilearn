import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Lesson from "@/types/shared/Course/Lesson";

const LessonContent = () => {
    const { lessonSelected } = useLocalSearchParams();
    const lesson: Lesson =
        typeof lessonSelected == "string" ? JSON.parse(lessonSelected) : [];
    console.log(lesson);
    return (
        <SafeAreaView>
            <Text>{lesson.title}</Text>
        </SafeAreaView>
    );
};

export default LessonContent;
