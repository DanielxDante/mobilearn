import React, { useState } from "react";
import { inputDropDownFieldConstants as Constants } from "@/constants/textConstants";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window"); // Get the screen width

interface InputDropDownFieldProps {
  inputTitle?: string;
  options: string[];
  value: string;
  onChange: (newValue: string) => void;
}

const InputDropDownField: React.FC<InputDropDownFieldProps> = ({
  inputTitle,
  options,
  value,
  onChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOptionSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      {inputTitle && (
        <Text style={{ fontSize: 18, color: "#356FC5", marginBottom: 8 }}>
          {inputTitle}
        </Text>
      )}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={value ? styles.inputText : styles.placeholderText}>
          {value || Constants.selectOption}
        </Text>
      </TouchableOpacity>

      {isDropdownOpen && (
        <View style={styles.dropdownContainer}>
          <ScrollView nestedScrollEnabled style={styles.scrollView}>
            {options.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.dropdownItem,
                  value === item && styles.selectedItem,
                ]}
                onPress={() => handleOptionSelect(item)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    value === item && styles.selectedItemText,
                  ]}
                >
                  {item}
                </Text>
                {value === item && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: "relative", // Relative position to ensure dropdown is correctly positioned
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: "#356FC5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    fontSize: 18,
    color: "#000",
  },
  placeholderText: {
    fontSize: 18,
    color: "#6C6C6C",
  },
  dropdownContainer: {
    position: "absolute", // Now the dropdown will hover over content
    top: 86, // Position it just below the input field (adjust as needed)
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    width: "100%", // Keep it full width of the input field
    elevation: 5,
    zIndex: 10, // Ensure it hovers above other content
    maxHeight: 200, // Limit the height of the dropdown
  },
  scrollView: {
    maxHeight: 200, // Restrict the maximum height of the ScrollView
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 18,
    color: "#000",
  },
  selectedItem: {
    backgroundColor: "#356FC5",
    borderRadius: 8,
  },
  selectedItemText: {
    color: "#fff",
  },
  checkmark: {
    fontSize: 18,
    color: "#fff", // White checkmark to match selected item background
  },
});

export default InputDropDownField;
