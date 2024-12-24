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

const CourseContent = () => {
  const { courseSelected } = useLocalSearchParams();
  const course: Course =
    typeof courseSelected === "string" ? JSON.parse(courseSelected) : [];
  const [videoUrl, setVideoUrl] = useState(
    course.chapters[0].lessons[0].contentUrl
  );

  const [selectedChapterId, setSelectedChapterId] = useState<number>(
    course.chapters[0]?.id
  );
  const selectedChapter = course.chapters.find(
    (chapter) => chapter.id === selectedChapterId
  );

  const handleChapterSelect = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    console.log("Chapter: " + chapterId);
  };

  const handleLessonSelect = (lessonId: number) => {
    console.log("Lesson id: " + lessonId);
    const lessonSelected = course.chapters
      .map((chapter) => chapter.lessons)
      .flat()
      .find((lesson) => lesson.id === lessonId);
    router.push({
      pathname: "./lessonContent",
      params: {
        lessonSelected: JSON.stringify(lessonSelected),
      },
    });
  };

  const renderLectureItem = (lesson: Lesson) => (
    <View style={styles.lessonItemContainer}>
      {/* Lessone title */}
      <Text style={styles.lessonTitle} numberOfLines={1}>
        {Constants.lesson} {lesson.id}: {lesson.title}
      </Text>
      <View style={styles.lessonContainer}>
        <TouchableOpacity
          style={styles.topicContainer}
          onPress={() => handleLessonSelect(lesson.id)}
        >
          <View style={styles.lessonContainerDescription}>
            <Text style={styles.lessonDescription} numberOfLines={3}>
              {lesson.description}
            </Text>
            <View style={styles.lessonBar}></View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // console.log(course.chapters.find(chapter => chapter.id==selectedChapterId))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../../assets/images/icons/arrow-left-line.png")}
            //style={styles.backButton}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editCourseButton}
          onPress={() =>
            router.push({
              pathname: "./createCoursePage",
              params: { courseToEdit: JSON.stringify(course) },
            })
          }
        >
          <Text style={styles.editCourseButtonText}>Edit Course</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        {/* Video component */}
        <VideoPlayer uri={videoUrl} />
      </View>
      <ScrollView>
        {/* Course title and subtitle */}
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.school}>{course.school}</Text>
        {/* Chapter buttons */}
        <View style={styles.chapterButtonContainer}>
          {course.chapters.length <= 3 ? (
            // Render up to 4 chapter buttons if there are 3 or fewer chapters
            course.chapters.map((chapter) => (
              <TouchableOpacity
                key={chapter.id}
                style={[
                  styles.chapterButton,
                  {
                    backgroundColor:
                      selectedChapterId === chapter.id
                        ? Colors.defaultBlue
                        : "#E0E0E0",
                  },
                ]}
                onPress={() => handleChapterSelect(chapter.id)}
              >
                <Text
                  style={[
                    styles.chapterButtonText,
                    {
                      color: selectedChapterId === chapter.id ? "#FFF" : "#000",
                    },
                  ]}
                >
                  {Constants.chapter} {chapter.id}
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
                  label: `Chapter ${chapter.id}`,
                  value: chapter.id,
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
            <View key={lesson.id}>{renderLectureItem(lesson)}</View>
          ))
        ) : (
          <Text>No lessons available</Text> // Fallback if no lectures
        )}
        <View style={styles.spaceBelow}></View>
      </ScrollView>
    </SafeAreaView>
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
  videoContainer: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: 200,
  },
  editCourseButton: {
    padding: 5,
    backgroundColor: Colors.tabsIconGray,
    borderRadius: 5,
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
