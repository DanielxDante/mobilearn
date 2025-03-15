import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useSegments } from "expo-router";
import * as DocumentPicker from "expo-document-picker";

import VideoPlayer from "@/components/VideoPlayer";
import Lesson from "@/types/shared/Course/Lesson";
import { Colors } from "@/constants/colors";
import useAppStore from "@/store/appStore";
import LessonTextContent from "@/components/dom-components/LessonTextContent";
import icons from "@/constants/icons";
import { lessonContentPage } from "@/constants/textConstants";
import useAuthStore from "@/store/authStore";
import { lessonContentConstants as Constants } from "@/constants/textConstants";
import { useTranslation } from "react-i18next";

const LessonContent = () => {
  const { t } = useTranslation();
  const completeLesson = useAppStore((state) => state.completeLesson);
  const submitHomework = useAppStore((state) => state.submitHomework);
  const selectedCourse = useAppStore((state) => state.selectedCourse);
  const membership = useAuthStore((state) => state.membership);
  const membership_types = ["normal", "member", "core_member"];
  const { lessonId } = useLocalSearchParams();
  const [lesson, setLesson] = useState<Lesson>();

  useEffect(() => {
    if (selectedCourse && lessonId) {
      const allLessons = selectedCourse?.chapters
        .map((chapter) => chapter.lessons)
        .flat();
      const lesson = allLessons.find(
        (lesson) => lesson.lesson_id.toString() === lessonId
      );
      if (lesson) {
        setLesson(lesson);
      } else {
        Alert.alert(
          t("lessonContentPage.error"),
          t("lessonContentPage.lessonNotFound"),
          [
            {
              text: t("lessonContentPage.ok"),
              onPress: () => router.back(),
            },
          ],
          { cancelable: false }
        );
      }
    }
  }, [lessonId, selectedCourse]);

  const [homework, setHomework] = useState<any>();
  const [homeworkName, setHomeworkName] = useState<any>();

  const handleDownload = async () => {
    if (lesson?.homework_url) {
      const supported = await Linking.canOpenURL(lesson.homework_url);
      if (supported) {
        Linking.openURL(lesson.homework_url);
      } else {
        console.error("Unable to open the URL");
      }
    } else {
      console.error("Homework URL is undefined");
    }
  };

  const handleUpload = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // Restrict to PDFs
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri; // Access uri from assets array
        const file_name = result.assets[0].name; // Access file name from assets array

        // Check if uri is valid before using it
        if (!uri) {
          console.error(t("lessonContentConstants.noUriReturnedError"));
          return;
        }

        // Extract filename only if uri is valid
        const filename = uri.split("/").pop();
        const type = "application/pdf";
        const formData = new FormData();
        formData.append("homework_submission_file", {
          uri: uri,
          name: filename ?? "homework_submission.pdf",
          type: type,
        } as any);
        if (lesson)
          formData.append("homework_lesson_id", lesson.lesson_id.valueOf());

        setHomework(formData);
        setHomeworkName(filename);
        alert(t("lessonContentConstants.pdfUploadedAlert"));
      } else {
        console.error(t("lessonContentConstants.noFileSelectedError"));
      }
    } catch (error) {
      console.error(t("lessonContentConstants.handleUploadPdfError"), error);
    }
  };

  return (
    lesson && (
      <SafeAreaView style={styles.container}>
        <View style={styles.appBarContainer}>
          <TouchableOpacity
            onPress={() => {
              router.replace({
                pathname: "/shared/course/courseContent",
                params: {
                  courseId: selectedCourse?.course_id,
                },
              });
            }} // Return to courseContent}
          >
            <Image source={icons.backButton} style={styles.iconStyle} />
          </TouchableOpacity>
          <Text style={styles.pageHeader}>{lesson.lesson_name}</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.content}>
            {/* Render video */}
            {lesson.lesson_type === "video" && lesson.video_url && (
              <View style={styles.videoContainer}>
                <VideoPlayer uri={lesson.video_url} />
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
                <Text style={styles.fileName}>
                  {t("lessonContentPage.homework")}
                </Text>
                <TouchableOpacity onPress={handleDownload}>
                  <Text style={styles.downloadText}>
                    {t("lessonContentPage.download")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.uploadWrapper}
                  onPress={() => {
                    handleUpload();
                  }}
                >
                  <View>
                    <Image source={icons.upload} style={styles.uploadIcon} />
                  </View>
                </TouchableOpacity>
                <Text style={styles.fileName}>
                  {homeworkName ?? t("lessonContentPage.upload")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  iconStyle: {
    width: 25,
    height: 25,
    marginLeft: 25,
    marginRight: 20,
  },
  appBarContainer: {
    flexDirection: "row",
    marginVertical: 15,
    alignItems: "center",
  },
  pageHeader: {
    fontSize: 20,
    color: Colors.defaultBlue,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: Colors.defaultBlue,
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
    // marginBottom: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  videoContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#808080",
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
    marginHorizontal: 75,
  },
  downloadText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.defaultBlue,
    fontFamily: "Inter-Bold",
  },
  completeButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  completeText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Inter-Regular",
  },
  uploadWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    // backgroundColor: Colors.Gray,
    borderColor: Colors.defaultBlue,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 70,
  },
  uploadIcon: {
    width: 45,
    height: 45,
    // backgroundColor: Colors.darkGray,
    borderRadius: 4,
    marginLeft: 6,
  },
});

export default LessonContent;
