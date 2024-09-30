import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";

const { height, width } = Dimensions.get("window"); // Get the screen width

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
    <View style={{ marginBottom: 16 }}>
      {inputTitle && (
        <Text style={{ fontSize: 18, color: "#356FC5", marginBottom: 8 }}>
          {inputTitle}
        </Text>
      )}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setIsDropdownOpen(true)}
      >
        {value ? (
          <Text style={styles.inputText}>{value}</Text>
        ) : (
          <Text style={{ color: "#6C6C6C", fontSize: 18 }}>
            Please select an option
          </Text> // Empty Text component
        )}
      </TouchableOpacity>

      <Modal visible={isDropdownOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleOptionSelect(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 2,
    borderColor: "#356FC5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    borderRadius: 8,
  },
  inputText: {
    fontSize: 18,
  },
  modalOverlay: {
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 8,
    padding: 10,
    elevation: 5, // changes darkness of shadow?
  },
  dropdownItem: {
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default InputDropDownField;
