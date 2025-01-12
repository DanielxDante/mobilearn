import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import Course from "@/types/shared/Course/Course";
import { Colors } from "@/constants/colors";
import { courseContentConstants as Constants } from "@/constants/textConstants";
import Lesson from "@/types/shared/Course/Lesson";
import useAppStore from "@/store/appStore";

const CourseContent = () => {
    const { courseId } = useLocalSearchParams();
    const [course, setCourse] = useState<Course>();
    const getEnrolledCourse = useAppStore((state) => state.getEnrolledCourse)
    const [course_image, setCourseImage] = useState<string>("");
    const [selectedChapterId, setSelectedChapterId] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    const fetchCourseData = async () => {
        setLoading(true);
        const data = await getEnrolledCourse(Number(courseId));
        setCourse(data);
        setCourseImage(data.course_image);
        setSelectedChapterId(data.chapters[0].chapter_id)
        setLoading(false);
        };
    fetchCourseData();
    }, [courseId]);

    const { width: screenWidth } = Dimensions.get('window')
    const [imageHeight, setImageHeight] = useState(0)
    useEffect(() => {
        if (course_image) {
            Image.getSize(course_image, (width, height) => {
            const aspectRatio = width/height;
            const calculatedHeight = screenWidth/aspectRatio;
            setImageHeight(calculatedHeight);
            })
    }
    }, [course_image])

    // Ensure that course is available before continuing
    if (loading) {
        return (
        <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color={Colors.defaultBlue} />
        </SafeAreaView>
        );
    }

    
    const selectedChapter = course?.chapters.find(
        (chapter) => chapter.chapter_id === selectedChapterId
    );

    const handleChapterSelect = (chapterId: string) => {
        setSelectedChapterId(chapterId);
        console.log("Chapter: " + chapterId);
    };

    const handleLessonSelect = (lessonId: string) => {
        console.log("Lesson id: " + lessonId);
        const lessonSelected = course?.chapters
            .map((chapter) => chapter.lessons)
            .flat()
            .find((lesson) => lesson.lesson_id === lessonId.toString());
        router.push({
            pathname: "./lessonContent",
            params: {
                lessonSelected: JSON.stringify(lessonSelected),
            },
        });
    };

    const renderLectureItem = (lesson: Lesson) => (
        <View style={styles.lessonItemContainer}>
            {/* Lesson title */}
            <Text style={styles.lessonTitle} numberOfLines={1}>
                {Constants.lesson} {lesson.lesson_id}: {lesson.lesson_name}
            </Text>
            <View style={styles.lessonContainer}>
                <TouchableOpacity
                    style={styles.topicContainer}
                    onPress={() => handleLessonSelect(lesson.lesson_id)}
                >
                    {/* For lesson description if there will be any */}
                    {/* <View style={styles.lessonContainerDescription}>
                        <Text
                            style={styles.lessonDescription}
                            numberOfLines={3}
                        >
                            {lesson.description}
                        </Text>
                        <View style={styles.lessonBar}></View>
                    </View> */}
                    {/* For lesson completionStatus if there will be any */}
                    {/* {lesson.completionStatus ? (
                        <View style={styles.lessonContainerTickDone}>
                            <Image
                                source={Constants.tick}
                                style={styles.tickImage}
                            />
                        </View>
                    ) : (
                        <View style={styles.lessonContainerTick}></View>
                    )} */}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {course && (
                <ScrollView>
                {course_image ? (
                    <Image
                    source={{ uri: course_image }}
                    style={[styles.courseImage, {height: imageHeight}]}
                    resizeMode="cover"
                    />
                ) : (
                    <ActivityIndicator size="large" color="#0000ff" />
                )}
                {/* Course title and subtitle */}
                <Text style={styles.title}>{course.course_name}</Text>
                <Text style={styles.school}>{course.community_name}</Text>
                {/* Chapter buttons */}
                <View style={styles.chapterButtonContainer}>
                    {course.chapters.length <=2 ? (
                        // Render up to 4 chapter buttons if there are 3 or fewer chapters
                        course.chapters
                            .sort((a, b) => a.order - b.order) // Sorting chapters by order
                            .map((chapter) => (
                                <TouchableOpacity
                                    key={chapter.chapter_id}
                                    style={[
                                        styles.chapterButton,
                                        {
                                            backgroundColor:
                                                selectedChapterId === chapter.chapter_id
                                                    ? Colors.defaultBlue
                                                    : "#E0E0E0",
                                        },
                                    ]}
                                    onPress={() => handleChapterSelect(chapter.chapter_id)}
                                >
                                    <Text
                                        style={[
                                            styles.chapterButtonText,
                                            {
                                                color:
                                                    selectedChapterId === chapter.chapter_id
                                                        ? "#FFF"
                                                        : "#000",
                                            },
                                        ]}
                                    >
                                        {`Chap ${chapter.order}`}
                                    </Text>
                                </TouchableOpacity>
                            ))
                    ) : (
                        <View style={styles.picker}>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    handleChapterSelect(value);
                                    console.log("RNPicker value: " + value);
                                }}
                                items={course.chapters.sort((a,b) => a.order - b.order)
                                    .map((chapter) => ({
                                    label: `Chapter ${chapter.order}`,
                                    value: chapter.chapter_id,
                                }))}
                                placeholder={{
                                    label: Constants.pickerPlaceholder,
                                    value: null,
                                }}
                                style={{
                                    placeholder: {
                                        color: "#A9A9A9",
                                    },
                                }}
                                value={selectedChapterId}
                            />
                        </View>
                    )}
                </View>
                <Text style={styles.courseContentsTitle}>
                    {Constants.courseContents}
                </Text>
                {selectedChapter && selectedChapter.lessons.length > 0 ? (
                    selectedChapter.lessons.map((lesson: Lesson) => (
                        <View key={lesson.lesson_id}>{renderLectureItem(lesson)}</View>
                    ))
                ) : (
                    <Text>{Constants.noLessonsAvailable}</Text> // Fallback if no lectures
                )}
                <View style={styles.spaceBelow}></View>
            </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    courseImage: {
        width: "100%",
        height: 200,
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
    lessonItemContainer: {
        marginVertical: 10,
    },
    lessonTitle: {
        fontFamily: "Inter-Regular",
        color: Colors.defaultBlue,
        fontSize: 18,
        marginBottom: 10,
        marginHorizontal: 15,
    },
    lessonContainer: {
        backgroundColor: "#356FC520",
        paddingLeft: 25,
        paddingRight: 15,
        paddingVertical: 8,
    },
    topicContainer: {
        paddingBottom: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    lessonContainerDescription: {
        flex: 1,
    },
    lessonContainerTick: {
        height: 26,
        width: 26,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: Colors.defaultBlue,
        marginHorizontal: 5,
    },
    lessonContainerTickDone: {
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
    lessonDescription: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        color: "#6C6C6C",
        marginBottom: 8,
    },
    lessonBar: {
        borderTopWidth: 1,
        borderColor: Colors.defaultBlue,
    },
    tickImage: {
        height: 13,
        width: 13,
        marginBottom: 3,
    },
    spaceBelow: {
        height: 10,
    },
});

export default CourseContent;
