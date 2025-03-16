import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import useAppStore from "@/store/appStore";
import { Colors } from "@/constants/colors";
import icons from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { reviewsPageConstants } from "@/constants/textConstants";
import DropDownPicker from "react-native-dropdown-picker";
import { useTranslation } from "react-i18next";

const ReviewsPage = () => {
  const { t } = useTranslation();
  const reviews = useAppStore((state) => state.reviews) || [];
  const [open, setOpen] = useState(false);
  const [sortSetting, setSortSetting] = useState("recent");

  // Function to filter and sort the reviews based on the selected sortSetting
  const filterAndSortReviews = () => {
    let filteredReviews = [...reviews];

    if (sortSetting !== "recent") {
      // If sortSetting is a rating value (e.g., "5", "4", "3", etc.), filter reviews by rating
      filteredReviews = filteredReviews.filter(
        (item) => item.rating === parseInt(sortSetting)
      );
    } else {
      // If sortSetting is "recent", sort reviews by timestamp (most recent first)
      filteredReviews = filteredReviews.sort(
        (a, b) => b.timestamp - a.timestamp
      );
    }

    return filteredReviews;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.appBarContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
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
        <Text style={styles.pageHeader}>{t("reviewsPageConstants.title")}</Text>
      </View>
      <View style={styles.container}>
        {/* Dropdown for sorting */}
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={open}
            value={sortSetting}
            items={[
              { label: t("reviewsPageConstants.sorts.0"), value: "recent" },
              { label: t("reviewsPageConstants.sorts.1"), value: "5" },
              { label: t("reviewsPageConstants.sorts.2"), value: "4" },
              { label: t("reviewsPageConstants.sorts.3"), value: "3" },
              { label: t("reviewsPageConstants.sorts.4"), value: "2" },
              { label: t("reviewsPageConstants.sorts.5"), value: "1" },
            ]}
            setOpen={setOpen}
            setValue={setSortSetting}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1000}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Display reviews */}
        {reviews.length !== 0 ? (
          <FlatList
            data={filterAndSortReviews()} // Use the filtered and sorted reviews
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <Image
                  source={
                    item.user_profile_picture_url
                      ? { uri: item.user_profile_picture_url }
                      : reviewsPageConstants.default_profile_picture // Default profile image
                  }
                  style={styles.profileImage}
                />
                <View style={styles.reviewContent}>
                  <Text style={styles.userName}>{item.user_name}</Text>
                  <Text style={styles.rating}>{"⭐".repeat(item.rating)}</Text>
                  <Text style={styles.reviewText}>{item.review_text}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>{t("reviewsPageConstants.noReviewsText")}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pageHeader: {
    color: Colors.defaultBlue,
    fontFamily: "Inter-Regular",
    marginLeft: 20,
    paddingBottom: 2,
    fontSize: 22,
    fontWeight: "bold",
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
  dropdownWrapper: {
    width: 150,
    zIndex: 1000,
    marginBottom: 10,
  },
  dropdown: {
    width: "100%",
    minHeight: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownContainer: {
    width: "100%",
    borderColor: "#ccc",
  },
  reviewCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 14,
    color: "#FFD700",
  },
  reviewText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});

export default ReviewsPage;
