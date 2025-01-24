import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import { router } from "expo-router";
import VideoPlayer from "@/components/VideoPlayer";
import { useLocalSearchParams } from "expo-router";
import { Video } from "expo-av";
import Course from "@/types/shared/Course/Course";
import { Colors } from "@/constants/colors";
import { courseContentConstants as Constants } from "@/constants/textConstants";
import Chapter from "@/types/shared/Course/Chapter";
import Lesson from "@/types/shared/Course/Lesson";
import useAppStore from "@/store/appStore";
import icons from "@/constants/icons";

const CourseContent = () => {
  const course = useAppStore((state) => state.selectedCourse);

  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    course?.chapters[0]?.chapter_id ?? ""
  );
  const selectedChapter = course?.chapters.find(
    (chapter) => chapter.chapter_id === selectedChapterId
  );

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    console.log("Chapter: " + chapterId);
  };

  const handleLessonSelect = async (lessonId: string) => {
    // console.log("Lesson id: " + lessonId);

    router.push({
      pathname: "./lessonContentInstructor/[lessonId]",
      params: {
        lessonId: lessonId,
    },
    });
  };

  const renderLectureItem = (lesson: Lesson, order: number) => (
    <View style={styles.lessonItemContainer}>
      {/* Lesson title */}
      <Text style={styles.lessonTitle} numberOfLines={1}>
        {lesson.lesson_name}
      </Text>
    </View>
  );

  return (
    course && (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBarContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 16, alignSelf: "flex-start" }}
          >
            <Image
              source={icons.backButton}
              style={{
                width: 24,
                height: 24,
                marginRight: 12,
                tintColor: Colors.darkGray,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editCourseButton}
            onPress={() => {
              console.log("Course to edit: ", course);
              router.push({
                pathname: "./createCoursePage",
                params: { courseToEdit: JSON.stringify(course) },
              });
            }}
          >
            <Text style={styles.editCourseButtonText}>Edit Course</Text>
          </TouchableOpacity>
        </View>
        {/* if video is not available, show a placeholder image */}

        <Image
          source={{ uri: course?.image }}
          style={styles.courseImage}
          resizeMode="cover"
        />

        <ScrollView>
          {/* Course title and subtitle */}
          <Text style={styles.title}>{course.course_name}</Text>
          <Text style={styles.school}>{course.community_name}</Text>
          <Text style={styles.courseContentsTitle}>
            {Constants.courseContents}
          </Text>
          {/* Chapter buttons */}
          <View style={styles.chapterButtonContainer}>
            {course.chapters.length <= 3 ? (
              // Render up to 4 chapter buttons if there are 3 or fewer chapters
              course.chapters.map((chapter) => (
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
                    {Constants.chapter} {chapter.order}
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
                  items={course.chapters.map((chapter) => ({
                    label: `${chapter.order}. ${chapter.chapter_title}`,
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

          <Text style={styles.chapterContentsTitle}>
            {selectedChapter?.chapter_title}
          </Text>
          {selectedChapter && selectedChapter.lessons.length > 0 ? (
            selectedChapter.lessons.map((lesson: Lesson, order: number) => (
              <TouchableOpacity
                key={lesson.lesson_id}
                onPress={() => handleLessonSelect(lesson.lesson_id)}
              >
                <View>{renderLectureItem(lesson, order + 1)}</View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No lessons available</Text> // Fallback if no lectures
          )}
          <View style={styles.spaceBelow}></View>
        </ScrollView>
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  appBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.defaultBlue,
  },
  videoContainer: {
    // marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: 200,
  },
  courseImage: {
    width: "100%",
    height: 200,
    // marginTop: 5,
  },
  editCourseButton: {
    padding: 5,
    backgroundColor: Colors.tabsIconGray,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  editCourseButtonText: {
    fontSize: 10,
    fontWeight: "bold",
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
    marginVertical: 10,
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
    marginTop: 20,
    alignSelf: "center",
  },
  chapterContentsTitle: {
    fontFamily: "Inter-SemiBold",
    color: Colors.defaultBlue,
    fontSize: 18,
    marginTop: 10,
    marginHorizontal: 15,
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
    paddingBottom: 0,
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
