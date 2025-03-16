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

import AppBar from "@/components/AppBar";
import Search from "@/components/Search";
import ContinueWatching from "@/app/(member_guest)/home/continueWatching";
import TopCourses from "@/app/(member_guest)/home/topCourses";
import { MEMBER_GUEST_TABS } from "@/constants/pages";
import useAppStore from "@/store/appStore";

import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { Colors } from "@/constants/colors";
import { memberGuestHomeConstants as Constants } from "@/constants/textConstants";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const handleSelectCourse = useAppStore((state) => state.handleSelectCourse);
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

  const handleSelectChannel = () => {
    console.log("handleSelectChannel called");
  };

  return (
    <AutocompleteDropdownContextProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* App bar for channel selection and dropdown */}
          <View style={styles.appBarContainer}>
            <AppBar />
          </View>
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
        <ScrollView>
          {/* Search bar */}
          <View style={styles.searchContainer}>
            <Search handleSelectCourse={handleSelectCourse} />
          </View>
          {/* Continue Watching */}
          <View style={styles.continueWatchingContainer}>
            <ContinueWatching onSelect={handleSelectCourse} />
          </View>

          {/* Suggestions for You */}
          <View style={styles.suggestionsContainer}>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsTitle}>
                {t("memberGuestHomeConstants.suggestionsSubHeader")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  router.push("/(member_guest)/home/suggestionsSeeAll");
                }}
              >
                <Text style={styles.seeAllText}>
                  {t("memberGuestHomeConstants.seeAllText")}
                </Text>
              </TouchableOpacity>
            </View>
            <TopCourses data="Suggestions" onSelect={handleSelectCourse} />
          </View>
          {/* Top Courses */}
          <View>
            <View style={styles.topCoursesHeader}>
              <Text style={styles.topCoursesTitle}>
                {t("memberGuestHomeConstants.topCoursesSubHeader")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  router.push("/(member_guest)/home/topCoursesSeeAll");
                }}
              >
                <Text style={styles.seeAllText}>
                  {t("memberGuestHomeConstants.seeAllText")}
                </Text>
              </TouchableOpacity>
            </View>
            <TopCourses data="Top Courses" onSelect={handleSelectCourse} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </AutocompleteDropdownContextProvider>
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
    flex: 1,
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
  searchContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  continueWatchingContainer: {
    marginTop: 12,
    marginHorizontal: 20,
  },
  suggestionsContainer: {
    marginTop: 12,
  },
  suggestionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: Colors.defaultBlue,
    marginHorizontal: 20,
  },
  seeAllText: {
    color: "#6C6C6C",
    fontSize: 11,
    textDecorationLine: "underline",
    fontFamily: "Inter-Regular",
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
    fontFamily: "Inter-Bold",
    color: Colors.defaultBlue, // Adjust to your theme color
    marginHorizontal: 20,
  },
});

export default Home;
