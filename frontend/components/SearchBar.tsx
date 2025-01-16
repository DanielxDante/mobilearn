import React, { useState, useCallback } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";
import Course from "@/types/shared/Course/Course";

interface SearchBarProps {
  placeholder: string;
  courseListData: Course[];
  onSearchResultsChange: (filteredCourses: Course[]) => void; // Callback to send filtered results back to the parent
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  courseListData,
  onSearchResultsChange,
}) => {
  const [query, setQuery] = useState<string>("");

  const handleSearch = useCallback(
    (text: string) => {
      setQuery(text);

      // Filter the course data based on the query
      const filteredCourses = courseListData.filter((course) =>
        course.course_name.toLowerCase().includes(text.toLowerCase())
      );

      // Notify the parent about the filtered courses
      onSearchResultsChange(filteredCourses);
    },
    [courseListData, onSearchResultsChange]
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "#B1B1B1",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
});

export default SearchBar;
