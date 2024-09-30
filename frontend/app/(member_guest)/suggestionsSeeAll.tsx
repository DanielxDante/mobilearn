import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";

import { Colors } from "@/constants/colors";
import CourseListItem from "@/components/CourseListItem";
import Course from "@/types/shared/Course";
import { memberGuestSuggestionsSeeAll as Constants } from "@/constants/textConstants";

const SuggestionsSeeAll = () => {
  const [fontsLoaded, error] = useFonts({
    "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("@/assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
    "Inter-Light": require("@/assets/fonts/Inter-Light.ttf"),
  });

  const { suggestions } = useLocalSearchParams();
  const parsedSuggestions: Course[] =
    typeof suggestions === "string" ? JSON.parse(suggestions) : [];

  const handleSelectCourse = (id: string) => {
    // TODO: INCLUDE COURSE NAVIGATION
    console.log("Course " + id + " Selected");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Image source={Constants.backButton} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.suggestionsHeader}>{Constants.appBarTitle}</Text>
      </View>
      {/* Suggestions Display section */}
      <View>
        <View style={styles.listContainer}>
          <FlatList
            data={parsedSuggestions}
            renderItem={({ item }) => (
              <CourseListItem item={item} onSelect={handleSelectCourse} />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<View style={styles.headerFooterSpacing} />}
            ListFooterComponent={<View style={styles.headerFooterSpacing} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  appBarContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  backButton: {
    height: 25,
    width: 25,
    marginLeft: 25,
    padding: 5,
  },
  suggestionsHeader: {
    color: Colors.defaultBlue,
    fontFamily: "Inter-Regular",
    marginLeft: 25,
    paddingBottom: 2,
    fontSize: 22,
    fontWeight: "bold",
  },
  listContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  headerFooterSpacing: {
    width: 12,
  },
});

export default SuggestionsSeeAll;
