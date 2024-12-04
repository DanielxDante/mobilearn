import React, { useState } from "react";
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
//import uuidv4 from 'react-native-uuid';
import RegisterButton from "@/components/Button";
import InputField from "@/components/InputField";
import InputDropDownField from "@/components/InputDropDownField";
//import mobilearnHat from "../../assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore"; // Import the store
import { instructorCreateCoursePageConstants as textConstants } from "@/constants/textConstants";
import { INSTRUCTOR_REGISTRATION_SUCCESS } from "@/constants/pages";
import icons from "@/constants/icons"; //here is a backbutton icon here
import LargeButton from "@/components/LargeButton";
import PhoneNumberInputField from "@/components/PhoneNumberInputField";
import { Colors } from "@/constants/colors";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function createCoursePage() {
  //const signup = useAuthStore((state) => state.signupInstructor);

  const [courseTitle, setCourseTitle] = useState("");
  const [courseInfo, setCourseInfo] = useState("");
  const [field, setField] = useState("");
  //implement the rest of the fields here
  const [numberOfLessons, setNumberOfLessons] = useState(1);
  const [numberOfLessonsString, setNumberOfLessonsString] =
    useState("1 Lesson");

  const [internalPage, setInternalPage] = useState(1); // 1 for first page, 2 for second page

  const createCourse = () => {
    console.log("Course Created");
  };
  const handleNextPage = () => {
    setInternalPage(2);
  };

  const handleBack = () => {
    setInternalPage(1);
  };

  const [chapters, setChapters] = useState([
    {
      id: `${Date.now()}-${Math.random()}`, //unique id
      title: "",
      info: "",
      lessons: [""], // Initially one empty lesson
    },
  ]); // List of chapters

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null
  );

  const handleChapterTap = (id: string) => {
    setSelectedChapterId(id); // Save the tapped chapter ID
    setInternalPage(2); // Navigate to the second page
  };
  const selectedChapter = chapters.find(
    (chapter) => chapter.id === selectedChapterId
  );

  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        title: "",
        info: "",
        lessons: [""],
      },
    ]);
  };

  const removeChapter = (id: string) => {
    setChapters((prev) => prev.filter((chapter) => chapter.id !== id));
  };

  // const updateChapter = (id, field, value) => {
  //   setChapters((prev) =>
  //     prev.map((chapter) =>
  //       chapter.id === id ? { ...chapter, [field]: value } : chapter
  //     )
  //   );
  // };

  function handleNumberOfLessons(newValue: string): void {
    const value = parseInt(newValue[0], 10);
    setNumberOfLessons(value);
    setNumberOfLessonsString(newValue);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBarContainer}>
        <TouchableOpacity
          onPress={
            internalPage === 1 ? () => router.back() : () => setInternalPage(1)
          }
          style={{ marginBottom: 16, alignSelf: "flex-start" }}
        >
          <Image
            source={icons.backButton}
            style={{ width: 24, height: 24, tintColor: Colors.darkGray }}
          />
        </TouchableOpacity>
        <Text style={styles.homePageHeader}>
          {internalPage === 1
            ? textConstants.pageTitle
            : textConstants.chapterPageTitle}
        </Text>
      </View>

      {/* Internal first page */}
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
          {/* Scrollable Content */}
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

            {/* Add Chapter Button */}
            <TouchableOpacity onPress={addChapter} style={styles.addChapterBar}>
              <Text style={styles.addChapterText}>Add Chapter</Text>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.fixedButtonContainer}>
            <RegisterButton
              text="Create Course"
              onPress={() => createCourse()}
            />
          </View>
        </>
      )}
      {/* Internal Second Page */}
      {internalPage === 2 && selectedChapter && (
        <View style={{ flex: 1, width: "100%", padding: 16 }}>
          {/* Chapter Title */}
          <InputField
            inputTitle={textConstants.chapter}
            placeholder={textConstants.placeholder ?? ""}
            value={selectedChapter.title}
            onChangeText={(text) =>
              setChapters((prev) =>
                prev.map((chapter) =>
                  chapter.id === selectedChapterId
                    ? { ...chapter, title: text }
                    : chapter
                )
              )
            }
          />

          {/* Chapter Info */}
          <InputField
            inputTitle={textConstants.chapterInfo}
            placeholder={textConstants.placeholder ?? ""}
            value={selectedChapter.info}
            onChangeText={(text) =>
              setChapters((prev) =>
                prev.map((chapter) =>
                  chapter.id === selectedChapterId
                    ? { ...chapter, info: text }
                    : chapter
                )
              )
            }
          />

          {/* Dropdown for Number of Lessons */}
          <InputDropDownField
            inputTitle="Number of Lessons"
            value={selectedChapter.lessons.length.toString()}
            options={["1", "2", "3", "4", "5"]}
            onChange={(value) =>
              setChapters((prev) =>
                prev.map((chapter) =>
                  chapter.id === selectedChapterId
                    ? {
                        ...chapter,
                        lessons: Array(parseInt(value)).fill(""), // Adjust lesson count
                      }
                    : chapter
                )
              )
            }
          />
          {/* Scrollable Lessons List */}
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            style={{ flex: 1 }}
          >
            {selectedChapter.lessons.map((lesson, index) => (
              <InputField
                key={index}
                inputTitle={`Lesson ${index + 1}`}
                placeholder="Enter lesson description"
                value={lesson}
                onChangeText={(text) =>
                  setChapters((prev) =>
                    prev.map((chapter) =>
                      chapter.id === selectedChapterId
                        ? {
                            ...chapter,
                            lessons: chapter.lessons.map((l, i) =>
                              i === index ? text : l
                            ),
                          }
                        : chapter
                    )
                  )
                }
              />
            ))}
          </ScrollView>

          {/* Navigation Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <LargeButton text="Back" onPress={handleBack} />
            <LargeButton
              text="Save"
              onPress={() => {
                setInternalPage(1); // Navigate back to Page 1
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
    paddingBottom: 100, // Ensure no overlap with fixed button
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
});
