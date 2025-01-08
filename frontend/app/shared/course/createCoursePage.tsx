import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
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
import LargeButton from "@/components/LargeButton";
import { Colors } from "@/constants/colors";

const { height, width } = Dimensions.get("window"); // Get the screen width
import { useLocalSearchParams } from "expo-router";
import Chapter from "@/types/shared/Course/Chapter";
import Lesson from "@/types/shared/Course/Lesson";

export default function createCoursePage() {
  const { courseToEdit } = useLocalSearchParams();
  const course = useMemo(
    () => (typeof courseToEdit === "string" ? JSON.parse(courseToEdit) : null),
    [courseToEdit]
  );

  const [courseTitle, setCourseTitle] = useState(course?.title || "");
  const [courseInfo, setCourseInfo] = useState(course?.info || "");
  const [field, setField] = useState(course?.field || "");
  const [chapters, setChapters] = useState(
    course?.chapters || [
      {
        id: `${Date.now()}-${Math.random()}`, // unique id
        title: "",
        info: "",
        lessons: [""],
      },
    ]
  );
  const [internalPage, setInternalPage] = useState(1);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (
      course &&
      (courseTitle !== course.title ||
        courseInfo !== course.info ||
        field !== course.field ||
        JSON.stringify(chapters) !== JSON.stringify(course.chapters))
    ) {
      setCourseTitle(course.title);
      setCourseInfo(course.info);
      setField(course.field);
      setChapters(course.chapters);
    }
  }, [course]);

  const selectedChapter = selectedChapterId
    ? chapters.find(
        (chapter: Chapter) =>
          chapter.id.toString() === selectedChapterId.toString()
      )
    : null;

  const handleChapterTap = (id: string) => {
    setSelectedChapterId(id);
    setInternalPage(2);
  };

  const addChapter = () => {
    setChapters((prev: Chapter[]) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`, // unique id
        title: "",
        info: "",
        lessons: [{ title: "", description: "" }],
      },
    ]);
  };

  const removeChapter = (id: string) => {
    setChapters((prev) => prev.filter((chapter) => chapter.id !== id));
  };

  const updateLesson = (
    lessonIndex: number,
    key: "title" | "description",
    value: string
  ) => {
    if (!selectedChapterId) return;

    setChapters((prev: Chapter[]) =>
      prev.map((chapter) =>
        chapter.id.toString() === selectedChapterId
          ? {
              ...chapter,
              lessons: chapter.lessons.map((lesson, index) =>
                index === lessonIndex ? { ...lesson, [key]: value } : lesson
              ),
            }
          : chapter
      )
    );
  };

  const handleNumberOfLessonsChange = (value: string) => {
    if (!selectedChapterId) return;
    const newLessonCount = parseInt(value, 10);

    setChapters((prev: Chapter[]) =>
      prev.map((chapter) =>
        chapter.id.toString() === selectedChapterId
          ? {
              ...chapter,
              lessons: Array(newLessonCount)
                .fill(null)
                .map(
                  (_, index) =>
                    chapter.lessons[index] || { title: "", description: "" }
                ),
            }
          : chapter
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarContainer}>
        <TouchableOpacity
          onPress={
            internalPage === 1 ? () => router.back() : () => setInternalPage(1)
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
          {internalPage === 1
            ? course
              ? textConstants.editCoursePageTitle
              : textConstants.createCoursePageTitle
            : textConstants.chapterPageTitle}
        </Text>
      </View>

      {internalPage === 1 && (
        <>
          <View style={styles.inputContainer}>
            <InputField
              inputTitle={textConstants.courseTitle}
              placeholder={textConstants.placeholder ?? ""}
              value={courseTitle}
              onChangeText={setCourseTitle}
            />
            <InputField
              inputTitle={textConstants.courseInfo}
              placeholder={textConstants.placeholder ?? ""}
              value={courseInfo}
              onChangeText={setCourseInfo}
            />
            <InputDropDownField
              inputTitle={textConstants.field}
              options={textConstants.field_options ?? []}
              value={field}
              onChange={setField}
            />
            <Text style={styles.sectionHeader}>{textConstants.chapters}</Text>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Chapter List */}
            {chapters.map((chapter, index) => (
              <View key={chapter.id} style={styles.chapterBar}>
                <TouchableOpacity onPress={() => handleChapterTap(chapter.id)}>
                  <Text style={styles.chapterText}>
                    {chapter.title ? chapter.title : `Chapter ${index + 1}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeChapter(chapter.id)}>
                  <Text style={styles.removeButtonText}>-</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity onPress={addChapter} style={styles.addChapterBar}>
              <Text style={styles.addChapterText}>Add Chapter</Text>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.fixedButtonContainer}>
            <RegisterButton
              text={courseToEdit ? "Update Course" : "Create Course"}
              onPress={() => {}}
            />
          </View>
        </>
      )}

      {internalPage === 2 && selectedChapter && (
        <View style={{ flex: 1, width: "100%", padding: 16 }}>
          <InputField
            inputTitle={textConstants.chapter}
            placeholder={textConstants.placeholder ?? ""}
            value={selectedChapter.title}
            onChangeText={(text) =>
              setChapters((prev: Chapter[]) =>
                prev.map((chapter) =>
                  chapter.id === selectedChapterId
                    ? { ...chapter, title: text }
                    : chapter
                )
              )
            }
          />
          <InputField
            inputTitle={textConstants.chapterInfo}
            placeholder={textConstants.placeholder ?? ""}
            value={selectedChapter.info}
            onChangeText={(text) =>
              setChapters((prev: Chapter[]) =>
                prev.map((chapter) =>
                  chapter.id === selectedChapterId
                    ? { ...chapter, info: text }
                    : chapter
                )
              )
            }
          />
          <InputDropDownField
            inputTitle="Number of Lessons"
            value={selectedChapter.lessons.length.toString()}
            options={["1", "2", "3", "4", "5"]}
            onChange={handleNumberOfLessonsChange}
          />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {selectedChapter.lessons.map((lesson, index) => (
              <View key={index}>
                <Text style={styles.lessonHeader}>{`Lesson ${index + 1}`}</Text>
                <InputField
                  inputTitle="Lesson Title"
                  placeholder="Enter lesson title"
                  value={lesson.title}
                  onChangeText={(text) => updateLesson(index, "title", text)}
                />
                <InputField
                  inputTitle="Lesson Description"
                  placeholder="Enter lesson description"
                  value={lesson.description}
                  onChangeText={(text) =>
                    updateLesson(index, "description", text)
                  }
                />
              </View>
            ))}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 16,
            }}
          >
            <LargeButton
              text="Save"
              onPress={() => {
                console.log("Updated Chapter:", selectedChapter);
                setInternalPage(1);
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  appBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
});
