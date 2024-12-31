import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { memberGuestEditProfileFields as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import EditProfileFieldPopUp from "./EditProfileFieldPopUp";

interface EditProfileFieldsProps {
  title: string;
  initialValue?: string;
  modalDetails: any;
  onSave: (newValue: string | undefined, newValue2?: any) => any;
}

const EditProfileFields: React.FC<EditProfileFieldsProps> = ({
  title,
  initialValue,
  modalDetails,
  onSave,
}) => {
  const [value, setValue] = useState(initialValue);
  const [localModalVisible, setLocalModalVisible] = useState(false);
  // INTERMEDIATE METHOD TO RENDER ON FRONTEND
  const onSave2 = async (updatedField: string | any, optionalArg?: any) => {
    let result;

    if (onSave.length === 2) {
      // For handlers like `handleEditPassword`
      result = await onSave(updatedField, optionalArg);
    } else {
      // For handlers like `handleEditName`, `handleEditPhoneNumber`
      result = await onSave(updatedField);
    }

    if (result?.isValid && title !== "Password") {
      // If the input is modified by the editor, return it for the validated value, else the updated field is fine
      setValue(result.validatedValue ?? updatedField);
    } else {
      console.log(`${title}: Input is invalid`);
    }
  };

  // METHOD TO TOGGLE MODAL VISIBILITY
  const handleLocalModal = () => {
    setLocalModalVisible(!localModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleLocalModal}>
          <Text style={styles.edit}>{Constants.edit}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.value}>
        {/* Have to revisit if we change language */}
        {title === "Password"
          ? Constants.maskedPassword
          : value || Constants.notAdded}
      </Text>
      <View style={styles.line}></View>
      {localModalVisible && (
        <EditProfileFieldPopUp
          title={title}
          initialValue={value}
          modalDetails={modalDetails}
          onSave={onSave2}
          handleModal={handleLocalModal}
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
