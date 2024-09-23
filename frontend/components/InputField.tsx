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
    <View className={"mb-4"}>
      {inputTitle && (
        <Text className={"text-[#356FC5] text-lg mb-2"}>{inputTitle}</Text>
      )}
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        className={"border-2 border-[#356FC5] py-2 px-4 text-lg rounded-lg"}
        {...rest}
      />
    </View>
  );
};

export default InputField;
