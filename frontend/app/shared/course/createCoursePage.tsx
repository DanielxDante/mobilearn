//to implement tagging of file name to files, so no file upload spam. filenames will be removed before sending

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import RegisterButton from "@/components/Button";
import InputField from "@/components/InputField";
import InputDropDownField from "@/components/InputDropDownField";
import useAuthStore from "@/store/authStore"; // Import the store
import { instructorCreateCoursePageConstants as textConstants } from "@/constants/textConstants";
import icons from "@/constants/icons";
import { Colors } from "@/constants/colors";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import Chapter from "@/types/shared/Course/Chapter";
import Lesson from "@/types/shared/Course/Lesson";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Editor from "@/components/dom-components/RichTextEditor";
import useAppStore from "@/store/appStore";
import { INSTRUCTOR_HOME } from "@/constants/pages";
import { update } from "lodash";
import { useTranslation } from "react-i18next";

export default function createCoursePage() {
  const { t } = useTranslation();
  const token = useAuthStore((state) => state.access_token);
  const createCourse = useAppStore(
    (state) => state.createCourse
  ) as unknown as (formData: FormData) => Promise<{ message: string }>;
  const editCourse = useAppStore((state) => state.editCourse) as unknown as (
    formData: FormData
  ) => Promise<{ message: string }>;
  const { courseToEdit } = useLocalSearchParams();
  const course = useMemo(
    () => (typeof courseToEdit === "string" ? JSON.parse(courseToEdit) : null),
    [courseToEdit]
  );
  const [internalPage, setInternalPage] = useState(1);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(
    null
  );
  const [plainText, setPlainText] = useState(""); // Plain text content
  const [editorState, setEditorState] = useState<string | null>(null); // Full editor state
  const [validated, setValidated] = useState(false);
  const [inputs, setInputs] = useState({
    courseID: course?.course_id || "",
    courseTitle: course?.course_name || "",
    courseInfo: course?.description || "",
    courseType:
      course?.course_type.charAt(0).toUpperCase() +
        course?.course_type.slice(1) || textConstants.courseType_options[0],
    duration: course?.duration || "",
    field: course?.field || "",
    coursePicture: course?.image || "",
    price: course?.price || "",
    difficulty:
      course?.difficulty.charAt(0).toUpperCase() +
        course?.difficulty.slice(1) ||
      textConstants.courseDifficulty_options[0],
    skills: course?.skills || [],
    school: course?.school_name || "",
    programType: course?.program_type || "",
    major: course?.major || "",
    department: course?.department || "",
    subject: course?.subject || "",
    platform: course?.platform || "",
    chapters: course?.chapters?.map((chapter: any) => ({
      ...chapter,
      lessons: chapter.lessons?.map((lesson: any) => ({
        ...lesson,
        lesson_type:
          lesson.lesson_type.charAt(0).toUpperCase() +
          lesson.lesson_type.slice(1),
      })),
    })) || [
      {
        chapter_id: `${Date.now()}-${Math.random()}`, // unique id
        chapter_title:
          t("instructorCreateCoursePageConstants.chapter_placeholder") + " 1",
        order: 1,
        lessons: [
          {
            lesson_id: `${Date.now()}-${Math.random()}`,
            lesson_name:
              t("instructorCreateCoursePageConstants.lesson_placeholder") +
              " 1",
            order: 1,
            lesson_type: t(
              "instructorCreateCoursePageConstants.lessonTypePlaceholder"
            ),
          },
        ],
      },
    ],
    files: {}, // Files as an object to store key-value pairs
  });
  const [validationErrors, setValidationErrors] = useState({
    courseTitle: false,
    courseInfo: false,
    courseType: false,
    duration: false,
    field: false,
    coursePicture: false,
    price: false,
    difficulty: false,
    skills: false,
    school: false,
    programType: false,
    major: false,
    department: false,
    subject: false,
    platform: false,
    chapters: false,
  });

  function validateChapters(chapters: any, alertFlag: number) {
    //loop through all lessons, make sure every lesson, has content, video_key, and homework_key
    if (chapters.length === 0) {
      alert(t("instructorCreateCoursePageConstants.emptyChapterAlert"));
      return true;
    }
    for (let i = 0; i < chapters.length; i++) {
      for (let j = 0; j < chapters[i].lessons.length; j++) {
        if (
          !chapters[i].lessons[j].content &&
          !chapters[i].lessons[j].video_key &&
          !chapters[i].lessons[j].homework_key &&
          !chapters[i].lessons[j].video_url &&
          !chapters[i].lessons[j].homework_url
        ) {
          if (alertFlag == 0) {
            alert(t("instructorCreateCoursePageConstants.emptyLessonAlert"));
          } else {
          }
          return true;
        }
      }
    }
    return false;
  }

  //function to check if all fields are filled
  const validate = (alertFlag: number) => {
    const errors = {
      courseTitle: !inputs.courseTitle,
      courseInfo: !inputs.courseInfo,
      courseType: !inputs.courseType,
      duration: !inputs.duration,
      field: !inputs.field,
      coursePicture: !inputs.coursePicture,
      price: !inputs.price,
      difficulty: !inputs.difficulty,
      skills: !inputs.skills,
      school: !inputs.school,
      programType: !inputs.programType,
      major: !inputs.major,
      department: !inputs.department,
      subject: !inputs.subject,
      platform: !inputs.platform,
      chapters: validateChapters(inputs.chapters, alertFlag),
    };
    if (inputs.courseType === textConstants.courseType_options[0]) {
      errors.department = false;
      errors.subject = false;
      errors.platform = false;
    }
    if (inputs.courseType === textConstants.courseType_options[1]) {
      errors.school = false;
      errors.programType = false;
      errors.field = false;
      errors.major = false;
      errors.subject = false;
      errors.platform = false;
    }
    if (inputs.courseType === textConstants.courseType_options[2]) {
      errors.school = false;
      errors.programType = false;
      errors.field = false;
      errors.major = false;
      errors.department = false;
      errors.platform = false;
    }
    if (inputs.courseType === textConstants.courseType_options[3]) {
      errors.school = false;
      errors.programType = false;
      errors.field = false;
      errors.major = false;
      errors.department = false;
      errors.subject = false;
    }
    setValidationErrors(errors);
    setValidated(!Object.values(errors).some((error) => error));
    return !Object.values(errors).some((error) => error);
  };

  function filterFilesByChapters(chapters: any, files: any) {
    const filteredFiles: { [key: string]: any } = {};
    const lessonIdarray: string[] = [];
    // Loop through all chapters and lessons to extract lesson IDs that have files
    for (let i = 0; i < chapters.length; i++) {
      for (let j = 0; j < chapters[i].lessons.length; j++) {
        if (
          chapters[i].lessons[j].video_key ||
          chapters[i].lessons[j].homework_key
        ) {
          lessonIdarray.push(chapters[i].lessons[j].lesson_id.toString());
        }
      }
    }
    // Filter files by lesson IDs
    Object.entries(files).forEach(([key, fileData]) => {
      if (lessonIdarray.includes(key)) {
        filteredFiles[key] = fileData;
      }
    });
    //assign filteredFiles;
    setInputs((prev) => ({ ...prev, files: filteredFiles }));
  }

  // Handler for input changes
  const handleChange = (e: any, fieldName: string) => {
    setInputs((prev) => {
      let updatedInputs = { ...prev, [fieldName]: e }; // Update the current field

      if (fieldName === "courseType") {
        if (e === textConstants.courseType_options[0]) {
          updatedInputs = {
            ...updatedInputs,
            // Reset only the relevant fields
            department: "",
            subject: "",
            platform: "",
          };
        } else if (e === textConstants.courseType_options[1]) {
          updatedInputs = {
            ...updatedInputs,
            school: "",
            programType: "",
            field: "",
            major: "",
            subject: "",
            platform: "",
          };
        } else if (e === textConstants.courseType_options[2]) {
          updatedInputs = {
            ...updatedInputs,
            school: "",
            programType: "",
            field: "",
            major: "",
            department: "",
            platform: "",
          };
        } else if (e === textConstants.courseType_options[3]) {
          updatedInputs = {
            ...updatedInputs,
            school: "",
            programType: "",
            field: "",
            major: "",
            department: "",
            subject: "",
          };
        }
      }

      return updatedInputs;
    });
  };

  const selectedChapter = selectedChapterId
    ? inputs.chapters.find(
        (chapter: Chapter) =>
          chapter.chapter_id.toString() === selectedChapterId.toString()
      )
    : null;

  const selectedLesson = selectedChapter
    ? selectedLessonId &&
      selectedChapter.lessons.find(
        (lesson: Lesson) =>
          lesson.lesson_id.toString() === selectedLessonId.toString()
      )
    : null;

  const addChapter = () => {
    setInputs((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          chapter_id: `${Date.now()}-${Math.random()}`, // unique id
          chapter_title: `${t(
            "instructorCreateCoursePageConstants.chapter_placeholder"
          )} ${prev.chapters.length + 1}`,
          order: prev.chapters.length + 1,
          lessons: [
            {
              lesson_id: `${Date.now()}-${Math.random()}`,
              lesson_name:
                t("instructorCreateCoursePageConstants.lesson_placeholder") +
                " 1",
              order: 1,
              lesson_type: t(
                "instructorCreateCoursePageConstants.lessonTypePlaceholder"
              ),
            },
          ],
        },
      ],
    }));
  };

  const sortChapters = (chapters: Chapter[]): Chapter[] => {
    return chapters
      .sort((a, b) => a.order - b.order) // Sort by 'order'
      .map((chapter, index) => ({
        ...chapter,
        order: index + 1, // Reassign order sequentially
      }));
  };

  const updateChapterNames = (chapters: Chapter[]): Chapter[] => {
    return chapters.map((chapter, index) => {
      // If the chapter name is in the format 'Chapter {number}', update it
      if (
        chapter.chapter_title &&
        chapter.chapter_title.startsWith(
          t("instructorCreateCoursePageConstants.chapter_placeholder")
        )
      ) {
        return {
          ...chapter,
          chapter_title: `${t(
            "instructorCreateCoursePageConstants.chapter_placeholder"
          )} ${index + 1}`, // Update the chapter name to the new order
        };
      }
      return chapter;
    });
  };

  const removeChapter = (id: string) => {
    if (!id.toString().includes("-")) {
      // sensing ID from backend
      // cannot remove
      alert(t("instructorCreateCoursePageConstants.chapterRemovalDenial"));
      return;
    }

    setInputs((prev) => {
      // First, remove the chapter by its id
      const updatedChapters = prev.chapters.filter(
        (chapter: Chapter) => chapter.chapter_id !== id
      );
      // Then, sort the remaining chapters by 'order'
      const sortedChapters = sortChapters(updatedChapters);
      const updatedChaptersWithNames = updateChapterNames(sortedChapters);
      return {
        ...prev,
        chapters: updatedChaptersWithNames,
      };
    });
  };
  const handleChapterTap = (id: string) => {
    setSelectedChapterId(id);
    setInternalPage(4);
  };

  const handleNumberOfLessonsChange = (value: string) => {
    if (!selectedChapterId) return;
    const newLessonCount = parseInt(value, 10);
    setInputs((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter: Chapter) =>
        chapter.chapter_id === selectedChapterId
          ? {
              ...chapter,
              lessons: Array(newLessonCount)
                .fill(null)
                .map(
                  (_, index) =>
                    chapter.lessons[index] || {
                      lesson_name: `${t(
                        "instructorCreateCoursePageConstants.lesson_placeholder"
                      )} ${index + 1}`,
                      lesson_type: t(
                        "instructorCreateCoursePageConstants.lessonTypePlaceholder"
                      ),
                      order: index + 1,
                      lesson_id: `${Date.now()}-${Math.random()}`,
                    }
                ),
            }
          : chapter
      ),
    }));
  };

  const handleLessonTap = (id: string, index: any) => {
    setSelectedLessonId(id);
    setSelectedLessonIndex(index);
    setInternalPage(5);
  };

  const updateLesson = (
    lessonIndex: number,
    key:
      | "lesson_name"
      | "lesson_type"
      | "order"
      | ("content" | "video_key" | "homework_key"),
    value: string
  ) => {
    if (!selectedChapterId) return;
    //console.log("lessonIndex: ", lessonIndex);
    setInputs((prev) => {
      let updatedChapters = prev.chapters.map((chapter: Chapter) =>
        chapter.chapter_id === selectedChapterId
          ? {
              ...chapter,
              lessons: chapter.lessons.map((lesson, index) => {
                if (index === lessonIndex) {
                  if (
                    key === "lesson_type" &&
                    lesson.lesson_id.toString().includes("-")
                  ) {
                    delete lesson.content;
                    delete lesson.video_key;
                    delete lesson.homework_key;
                  }
                  // else if (key === "lesson_type") {
                  //   delete lesson.content;
                  //   delete lesson.video_url;
                  //   delete lesson.homework_url;
                  //   setEditorState(null);
                  // }
                  const updatedLesson = { ...lesson, [key]: value };
                  return updatedLesson;
                }
                return lesson;
              }),
            }
          : chapter
      );
      return { ...prev, chapters: updatedChapters };
    });
  };

  const addFile = (key: string, file: any) => {
    setInputs((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [key]: file, // Add or update the file with the given key
      },
    }));
  };

  const handleUploadPicture = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (result.canceled) {
        return;
      }
      if (result.assets[0]) {
        const uri = result.assets[0].uri;

        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image/jpeg";

        const formData = new FormData();
        formData.append("course_image", {
          uri,
          name: filename ?? "profile.jpg",
          type,
        } as any);
        setInputs((prev) => ({
          ...prev,
          coursePicture: { uri, name: filename, type },
        }));
        alert(
          t("instructorCreateCoursePageConstants.profilePictureUploadAlert")
        );
      } else {
        alert(t("instructorCreateCoursePageConstants.fileUndefinedAlert"));
      }
    } catch (error) {
      console.error(
        t("instructorCreateCoursePageConstants.handleEditProfilePictureError"),
        error
      );
    }
  };

  const handleUploadVideo = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"], // Restrict to videos
        allowsEditing: true,
        quality: 1,
      });
      if (result.canceled) {
        return;
      }
      if (result.assets[0]) {
        const uri = result.assets[0].uri;

        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `video/${match[1]}` : "video/mp4";
        const file_name = result.assets[0].fileName;

        if (selectedLessonIndex !== null && file_name && selectedLessonId) {
          updateLesson(selectedLessonIndex, "video_key", file_name);
          addFile(selectedLessonId, { uri, name: file_name, type });
        }
        alert(t("instructorCreateCoursePageConstants.videoUploadedAlert"));
      } else {
        alert(t("instructorCreateCoursePageConstants.fileUndefinedAlert"));
      }
    } catch (error) {
      console.error(
        t("instructorCreateCoursePageConstants.handleUploadVideoError"),
        error
      );
    }
  };

  const handleUploadPDF = async () => {
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
          console.error(
            t("instructorCreateCoursePageConstants.noUriReturnedError")
          );
          return;
        }

        // Extract filename only if uri is valid
        const filename = uri.split("/").pop();
        const type = "application/pdf";

        if (selectedLessonIndex !== null && file_name && selectedLessonId) {
          updateLesson(selectedLessonIndex, "homework_key", file_name);
          addFile(selectedLessonId, { uri, name: file_name, type });
        }

        alert(t("instructorCreateCoursePageConstants.pdfUploadedAlert"));
      } else {
        console.error(
          t("instructorCreateCoursePageConstants.noFileSelectedError")
        );
      }
    } catch (error) {
      console.error(
        t("instructorCreateCoursePageConstants.handleUploadPdfError"),
        error
      );
    }
  };

  const checkPermissions = async () => {
    // Method to check if user has permissions to select image from gallery
    try {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        // If permission is not granted, request it
        await requestPermission();
      } else {
      }
    } catch (error) {
      console.error(
        t("instructorCreateCoursePageConstants.checkingPermissionError"),
        error
      );
    }
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(t("instructorCreateCoursePageConstants.permissionDeniedAlert"));
    }
  };

  function removeIds() {
    // remove all chapter IDs and lesson IDs and return the modified chapters
    const modifiedChapters = inputs.chapters.map((chapter: any) => {
      const modifiedChapter = { ...chapter };
      // delete modifiedChapter.id;
      //console.log("chapter: ", modifiedChapter);
      if (modifiedChapter.chapter_id.toString().includes("-")) {
        // sensing ID from frontend
        // we  delete the ID
        delete modifiedChapter.chapter_id;
      } else {
        // we do not do anything because the ID is from the backend
      }
      modifiedChapter.lessons = modifiedChapter.lessons.map(
        (lesson: any, index: number) => {
          let modifiedLesson = {
            ...lesson,
            lesson_type: lesson.lesson_type.toLowerCase(),
          };
          // delete modifiedLesson.id;
          //console.log("lesson: ", modifiedLesson);
          if (modifiedLesson.lesson_id.toString().includes("-")) {
            // sensing ID from frontend
            // we  delete the ID
            delete modifiedLesson.lesson_id;
          } else {
            // we do not do ID as it is from the backend, but add Order
            modifiedLesson = {
              ...modifiedLesson,
              order: index + 1,
            };
          }
          return modifiedLesson;
        }
      );
      return modifiedChapter;
    });
    return modifiedChapters;
  }

  function registerCourse(): void {
    // Validate chapters and files
    filterFilesByChapters(inputs.chapters, inputs.files);
    // Validate inputs
    if (!validate(0)) {
      alert(t("instructorCreateCoursePageConstants.fillAllFieldsAlert"));
      return;
    }
    const formData = new FormData();

    // Append basic form data
    if (courseToEdit) {
      formData.append("course_id", inputs.courseID);
      //formData.append("community_id", inputs.communityID);
    }
    formData.append("name", inputs.courseTitle);
    formData.append("description", inputs.courseInfo);
    formData.append("course_type", inputs.courseType.toLowerCase());
    formData.append("duration", inputs.duration);

    // Append course image
    formData.append("course_image", inputs.coursePicture);

    // Append additional fields
    formData.append("price", inputs.price);
    formData.append("difficulty", inputs.difficulty.toLowerCase());
    formData.append("skills", inputs.skills.split(","));
    formData.append("school_name", inputs.school);
    formData.append("program_type", inputs.programType);
    formData.append("field", inputs.field);
    formData.append("major", inputs.major);
    formData.append("department", inputs.department);
    formData.append("subject", inputs.subject);
    formData.append("platform", inputs.platform);

    // Modify chapters and add content
    const modifiedChapters = removeIds();
    const content = {
      chapters: modifiedChapters,
    };
    console.log("content: ", content);
    formData.append("content", JSON.stringify(content));
    // Append files
    Object.entries(inputs.files).forEach(([key, file]) => {
      formData.append("files", file as Blob);
    });
    // Call API
    if (courseToEdit) {
      //console.log("updated course data: ", formData);
      updateCourse(formData);
    } else {
      console.log("course created: ", formData);
      postCourse(formData);
    }
  }

  async function postCourse(formData: FormData): Promise<void> {
    const response = await createCourse(formData);
    if (response.message.includes("success")) {
      alert(t("instructorCreateCoursePageConstants.courseCreatedAlert"));
      AsyncStorage.removeItem("courseData");
      router.push(INSTRUCTOR_HOME);
    } else {
      alert(t("instructorCreateCoursePageConstants.courseCreationFailedAlert"));
    }
  }

  // function sentenceCaseHelper(str: string): string {
  //   return str.charAt(0).toUpperCase() + str.slice(1);
  // }

  async function updateCourse(formData: FormData): Promise<void> {
    //console.log("Updating.......");
    const response = await editCourse(formData);
    if (response.message.includes("success")) {
      alert(t("instructorCreateCoursePageConstants.courseUpdatedAlert"));
      AsyncStorage.removeItem("courseData");
      router.push(INSTRUCTOR_HOME);
    }
  }

  const COURSE_DIFFICULTY_DICTIONARY = {
    初级: "Beginner",
    中级: "Intermediate",
    高级: "Advanced",
    Beginner: "Beginner",
    Intermediate: "Intermediate",
    Advanced: "Advanced",
  };

  const COURSE_TYPE_DICTIONARY = {
    学术: "Academic",
    职业: "Professional",
    专业: "Specialization",
    项目: "Project",
    Academic: "Academic",
    Professional: "Professional",
    Specialization: "Specialization",
    Project: "Project",
  };

  const NUMBER_OF_LESSONS_DICTIONARY = {
    "1 节课": "1",
    "2 节课": "2",
    "3 节课": "3",
    "4 节课": "4",
    "5 节课": "5",
    "1 Lesson": "1",
    "2 Lessons": "2",
    "3 Lessons": "3",
    "4 Lessons": "4",
    "5 Lessons": "5",
  };

  const LESSON_TYPE_DICTIONARY = {
    文本: "Text",
    视频: "Video",
    作业: "Homework",
    Text: "Text",
    Video: "Video",
    Homework: "Homework",
  };
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const savedData = await AsyncStorage.getItem("courseData");
  //       if (savedData) {
  //         setInputs(JSON.parse(savedData));
  //       }
  //     } catch (error) {
  //       console.error(textConstants.asyncFailLoadMessage, error);
  //     }
  //   };
  //   loadData();
  // }, []);

  useEffect(() => {
    const clearData = async () => {
      try {
        await AsyncStorage.multiRemove(["courseData"]);
      } catch (error) {
        console.error(
          t("instructorCreateCoursePageConstants.asyncFailClearMessage"),
          error
        );
      }
    };
    clearData();
  }, []);

  // Save data to AsyncStorage whenever inputs change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("courseData", JSON.stringify(inputs));
      } catch (error) {
        console.error(
          t("instructorCreateCoursePageConstants.asyncFailSaveMessage"),
          error
        );
      }
    };
    saveData();
    validate(1);
  }, [inputs, inputs.chapters]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.appBarContainer}>
          <TouchableOpacity
            onPress={
              internalPage === 1
                ? () => {
                    router.back();
                    //clear async storage
                    AsyncStorage.removeItem("courseData");
                  }
                : () => {
                    if (internalPage === 4) {
                      validateChapters(inputs.chapters, 0);
                      filterFilesByChapters(inputs.chapters, inputs.files);
                    }
                    setInternalPage(internalPage - 1);
                  }
            }
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
          <Text style={styles.homePageHeader}>
            {internalPage === 5
              ? t("instructorCreateCoursePageConstants.editLessonTitle")
              : internalPage === 4
              ? t("instructorCreateCoursePageConstants.chapterPageTitle")
              : course
              ? t("instructorCreateCoursePageConstants.editCoursePageTitle")
              : t("instructorCreateCoursePageConstants.createCoursePageTitle")}
          </Text>
        </View>

        {internalPage === 1 && (
          <>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.inputContainer}>
                <InputField // Course Title
                  inputTitle={t(
                    "instructorCreateCoursePageConstants.courseName"
                  )}
                  placeholder={
                    t("instructorCreateCoursePageConstants.placeholder") ?? ""
                  }
                  value={inputs.courseTitle}
                  onChange={(e) => e.persist()}
                  onChangeText={(text) => {
                    handleChange(text, "courseTitle");
                  }}
                />
                <InputField // Course Description
                  inputTitle={t(
                    "instructorCreateCoursePageConstants.courseDescription"
                  )}
                  placeholder={
                    t("instructorCreateCoursePageConstants.placeholder") ?? ""
                  }
                  value={inputs.courseInfo}
                  onChange={(e) => e.persist()}
                  onChangeText={(text) => {
                    handleChange(text, "courseInfo");
                  }}
                  multiline={true}
                  maxLength={500}
                />
                <InputField // Duration
                  inputTitle={t(
                    "instructorCreateCoursePageConstants.courseDuration"
                  )}
                  placeholder={
                    t(
                      "instructorCreateCoursePageConstants.duration_placeholder"
                    ) ?? ""
                  }
                  value={inputs.duration}
                  onChange={(e) => e.persist()}
                  onChangeText={(text) => {
                    handleChange(text, "duration");
                  }}
                />
                <TouchableOpacity //Course image
                  onPress={() => {
                    handleUploadPicture();
                    checkPermissions();
                  }}
                >
                  <InputField
                    inputTitle={t(
                      "instructorCreateCoursePageConstants.coursePicture"
                    )}
                    placeholder={t(
                      "instructorCreateCoursePageConstants.coursePicturePlaceholder"
                    )}
                    value={
                      inputs.coursePicture
                        ? t(
                            "instructorCreateCoursePageConstants.coursePictureUploadedPlaceholder"
                          )
                        : ""
                    }
                    editable={false} // Prevent manual text editing
                  />
                </TouchableOpacity>
                <InputField // Price
                  inputTitle={t(
                    "instructorCreateCoursePageConstants.coursePrice"
                  )}
                  placeholder={
                    t(
                      "instructorCreateCoursePageConstants.coursePricePlaceholder"
                    ) ?? ""
                  }
                  value={inputs.price}
                  onChange={(e) => e.persist()}
                  onChangeText={(text) => {
                    handleChange(text, "price");
                  }}
                />
                <InputDropDownField
                  inputTitle={t(
                    "instructorCreateCoursePageConstants.courseDifficulty"
                  )}
                  options={[
                    t(
                      "instructorCreateCoursePageConstants.courseDifficulty_options.beginner"
                    ),
                    t(
                      "instructorCreateCoursePageConstants.courseDifficulty_options.intermediate"
                    ),
                    t(
                      "instructorCreateCoursePageConstants.courseDifficulty_options.advanced"
                    ),
                  ]}
                  value={t(
                    `instructorCreateCoursePageConstants.courseDifficulty_options.${inputs.difficulty?.toLowerCase()}`
                  )}
                  onChange={(selectedLabel) => {
                    // Map the selected translated label back to the original English value
                    const selectedValue =
                      COURSE_DIFFICULTY_DICTIONARY[
                        selectedLabel as keyof typeof COURSE_DIFFICULTY_DICTIONARY
                      ];
                    handleChange(selectedValue, "difficulty");
                  }}
                />
                <InputField // Skills
                  inputTitle={t(
                    "instructorCreateCoursePageConstants.courseSkills"
                  )}
                  placeholder={
                    t(
                      "instructorCreateCoursePageConstants.courseSkillsPlaceholder"
                    ) ?? ""
                  }
                  value={inputs.skills}
                  onChange={(e) => e.persist()}
                  onChangeText={(text) => {
                    handleChange(text, "skills");
                  }}
                />
                <RegisterButton
                  text={t("instructorCreateCoursePageConstants.nextButtonText")}
                  onPress={() => setInternalPage(2)}
                />
              </View>
            </ScrollView>
          </>
        )}
        {internalPage === 2 && (
          <>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.inputContainer}>
                <InputDropDownField // course type
                  inputTitle={t(
                    "instructorCreateCoursePageConstants.courseType"
                  )}
                  options={[
                    t(
                      "instructorCreateCoursePageConstants.courseType_options.academic"
                    ),
                    t(
                      "instructorCreateCoursePageConstants.courseType_options.professional"
                    ),
                    t(
                      "instructorCreateCoursePageConstants.courseType_options.specialization"
                    ),
                    t(
                      "instructorCreateCoursePageConstants.courseType_options.project"
                    ),
                  ]}
                  //value={inputs.courseType}
                  value={t(
                    `instructorCreateCoursePageConstants.courseType_options.${inputs.courseType?.toLowerCase()}`
                  )}
                  onChange={(selectedLabel) => {
                    // Map the selected translated label back to the original English value
                    const selectedValue =
                      COURSE_TYPE_DICTIONARY[
                        selectedLabel as keyof typeof COURSE_TYPE_DICTIONARY
                      ];
                    handleChange(selectedValue, "courseType");
                  }}
                />
                {inputs.courseType == textConstants.courseType_options[0] && (
                  <>
                    <InputField // School name
                      inputTitle={t(
                        "instructorCreateCoursePageConstants.courseSchoolName"
                      )}
                      placeholder={
                        t(
                          "instructorCreateCoursePageConstants.courseSchoolNamePlaceholder"
                        ) ?? ""
                      }
                      value={inputs.school}
                      onChange={(e) => e.persist()}
                      onChangeText={(text) => {
                        handleChange(text, "school");
                      }}
                    />
                    <InputField // program type
                      inputTitle={t(
                        "instructorCreateCoursePageConstants.programType"
                      )}
                      placeholder={
                        t("instructorCreateCoursePageConstants.placeholder") ??
                        ""
                      }
                      value={inputs.programType}
                      onChange={(e) => e.persist()}
                      onChangeText={(text) => {
                        handleChange(text, "programType");
                      }}
                    />
                    <InputField // Field
                      inputTitle={t(
                        "instructorCreateCoursePageConstants.field"
                      )}
                      placeholder={
                        t(
                          "instructorCreateCoursePageConstants.field_placeholder"
                        ) ?? ""
                      }
                      value={inputs.field}
                      onChange={(e) => e.persist()}
                      onChangeText={(text) => {
                        handleChange(text, "field");
                      }}
                    />
                    <InputField // Major
                      inputTitle={t(
                        "instructorCreateCoursePageConstants.major"
                      )}
                      placeholder={
                        t(
                          "instructorCreateCoursePageConstants.majorPlaceholder"
                        ) ?? ""
                      }
                      value={inputs.major}
                      onChange={(e) => e.persist()}
                      onChangeText={(text) => {
                        handleChange(text, "major");
                      }}
                    />
                  </>
                )}
                {inputs.courseType == textConstants.courseType_options[1] && (
                  <InputField // Department
                    inputTitle={t(
                      "instructorCreateCoursePageConstants.department"
                    )}
                    placeholder={
                      t(
                        "instructorCreateCoursePageConstants.departmentPlaceholder"
                      ) ?? ""
                    }
                    value={inputs.department}
                    onChange={(e) => e.persist()}
                    onChangeText={(text) => {
                      handleChange(text, "department");
                    }}
                  />
                )}
                {inputs.courseType == textConstants.courseType_options[2] && (
                  <InputField // Subject
                    inputTitle={t(
                      "instructorCreateCoursePageConstants.subject"
                    )}
                    placeholder={
                      t(
                        "instructorCreateCoursePageConstants.subjectPlaceholder"
                      ) ?? ""
                    }
                    value={inputs.subject}
                    onChange={(e) => e.persist()}
                    onChangeText={(text) => {
                      handleChange(text, "subject");
                    }}
                  />
                )}
                {inputs.courseType == textConstants.courseType_options[3] && (
                  <InputField // Platform
                    inputTitle={t(
                      "instructorCreateCoursePageConstants.platform"
                    )}
                    placeholder={
                      t("instructorCreateCoursePageConstants.placeholder") ?? ""
                    }
                    value={inputs.platform}
                    onChange={(e) => e.persist()}
                    onChangeText={(text) => {
                      handleChange(text, "platform");
                    }}
                  />
                )}
                <RegisterButton
                  text={t("instructorCreateCoursePageConstants.nextButtonText")}
                  onPress={() => {
                    // validate(2);
                    setInternalPage(3);
                  }}
                />
              </View>
            </ScrollView>
          </>
        )}
        {internalPage === 3 && (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Chapter List */}
            <Text style={styles.sectionHeader}>
              {t("instructorCreateCoursePageConstants.manageChapters")}
            </Text>
            {inputs.chapters.map((chapter: Chapter, index: number) => (
              <View key={chapter.chapter_id} style={styles.chapterBar}>
                <TouchableOpacity
                  onPress={() => handleChapterTap(chapter.chapter_id)}
                >
                  <Text style={styles.chapterText}>
                    {chapter.chapter_title
                      ? chapter.chapter_title
                      : `${t(
                          "instructorCreateCoursePageConstants.chapter_placeholder"
                        )} ${index + 1}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeChapter(chapter.chapter_id)}
                >
                  <Text style={styles.removeButtonText}>
                    {t("instructorCreateCoursePageConstants.minus")}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity onPress={addChapter} style={styles.addChapterBar}>
              <Text style={styles.addChapterText}>
                {t("instructorCreateCoursePageConstants.addChapter")}
              </Text>
              <Text style={styles.addButtonText}>
                {t("instructorCreateCoursePageConstants.plus")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        {/* Lesson list for that chapter */}
        {internalPage === 4 && selectedChapter && (
          <View style={styles.inputContainer}>
            <InputField
              inputTitle={t(
                "instructorCreateCoursePageConstants.editChapterTitle"
              )}
              placeholder={
                t("instructorCreateCoursePageConstants.placeholder") ?? ""
              }
              value={selectedChapter.chapter_title}
              onChangeText={(text) =>
                setInputs((prev) => ({
                  ...prev,
                  chapters: prev.chapters.map((chapter: Chapter) =>
                    chapter.chapter_id === selectedChapterId
                      ? { ...chapter, chapter_title: text }
                      : chapter
                  ),
                }))
              }
            />
            <InputDropDownField
              inputTitle={t(
                "instructorCreateCoursePageConstants.numberOfLessons"
              )}
              options={[
                t(
                  "instructorCreateCoursePageConstants.numberOfLessonsOptions.0"
                ),
                t(
                  "instructorCreateCoursePageConstants.numberOfLessonsOptions.1"
                ),
                t(
                  "instructorCreateCoursePageConstants.numberOfLessonsOptions.2"
                ),
                t(
                  "instructorCreateCoursePageConstants.numberOfLessonsOptions.3"
                ),
                t(
                  "instructorCreateCoursePageConstants.numberOfLessonsOptions.4"
                ),
              ]}
              value={selectedChapter.lessons.length.toString()}
              onChange={(value) => {
                // Map the selected translated label back to the original value
                // const selectedValue =
                //   NUMBER_OF_LESSONS_DICTIONARY[
                //     selectedLabel as keyof typeof NUMBER_OF_LESSONS_DICTIONARY
                //   ];
                handleNumberOfLessonsChange(value);
              }}
            />
            <Text style={styles.sectionHeader}>
              {t("instructorCreateCoursePageConstants.manageLessons")}
            </Text>
            <ScrollView
              style={{
                marginTop: 4,
                //borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 8,
              }}
            >
              {selectedChapter.lessons.map((lesson: Lesson, index: number) => (
                <View key={index} style={styles.chapterBar}>
                  <TouchableOpacity
                    onPress={() => handleLessonTap(lesson.lesson_id, index)}
                  >
                    <Text style={styles.chapterText}>
                      {lesson.lesson_name
                        ? lesson.lesson_name
                        : `${t(
                            "instructorCreateCoursePageConstants.lesson_placeholder"
                          )} ${index + 1}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {internalPage === 5 && (
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <InputField // Lesson name
                inputTitle={t(
                  "instructorCreateCoursePageConstants.lesson_placeholder"
                )}
                placeholder={
                  t("instructorCreateCoursePageConstants.lesson_placeholder") ??
                  ""
                }
                value={selectedLesson.lesson_name}
                onChangeText={(text) =>
                  selectedLessonIndex !== null &&
                  updateLesson(selectedLessonIndex, "lesson_name", text)
                }
              />
              <InputDropDownField
                inputTitle={t(
                  "instructorCreateCoursePageConstants.lessonTypeTitle"
                )}
                options={[
                  t(
                    "instructorCreateCoursePageConstants.lessonTypeOptions.text"
                  ),
                  t(
                    "instructorCreateCoursePageConstants.lessonTypeOptions.video"
                  ),
                  t(
                    "instructorCreateCoursePageConstants.lessonTypeOptions.homework"
                  ),
                ]}
                //value={selectedLesson.lesson_type}
                value={
                  (LESSON_TYPE_DICTIONARY.hasOwnProperty(
                    selectedLesson.lesson_type
                  ) &&
                    t(
                      `instructorCreateCoursePageConstants.lessonTypeOptions.${selectedLesson.lesson_type.toLowerCase()}`
                    )) ||
                  selectedLesson.lesson_type
                }
                onChange={(selectedLabel) => {
                  // Map the selected translated label back to the original English value
                  const selectedValue =
                    LESSON_TYPE_DICTIONARY[
                      selectedLabel as keyof typeof LESSON_TYPE_DICTIONARY
                    ];
                  if (selectedLessonIndex !== null) {
                    updateLesson(
                      selectedLessonIndex,
                      "lesson_type",
                      selectedValue
                    );
                  }
                }}
              />
            </View>
            {selectedLesson.lesson_type ===
              textConstants.lessonTypeOptions[0] && (
              <View style={styles.container} key={selectedLessonIndex}>
                <Editor
                  setPlainText={setPlainText}
                  setEditorState={setEditorState}
                  initialState={selectedLesson.content}
                ></Editor>
              </View>
            )}
            {selectedLesson.lesson_type ===
              textConstants.lessonTypeOptions[1] && (
              <View style={styles.inputContainer} key={selectedLessonIndex}>
                <TouchableOpacity // video upload
                  onPress={() => {
                    handleUploadVideo();
                    checkPermissions();
                  }}
                >
                  <InputField
                    inputTitle={t("instructorCreateCoursePageConstants.video")}
                    placeholder={t(
                      "instructorCreateCoursePageConstants.video_placeholder"
                    )}
                    value={
                      selectedLesson.video_url
                        ? t(
                            "instructorCreateCoursePageConstants.videoUploadedAlert"
                          )
                        : selectedLesson.video_key
                    }
                    editable={false} // Prevent manual text editing
                  />
                </TouchableOpacity>
              </View>
            )}
            {selectedLesson.lesson_type ===
              textConstants.lessonTypeOptions[2] && (
              <View style={styles.inputContainer} key={selectedLessonIndex}>
                <TouchableOpacity // for PDF homework
                  onPress={() => {
                    handleUploadPDF();
                    checkPermissions();
                  }}
                >
                  <InputField
                    inputTitle={t(
                      "instructorCreateCoursePageConstants.homework"
                    )}
                    placeholder={t(
                      "instructorCreateCoursePageConstants.homework_placeholder"
                    )}
                    value={
                      selectedLesson.homework_url
                        ? t(
                            "instructorCreateCoursePageConstants.pdfUploadedAlert"
                          )
                        : selectedLesson.homework_key
                    }
                    editable={false} // Prevent manual text editing
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>

      <View style={styles.fixedButtonContainer}>
        {internalPage !== 5 && internalPage !== 4 && (
          <RegisterButton
            text={
              courseToEdit
                ? t("instructorCreateCoursePageConstants.updateButtonText")
                : t("instructorCreateCoursePageConstants.createButtonText")
            }
            style={validated ? styles.registerButton : styles.disabledButton}
            onPress={() => {
              if (validated) {
                registerCourse();
              } else {
                validateChapters(inputs.chapters, 0);
                alert(
                  t("instructorCreateCoursePageConstants.fillAllFieldsAlert")
                );
              }
            }}
          />
        )}
        {(internalPage === 5 || internalPage === 4) && (
          <View style={styles.fixedButtonContainer}>
            <RegisterButton
              text={t("instructorCreateCoursePageConstants.saveButtonText")}
              onPress={() => {
                if (internalPage == 4) {
                  filterFilesByChapters(inputs.chapters, inputs.files);
                  validateChapters(inputs.chapters, 0);
                } else if (
                  internalPage == 5 &&
                  selectedLesson.lesson_type ===
                    t("instructorCreateCoursePageConstants.lessonTypeOptions.0")
                ) {
                  if (selectedLessonIndex !== null && editorState) {
                    updateLesson(selectedLessonIndex, "content", editorState);
                  }
                }
                setInternalPage(internalPage - 1);
              }}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  richEditor: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  richToolbar: {
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  appBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.Gray,
  },
  homePageHeader: {
    fontSize: 20,
    color: Colors.darkGray,
    fontWeight: "bold",
  },
  inputContainer: { paddingHorizontal: 16, paddingTop: 16 },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    fontSize: 18,
    color: Colors.defaultBlue,
    marginBottom: 8,
  },
  chapterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: Colors.defaultBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  addChapterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: Colors.Gray,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  chapterText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.defaultBlue,
  },
  addChapterText: {
    fontSize: 16,
    color: Colors.darkGray,
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.darkGray,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.darkGray,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.Gray,
  },
  lessonHeader: {
    fontSize: 18,
    color: Colors.defaultBlue,
    marginBottom: 8,
    fontStyle: "italic",
  },
  //styling for register button
  registerButton: {
    backgroundColor: Colors.defaultBlue,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  //styling for a disabled register button
  disabledButton: {
    backgroundColor: Colors.Gray,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
