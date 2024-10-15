import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import VideoPlayer from '@/components/VideoPlayer'
import { useLocalSearchParams } from 'expo-router'
import Course from '@/types/shared/Course'

const CourseDetails = () => {

    const { course } = useLocalSearchParams();
    const parsedCourse: Course =
        typeof course === "string" ? JSON.parse(course) : [];
    console.log(parsedCourse.id);
  return (
    <SafeAreaView style={styles.container}>
        <VideoPlayer uri={"https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignItems: "center",
    },
})

export default CourseDetails