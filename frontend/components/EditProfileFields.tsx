import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

import { memberGuestEditProfileFields as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import EditProfileFieldPopUp from "./EditProfileFieldPopUp";

interface EditProfileFieldsProps {
    title: string;
    value: string;
    modalDetails: any;
    handleModal: () => void;
    isPopUpVisible: boolean;
    onSave: (newValue: string) => void;
}

const EditProfileFields: React.FC<EditProfileFieldsProps> = ({
    title,
    value,
    modalDetails,
    handleModal,
    isPopUpVisible,
    onSave,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.line}></View>
            <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={handleModal}>
                    <Text style={styles.edit}>{Constants.edit}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.value}>{value || Constants.notAdded}</Text>
            <View style={styles.line}></View>
            {isPopUpVisible && (
                <EditProfileFieldPopUp
                    title={title}
                    initialValue={value}
                    modalDetails={modalDetails}
                    onSave={onSave}
                    handleModal={handleModal}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 22,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
    },
    line: {
        borderTopWidth: 1,
        borderColor: "#DEDEDE",
    },
    title: {
        fontFamily: "Inter-Regular",
        fontSize: 14,
        color: "#6C6C6C",
    },
    edit: {
        fontFamily: "Inter-Regular",
        color: Colors.defaultBlue,
        fontSize: 16,
    },
    value: {
        fontFamily: "Inter-Bold",
        fontSize: 16,
        paddingVertical: 8,
    },
});
export default EditProfileFields;
