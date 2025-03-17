import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useSegments } from "expo-router";
import TopCourses from "@/app/(instructor)/home/topCourses";
import { MEMBER_GUEST_TABS } from "@/constants/pages";
import useAuthStore from "@/store/authStore";

import { Colors } from "@/constants/colors";
import { memberGuestHomeConstants as Constants } from "@/constants/textConstants";
import Statistics from "@/components/Statistics";
import LatestNews from "@/components/LatestNews";
//import { instructorHomePageConstants as textConstants } from "@/constants/textConstants";
import useAppStore from "@/store/appStore";
import Course from "@/types/shared/Course/Course";
import { useTranslation } from "react-i18next";
import {
  NOTIFICATION_PAGE,
  COURSE_DETAILS_PAGE,
  TOP_COURSES_SEE_ALL,
} from "@/constants/pages";
//import { instructorHomePageConstants } from "@/constants/textConstants";
//import { memberGuestHomeConstants } from "@/locales/en";

const newsData = [
  {
    title: "The Effects of Temperature on Enzyme Activity and Biology",
    category: "Biology",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Advances in Quantum Computing",
    category: "Technology",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Global Warming and Its Impact on Agriculture",
    category: "Environment",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const Home = () => {
  const segments = useSegments();
  const [loading, setLoading] = useState(false);
  const appStore = useAppStore();

  const notifications = useAppStore((state) => state.notifications);
  const getNotifications = useAppStore(
    (state) => state.getNotificationsInstructor
  );
  //getNotifications();
  const statistics = useAppStore((state) => state.statistics) || {
    total_lessons: 0,
    total_enrollments: 0,
    enrollments_percentage_change: 0,
    average_course_progress: 0,
    progress_percentage_change: 0,
    total_reviews: 0,
    reviews_percentage_change: 0,
  };
  const getStatistics = useAppStore((state) => state.getStatistics);

  const handleSelectCourse = useAppStore(
    (state) => state.handleInstructorSelectCourse
  );

  const [timePeriod, setTimePeriod] = useState("week");
  const { t } = useTranslation();

  useEffect(() => {
    getNotifications();
  }, []);

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

  useEffect(() => {
    //console.log("Notifications in homepage: ", notifications);
    getStatistics(timePeriod);
    //getNotifications();
  }, [notifications, timePeriod]);

  useEffect(() => {
    appStore.createSocket();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarContainer}>
        {/* App bar for Home and notifications*/}
        <Text style={styles.homePageHeader}>
          {t("instructorHomePageConstants.pageTitle")}
        </Text>
        {/* Notification bell icon */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => {
            // add params to pass to notification page
            router.push({
              pathname: NOTIFICATION_PAGE,
              params: {
                notifications: JSON.stringify(notifications),
              },
            });
          }}
        >
          <Image
            source={Constants.notifBellButton}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* Statistics */}
        <Statistics
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          statistics={statistics}
        />
        {/* Top Courses */}
        <View>
          <View style={styles.topCoursesHeader}>
            <Text style={styles.topCoursesTitle}>
              {t("memberGuestHomeConstants.topCoursesSubHeader")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push(TOP_COURSES_SEE_ALL);
              }}
            >
              <Text style={styles.seeAllText}>
                {t("memberGuestHomeConstants.seeAllText")}
              </Text>
            </TouchableOpacity>
          </View>
          <TopCourses onSelect={handleSelectCourse} />
        </View>
        {/* News */}
        <LatestNews news={newsData} />
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
    marginLeft: 20,
    paddingBottom: 2,
    fontSize: 22,
    fontWeight: "bold",
  },
  notificationButton: {
    padding: 20,
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
