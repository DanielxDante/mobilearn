//Large Blue button for registering, signing in, saving changes etc

import React from "react";
import { Text, TouchableOpacity } from "react-native";
import tailwind from "tailwind-rn";

interface ButtonProps {
  onPress: () => void;
  text: string;
}

const Button: React.FC<ButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={"bg-blue-500 p-4 rounded-lg"}
    >
      <Text className={"text-white text-center text-lg font-semibold"}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
