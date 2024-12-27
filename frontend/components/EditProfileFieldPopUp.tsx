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
} from "react-native";
import React, { useState } from "react";

interface EditProfileFieldPopUpProps {
    title: string;
    initialValue: string;
    fields: string[];
    onSave: (newValue: string) => void;
    handleModal: () => void;
}

const EditProfileFieldPopUp: React.FC<EditProfileFieldPopUpProps> = ({
    title,
    initialValue,
    fields,
    onSave,
    handleModal,
}) => {
    const [value, setValue] = useState(initialValue);

    const handleSave = () => {
        onSave(value);
        handleModal();
    };
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={handleModal}
        >
            <Pressable style={styles.modalBackground} onPressOut={handleModal}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContainer}>
                        {/* Title */}
                        <View style={styles.titleView}>
                            {/* <Pressable onPress={handleModal}>
                                <Image
                                    source={require("@/assets/images/icons/cross.png")}
                                    style={styles.closeButton}
                                />
                            </Pressable> */}
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.inputHeader}>{fields[0]}</Text>
                            <TextInput
                                onChangeText={setValue}
                                value={value}
                                placeholder={fields[1]}
                                placeholderTextColor="#AEAEAE"
                                style={styles.textInput}
                            />
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
        minHeight: "30%",
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
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
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 5,
    },
});

export default EditProfileFieldPopUp;
