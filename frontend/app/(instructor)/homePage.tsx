import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  BackHandler,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useSegments } from "expo-router";

import AppBar from "@/components/AppBar";
import Search from "@/components/Search";
import ContinueWatching from "@/app/(member_guest)/home/continueWatching";
import SuggestionsSection from "@/app/(member_guest)/home/suggestionsSection";
import TopCourses from "@/app/(member_guest)/home/topCourses";
import { MEMBER_GUEST_TABS } from "@/constants/pages";
import useAuthStore from "@/store/authStore";

import {
  channelData,
  courseListData,
  continueWatchingData,
  suggestionsData,
  topCourseData,
} from "@/constants/temporaryCourseData";

import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { useFonts } from "expo-font";
import { Colors } from "@/constants/colors";
import { memberGuestHomeConstants as Constants } from "@/constants/textConstants";
import Statistics from "@/components/Statistics";
import LatestNews from "@/components/LatestNews";

const statsData = [
  { label: "Your Course", value: "23", description: "Lesson" },
  { label: "Your Audience", value: "10,458", change: "-23.47%" },
  { label: "Avg. Watch Time", value: "35 min", change: "+23.47%" },
  { label: "Reviews", value: "20,254", change: "+23.47%" },
];

const Home = () => {
  const segments = useSegments();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Get the current route
        const currentRoute = segments[segments.length - 1];
        // If we're on the member home page, go to hardware home
        if (currentRoute === MEMBER_GUEST_TABS) {
          BackHandler.exitApp(); // Exit the app
          return true;
        }

        return false;
      }
    );

    return () => backHandler.remove();
  }, [router, segments]);

  const handleSelectCourse = (id: number) => {
    // TODO: INCLUDE COURSE NAVIGATION
    console.log("Course " + id + " Selected");
    const courseSelected = courseListData.find((course) => course.id === id);
    router.push({
      pathname: "../../shared/course/courseDetails",
      params: {
        courseSelected: JSON.stringify(courseSelected),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.appBarContainer}>
          {/* App bar for Home and notifications*/}
          <Text style={styles.homePageHeader}>Home</Text>
          {/* Notification bell icon */}
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {
              router.push("/shared/notification");
            }}
          >
            <Image
              source={Constants.notifBellButton}
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>
        {/* Statistics */}
        <Statistics stats={statsData} />
        {/* Top Courses */}
        <View>
          <View style={styles.topCoursesHeader}>
            <Text style={styles.topCoursesTitle}>
              {Constants.topCoursesSubHeader}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/(member_guest)/home/topCoursesSeeAll",
                  params: {
                    suggestions: JSON.stringify(topCourseData),
                  },
                });
              }}
            >
              <Text style={styles.seeAllText}>{Constants.seeAllText}</Text>
            </TouchableOpacity>
          </View>
          <TopCourses
            courseData={topCourseData}
            onSelect={handleSelectCourse}
          />
        </View>
        {/* News */}
        <LatestNews />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
  },
  appBarContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  homePageHeader: {
    color: Colors.defaultBlue,
    fontFamily: "Inter-Regular",
    marginLeft: 25,
    paddingBottom: 2,
    fontSize: 22,
    fontWeight: "bold",
  },
  notificationButton: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIcon: {
    height: 32,
    width: 32,
  },
  seeAllText: {
    color: "#6C6C6C",
    fontSize: 12,
    textDecorationLine: "underline",
    marginRight: 12,
  },
  topCoursesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  topCoursesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.defaultBlue, // Adjust to your theme color
    marginHorizontal: 20,
  },
});

export default Home;
