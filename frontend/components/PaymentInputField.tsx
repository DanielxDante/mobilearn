import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends TextInputProps {
    placeholder: string;
    secureTextEntry?: boolean;
    maxLength?: number;
    numbersOnly?: boolean;
    isExpiryDate?: boolean;
    isCardNumber?: boolean;
}

const PaymentInputField: React.FC<InputFieldProps> = ({
    placeholder,
    secureTextEntry = false,
    maxLength = 30,
    numbersOnly = false,
    isExpiryDate = false,
    isCardNumber = false,
    onChangeText,
    ...rest
}) => {
    const [value, setValue] = useState("");

    const handleChange = (text: string) => {
        let formattedText = text;

        if (numbersOnly || isExpiryDate || isCardNumber) {
            formattedText = text.replace(/[^0-9]/g, "");
            if (isExpiryDate) {
                formattedText = `${formattedText.slice(
                    0,
                    2
                )}/${formattedText.slice(2)}`;
                if (formattedText.endsWith("/")) {
                    formattedText = formattedText.slice(0, -1);
                }
                formattedText = formattedText.slice(0, 5);
            } else if (isCardNumber) {
                formattedText = formattedText
                    .replace(/(.{4})/g, "$1-")
                    .slice(0, 19); // 19 characters (16 digits + 3 hyphens)
                // Remove trailing hyphen if present
                if (formattedText.endsWith("-")) {
                    formattedText = formattedText.slice(0, -1);
                }
                // }
            }
        }
        setValue(formattedText);
        return formattedText;
    };

    return (
        <View style={{ marginBottom: 16, flex: 1 }}>
            <TextInput
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                style={{
                    borderWidth: 1,
                    borderColor: Colors.defaultBlue,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    fontSize: 18,
                    borderRadius: 5,
                }}
                maxLength={maxLength}
                value={value}
                onChangeText={(text) => {
                    const filteredText = handleChange(text);
                    if (onChangeText) {
                        onChangeText(filteredText);
                    }
                }}
                {...rest}
            />
        </View>
    );
};

export default PaymentInputField;
