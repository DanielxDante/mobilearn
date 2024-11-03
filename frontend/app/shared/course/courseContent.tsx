import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import VideoPlayer from '@/components/VideoPlayer';
import { useLocalSearchParams } from 'expo-router';
import Course from '@/types/shared/Course/Course';
import { Colors } from '@/constants/colors';
import { courseContentConstants as Constants } from "@/constants/textConstants";
import Lecture from "@/types/shared/Course/Lecture";
import Chapter from '@/types/shared/Course/Chapter';
import Topic from '@/types/shared/Course/Topic';

const CourseContent = () => {

    const { courseSelected } = useLocalSearchParams();
    const course: Course =
        typeof courseSelected === "string" ? JSON.parse(courseSelected) : [];
    const [videoUrl, setVideoUrl] = useState(course.chapters[0].lectures[0].topics[0].contentUrl);

    const [selectedChapterId, setSelectedChapterId] = useState<number>(course.chapters[0]?.id);
    const selectedChapter = course.chapters.find(chapter => chapter.id === selectedChapterId);

    const handleChapterSelect = (chapterId: number) => {
        setSelectedChapterId(chapterId);
    };

    const handleTopicSelect = (topicId: number) => {
        console.log("Topic id: " + topicId);
    }

    const renderLectureItem = (lecture: Lecture) => (
        <View style={styles.lectureItemContainer}>
            {/* Lecture title */}
            <Text style={styles.lectureTitle} numberOfLines={1}>{Constants.lecture} {lecture.id}: {lecture.title}</Text>
            <View style={styles.topicsContainer}>
            {/* Render Topic Item */}
            {lecture.topics.length > 0 ? (
                    lecture.topics.map((topic: Topic) => (
                        <View key={topic.id}>{
                                <View>
                                    <TouchableOpacity style={styles.topicContainer} onPress={() => handleTopicSelect(topic.id)}>
                                        <View style={styles.topicContainerDescription}>
                                            <Text style={styles.topicTitle}>{topic.title}</Text>
                                            <Text style={styles.topicDescription} numberOfLines={2}>{topic.description}</Text>
                                            <View style={styles.topicBar}></View>
                                        </View>
                                        {
                                            topic.completionStatus ? 
                                            (
                                                <View style={styles.topicContainerTickDone}>
                                                    <Image source={Constants.tick} style={styles.tickImage}/>
                                                </View>
                                            ) : (
                                                <View style={styles.topicContainerTick}></View>
                                            )
                                        }
                                    </TouchableOpacity>
                            </View>
                        }</View>
                    ))
                ) : (
                    <Text>No topics available</Text> // Fallback if no lectures
                )}
            </View>
        </View>
    )

    // console.log(course.chapters.find(chapter => chapter.id==selectedChapterId))

    return (
        <SafeAreaView style={styles.container}>
            <VideoPlayer uri={videoUrl}/>
            <ScrollView>
                {/* Course title and subtitle */}
                <Text style={styles.title}>
                    {course.title}
                </Text>
                <Text style={styles.school}>
                    {course.school}
                </Text>
                {/* Chapter buttons */}
                <View style={styles.chapterButtonContainer}>
                {course.chapters.length <= 4 ? (
                        // Render up to 4 chapter buttons if there are 4 or fewer chapters
                        course.chapters.map((chapter) => (
                            <TouchableOpacity
                                key={chapter.id}
                                style={[styles.chapterButton, {
                                    backgroundColor: selectedChapterId === chapter.id ? Colors.defaultBlue : '#E0E0E0',
                                }]}
                                onPress={() => handleChapterSelect(chapter.id)}
                            >
                                <Text style={[styles.chapterButtonText, { color: selectedChapterId === chapter.id ? '#FFF' : '#000' }]}>
                                    {Constants.chapter} {chapter.id}
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.picker}>
                            <RNPickerSelect 
                                onValueChange={(value) => handleChapterSelect(value)}
                                items={course.chapters.map((chapter) => ({
                                    label: chapter.id.toString(),
                                    value: chapter,
                                }))}
                                placeholder={{label: Constants.pickerPlaceholder, value: null}}
                                style={{placeholder: {
                                    color: "#A9A9A9",
                                }}}
                                value={course.chapters[0]}
                            />
                        </View>
                    )}
                </View>
                <Text style={styles.courseContentsTitle}>{Constants.courseContents}</Text>
                {selectedChapter && selectedChapter.lectures.length > 0 ? (
                    selectedChapter.lectures.map((lecture: Lecture) => (
                        <View key={lecture.id}>{renderLectureItem(lecture)}</View>
                    ))
                ) : (
                    <Text>No lectures available</Text> // Fallback if no lectures
                )}
            </ScrollView>
        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontFamily: "Inter-Bold",
        color: Colors.defaultBlue,
        fontSize: 21,
        marginTop: 20,
        marginHorizontal: 25,
    },
    school: {
        fontFamily: "Inter-Regular",
        color: Colors.defaultBlue,
        fontSize: 15,
        marginTop: 1,
        marginHorizontal: 25,
    },
    chapterButtonContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 20,
    },
    chapterButton: {
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 20,
        flex: 1,
    },
    chapterButtonText: {
        fontFamily: "Inter-Regular",
        alignSelf: "center",
    },
    picker: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#A9A9A9",
        marginHorizontal: 10,
    },
    courseContentsTitle: {
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
        fontSize: 20,
        marginHorizontal: 25,
        marginBottom: 10,
        alignSelf: "center",
    },
    lectureItemContainer: {
        marginVertical: 10,
    },
    lectureTitle: {
        fontFamily: "Inter-Regular",
        color: Colors.defaultBlue,
        fontSize: 18,
        marginBottom: 10,
        marginHorizontal: 15,
    },
    topicsContainer: {
        backgroundColor: '#356FC520',
        paddingLeft: 25,
        paddingRight: 15,
        paddingVertical: 5,
    },
    topicContainer: {
        paddingBottom: 2,
        flexDirection: "row",
        alignItems: "center"
    },
    topicContainerDescription: {
        flex: 1,
    },
    topicContainerTick: {
        height: 26,
        width: 26,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: Colors.defaultBlue,
        marginHorizontal: 5,
    },
    topicContainerTickDone: {
        height: 26,
        width: 26,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: Colors.defaultBlue,
        marginHorizontal: 5,
        backgroundColor: Colors.defaultBlue,
        justifyContent: "center",
        alignItems: "center",
    },
    topicTitle: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        color: Colors.defaultBlue,
    },
    topicDescription: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        color: "#6C6C6C",
        marginBottom: 6,
    },
    topicBar: {
        borderTopWidth: 1,
        borderColor: Colors.defaultBlue,
    },
    tickImage: {
        height: 13,
        width: 13,
        marginBottom: 3,
    }
});

export default CourseContent;