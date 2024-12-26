//Large Blue button for registering, signing in, saving changes etc

import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
    onPress: () => void;
    text: string;
}

const Button: React.FC<ButtonProps> = ({ text, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: "#356fc5",
                padding: 16,
                borderRadius: 8,
            }}
        >
            <Text
                style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "600",
                }}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

export default Button;
