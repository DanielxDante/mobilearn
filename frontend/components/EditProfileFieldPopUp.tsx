import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Pressable,
    TextInput,
    Button,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/colors";
import { memberGuestEditProfilePopUp as Constants } from "@/constants/textConstants";
import { Picker } from "@react-native-picker/picker";

interface FieldItemProps {
    inputTitle: string;
    placeholder: string;
    value?: string;
    onChange: (newValue: string) => void;
}

const FieldItem: React.FC<FieldItemProps> = ({
    inputTitle,
    placeholder,
    value,
    onChange,
}) => {
    return (
        <View style={styles.content}>
            <Text style={styles.inputHeader}>{inputTitle}</Text>
            <TextInput
                onChangeText={onChange}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#AEAEAE"
                style={styles.textInput}
            />
        </View>
    );
};

interface FieldItemOptionsProps {
    inputTitle: string;
    options: string[];
    defaultValue?: string;
    onChange: (newValue: string) => void;
}

const FieldItemOptions: React.FC<FieldItemOptionsProps> = ({
    inputTitle,
    options,
    defaultValue,
    onChange,
}) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    return (
        <View style={styles.content}>
            <Text style={styles.inputHeader}>{inputTitle}</Text>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => {
                    setSelectedValue(itemValue);
                    onChange(itemValue);
                }}
            >
                {options.map((option, index) => (
                    <Picker.Item
                        label={option}
                        value={option.toLowerCase()}
                        key={index}
                    />
                ))}
            </Picker>
        </View>
    );
};

interface EditProfileFieldPopUpProps {
    title: string;
    initialValue?: string;
    modalDetails: {
        inputTitle: string;
        placeholder?: string;
        options?: string[];
    }[];
    onSave: (newValue: string | undefined, newValue2?: any) => void;
    handleModal: () => void;
}

const EditProfileFieldPopUp: React.FC<EditProfileFieldPopUpProps> = ({
    title,
    initialValue,
    modalDetails,
    onSave,
    handleModal,
}) => {
    const [value, setValue] = useState(initialValue);
    const [value2, setValue2] = useState("");
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={handleModal}
        >
            <Pressable style={styles.modalBackground} onPressOut={handleModal}>
                <TouchableWithoutFeedback onPress={() => {}}>
                    <View style={styles.modalContainer}>
                        <View>
                            {/* Title */}
                            <View style={styles.titleView}>
                                <Text style={styles.title}>{title}</Text>
                            </View>
                            <View style={styles.fieldItems}>
                                {modalDetails.map((detail, index) => (
                                    <View key={index}>
                                        {detail.options ? (
                                            <FieldItemOptions
                                                key={index}
                                                inputTitle={detail.inputTitle}
                                                options={detail.options || []}
                                                defaultValue={initialValue}
                                                onChange={(newValue) => {
                                                    if (newValue) {
                                                        setValue(newValue);
                                                    } else {
                                                        console.log(
                                                            "Invalid value selected"
                                                        );
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <FieldItem
                                                key={index}
                                                inputTitle={detail.inputTitle}
                                                placeholder={
                                                    detail.placeholder ||
                                                    "Please enter"
                                                }
                                                value={
                                                    index === 0 ? value : value2
                                                }
                                                onChange={(newValue) => {
                                                    if (index === 0) {
                                                        setValue(newValue);
                                                    } else {
                                                        setValue2(newValue);
                                                    }
                                                }}
                                            />
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={styles.saveContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (value2 === "") {
                                        onSave(value);
                                    } else {
                                        onSave(value, value2);
                                    }
                                }}
                                style={styles.saveButton}
                            >
                                <Text style={styles.saveText}>
                                    {Constants.save}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContainer: {
        minHeight: "28%",
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "space-between",
    },
    titleView: {
        height: 50,
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: "#AEAEAE",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontFamily: "Inter-SemiBold",
        fontSize: 16,
        paddingVertical: 8,
    },
    fieldItems: {
        paddingTop: 5,
    },
    closeButton: {
        height: 26,
        width: 26,
        position: "absolute",
        right: "40%",
        top: 10,
    },
    content: {
        paddingHorizontal: 15,
        paddingVertical: 3,
    },
    inputHeader: {
        paddingVertical: 5,
        color: Colors.defaultBlue,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.defaultBlue,
    },
    saveContainer: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        alignItems: "center",
    },
    saveButton: {
        backgroundColor: Colors.defaultBlue,
        borderRadius: 7,
        paddingVertical: 11,
        paddingHorizontal: 25,
    },
    saveText: {
        fontFamily: "Inter-Regular",
        fontSize: 14,
        color: "white",
    },
});

export default EditProfileFieldPopUp;
