import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends TextInputProps {
    placeholder: string;
    secureTextEntry?: boolean;
    maxLength?: number;
    numbersOnly?: boolean;
}

const PaymentInputField: React.FC<InputFieldProps> = ({
    placeholder,
    secureTextEntry = false,
    maxLength = 30,
    numbersOnly,
    onChangeText,
    ...rest
}) => {
    const [value, setValue] = useState("");

    const handleChange = (text: string) => {
        if (numbersOnly) {
            const filteredText = text.replace(/[^0-9]/g, "");
            setValue(filteredText);
            return filteredText;
        }
        setValue(text);
        return text;
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
