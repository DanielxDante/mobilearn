import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  inputTitle?: string;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({
  inputTitle,
  placeholder,
  secureTextEntry = false,
  ...rest
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      {inputTitle && (
        <Text style={{ fontSize: 18, color: "#356FC5", marginBottom: 8 }}>
          {inputTitle}
        </Text>
      )}
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={{
          borderWidth: 2,
          borderColor: "#356FC5",
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 18,
          borderRadius: 8,
        }}
        multiline={true}
        maxLength={1000}
        {...rest}
      />
    </View>
  );
};

export default InputField;
