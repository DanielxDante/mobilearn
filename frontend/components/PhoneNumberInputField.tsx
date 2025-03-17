import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { phoneNumberInputFieldConstants as Constants } from "@/constants/textConstants";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window"); // Get the screen width

// Searchable Dropdown Component
interface SearchableDropdownProps {
  data: string[];
  onSelect: (item: string) => void;
  placeholder?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  data,
  onSelect,
  placeholder,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const { t } = useTranslation();
  placeholder = placeholder || t("phoneNumberInputFieldConstants.search");
  // Filter the data as the user types
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = data.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={styles.searchableDropdownContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => onSelect(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        style={styles.dropdownList} // Style for the dropdown list
        showsVerticalScrollIndicator={true}
        // Limit the height of the dropdown
        contentContainerStyle={styles.dropdownContent}
      />
    </View>
  );
};

// Phone Number Input Field Component
interface PhoneNumberInputFieldProps {
  areaCodes: string[];
  phoneNumber: string;
  onPhoneNumberChange: (phone: string) => void;
  onAreaCodeChange: (code: string) => void;
  selectedAreaCode: string;
}

const PhoneNumberInputField: React.FC<PhoneNumberInputFieldProps> = ({
  areaCodes,
  phoneNumber,
  onPhoneNumberChange,
  onAreaCodeChange,
  selectedAreaCode,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  const handleAreaCodeSelect = (code: string) => {
    onAreaCodeChange(code);
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, color: "#356FC5", marginBottom: 8 }}>
        {t("phoneNumberInputFieldConstants.title")}
      </Text>
      <View style={styles.phoneInputContainer}>
        {/* Area Code Dropdown */}
        <TouchableOpacity
          style={styles.areaCodeContainer}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={styles.areaCodeText}>{selectedAreaCode}</Text>
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          style={styles.phoneNumberInput}
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={onPhoneNumberChange}
          placeholder={t("phoneNumberInputFieldConstants.enterPhone")}
        />
      </View>

      {/* Area Code Dropdown (Searchable & Scrollable) */}
      {isDropdownOpen && (
        <View style={styles.dropdownContainer}>
          <SearchableDropdown
            data={areaCodes}
            onSelect={handleAreaCodeSelect}
            placeholder={t("phoneNumberInputFieldConstants.seachAreaCode")}
          />
        </View>
      )}
    </View>
  );
};

// Style Definitions
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#356FC5",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff",
  },
  areaCodeContainer: {
    padding: 8,
    backgroundColor: "#356FC5",
    borderRadius: 8,
    marginRight: 8,
  },
  areaCodeText: {
    color: "#fff",
    fontSize: 16,
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: 18,
  },
  dropdownContainer: {
    position: "absolute",
    top: 60, // Adjust to position below phone input
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    maxHeight: 200, // Set max height for scrollable dropdown
    elevation: 5,
    zIndex: 10,
  },
  searchableDropdownContainer: {
    paddingHorizontal: 8,
  },
  searchInput: {
    height: 40,
    borderColor: "#356FC5",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  dropdownList: {
    maxHeight: 100, // Limit the height of the dropdown list
    width: "100%", // Ensure the dropdown takes full width
  },
  dropdownContent: {
    paddingVertical: 8, // Padding inside dropdown content
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default PhoneNumberInputField;
