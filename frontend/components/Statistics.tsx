import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { instructorStatisticsConstants as textConstants } from "@/constants/textConstants";
import DropDownPicker from "react-native-dropdown-picker";
import Statistics_type from "@/types/shared/statistics";

interface StatisticsProps {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
  statistics: Statistics_type;
}

const Statistics: React.FC<StatisticsProps> = ({
  timePeriod,
  setTimePeriod,
  statistics,
}) => {
  const [open, setOpen] = useState(false);

  const statsData = [
    {
      key: "total_lessons",
      label: textConstants.totalLessons,
      value: statistics.total_lessons,
    },
    {
      key: "total_enrollments",
      label: textConstants.totalEnrollments,
      value: statistics.total_enrollments,
      change: statistics.enrollments_percentage_change,
    },
    {
      key: "average_course_progress",
      label: textConstants.averageCourseProgress,
      value: `${statistics.average_course_progress}%`,
      change: statistics.progress_percentage_change,
    },
    {
      key: "total_reviews",
      label: textConstants.totalReviews,
      value: statistics.total_reviews,
      change: statistics.reviews_percentage_change,
    },
  ];

  return (
    <KeyboardAvoidingView
      //behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Dropdown Picker (must be above ScrollView) */}
          <View style={styles.statisticsHeader}>
            <Text style={styles.statisticsTitle}>
              {textConstants.pageTitle}
            </Text>

            {/* Dropdown Box */}
            <View style={styles.dropdownWrapper}>
              <DropDownPicker
                open={open}
                value={timePeriod}
                items={[
                  { label: textConstants.dropdown[0], value: "week" },
                  { label: textConstants.dropdown[1], value: "month" },
                  { label: textConstants.dropdown[2], value: "year" },
                ]}
                setOpen={setOpen}
                setValue={(callback) => {
                  if (typeof callback === "function") {
                    setTimePeriod(callback(timePeriod));
                  } else {
                    setTimePeriod(callback);
                  }
                }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={1000}
                listMode="SCROLLVIEW"
              />
            </View>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.statisticsContainer}>
              {/* Statistics Grid */}
              <View style={styles.statisticsGrid}>
                {statsData.map((stat, index) => (
                  <View key={index} style={styles.statCard}>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    {stat.change !== undefined && (
                      <Text
                        style={[
                          styles.statChange,
                          { color: stat.change > 0 ? "green" : "red" },
                        ]}
                      >
                        {stat.change > 0
                          ? `+${stat.change}%`
                          : `${stat.change}%`}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    zIndex: 1, // Ensures it doesn’t interfere with DropDownPicker
  },
  statisticsContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  statisticsHeader: {
    flexDirection: "row", // Places title & dropdown in the same line
    justifyContent: "space-between", // Pushes them apart
    alignItems: "center", // Aligns them vertically
    marginBottom: 10,
    zIndex: 1000,
    marginHorizontal: 20,
  },
  statisticsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.defaultBlue,
    flex: 1, // Allows text to take available space
  },
  dropdownWrapper: {
    width: 150,
    zIndex: 1000,
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
  statisticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: "#4F4F4F",
  },
  statValue: {
    fontSize: 24,
    color: "#181818",
  },
  statChange: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Statistics;
