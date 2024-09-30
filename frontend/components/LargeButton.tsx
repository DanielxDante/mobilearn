import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

interface LargeButtonProps {
  text: string;
  isBlue?: boolean; // Optional prop to control button color
  onPress?: () => void; // Optional prop for custom onPress behavior
}

const LargeButton: React.FC<LargeButtonProps> = ({
  text,
  isBlue = true,
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(); // Call the custom onPress if provided
    } else {
      // Handle other button actions here (e.g., sign up)
      console.log(`${text} pressed`);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, isBlue ? styles.blueButton : styles.whiteButton]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonText, isBlue && styles.blueButtonText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 125,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#356FC5",
    alignItems: "center",
    marginBottom: 16,
  },
  blueButton: {
    backgroundColor: "#356FC5",
  },
  whiteButton: {
    backgroundColor: "white",
  },
  buttonText: {
    fontWeight: "600",
    color: "#356FC5",
  },
  blueButtonText: {
    color: "white",
  },
});

export default LargeButton;
