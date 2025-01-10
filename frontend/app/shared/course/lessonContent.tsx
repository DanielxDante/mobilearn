import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import VideoPlayer from "@/components/VideoPlayer";
import Lesson from "@/types/shared/Course/Lesson";
import { Colors } from "@/constants/colors";
import useAppStore from "@/store/appStore";
import LessonTextContent from "@/components/dom-components/LessonTextContent";
import icons from "@/constants/icons";
import { lessonContentPage } from "@/constants/textConstants";

const LessonContent = () => {
  const getLesson = useAppStore((state) => state.getInstructorPreviewedLesson);
  const { lessonSelected } = useLocalSearchParams();
  // const lesson: Lesson =
  //   typeof lessonParam === "string" ? JSON.parse(lessonParam) : lessonParam;
  const lesson: Lesson =
    typeof lessonSelected == "string" ? JSON.parse(lessonSelected) : [];
  console.log(lesson.content);

  // for testing
  const test_lesson = {
    lesson_id: 1,
    lesson_name: "Test Lesson",
    lesson_type: "homework",
    video_key: "https://d20shsb24t3qaz.cloudfront.net/lesson_1277.mp4",
    homework_key: "https://d20shsb24t3qaz.cloudfront.net/lesson_1262.pdf",
    content: {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "Test this test hoooooola bu la lu. this is a long message.",
                type: "text",
                version: 1,
              },
              {
                detail: 0,
                format: 1,
                mode: "normal",
                style: "",
                text: "thet",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
            textFormat: 0,
            textStyle: "",
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    },
  };

  const handleDownload = async () => {
    const supported = await Linking.canOpenURL(lesson.homework_key);
    if (supported) {
      Linking.openURL(lesson.homework_key);
    } else {
      console.error("Unable to open the URL");
    }
  };

  return (
    lesson && (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBarContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconOpacity}
          >
            <Image source={icons.backButton} style={styles.iconStyle} />
          </TouchableOpacity>
          <Text style={styles.pageHeader}>{lessonContentPage.pageHeader}</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{lesson.lesson_name}</Text>

          {/* Render video */}
          {lesson.lesson_type === "video" && lesson.video_key && (
            <View style={styles.videoContainer}>
              <VideoPlayer uri={lesson.video_key} />
            </View>
          )}

          {/* Render text-based lesson content */}
          {lesson.lesson_type === "text" && (
            <View style={styles.container}>
              {lesson.content && (
                <LessonTextContent initialState={lesson.content} />
              )}
            </View>
          )}

          {/* Render downloadable homework */}
          {lesson.lesson_type === "homework" && (
            <View style={styles.homeworkContainer}>
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={handleDownload}
              >
                {/* Placeholder for the download icon */}
                <View>
                  <Image
                    source={icons.download}
                    style={styles.iconPlaceholder}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.fileName}>{lessonContentPage.homework}</Text>
              <TouchableOpacity onPress={handleDownload}>
                <Text style={styles.downloadText}>
                  {lessonContentPage.download}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  iconOpacity: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  iconStyle: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: Colors.darkGray,
  },
  appBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.defaultBlue,
  },
  pageHeader: {
    fontSize: 20,
    color: Colors.darkGray,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: Colors.defaultBlue,
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
    // marginBottom: 12,
    paddingHorizontal: 16,
  },
  videoContainer: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.lightGray,
    elevation: 4, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContentContainer: {
    paddingVertical: 16,
  },
  homeworkContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    // backgroundColor: Colors.tabsIconGray,
    alignItems: "center",
  },
  homeworkTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  downloadButton: {
    backgroundColor: Colors.defaultBlue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    // backgroundColor: Colors.Gray,
    borderColor: Colors.defaultBlue,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    // backgroundColor: Colors.darkGray,
    borderRadius: 4,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.darkGray,
    marginVertical: 4,
    fontFamily: "Inter-Regular",
  },
  downloadText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.defaultBlue,
    fontFamily: "Inter-Bold",
  },
});

export default LessonContent;
