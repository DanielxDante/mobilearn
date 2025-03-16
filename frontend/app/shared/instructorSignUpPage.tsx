import React, { useState } from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import RegisterButton from "@/components/Button";
import InputField from "@/components/InputField";
import InputDropDownField from "@/components/InputDropDownField";
//import mobilearnHat from "../../assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore"; // Import the store
import {
  instructorSignUpPageConstants as Constants,
  instructorSignUpPageConstants,
} from "@/constants/textConstants";
import { INSTRUCTOR_REGISTRATION_SUCCESS } from "@/constants/pages";
import icons from "@/constants/icons"; //here is a backbutton icon here
import LargeButton from "@/components/LargeButton";
import PhoneNumberInputField from "@/components/PhoneNumberInputField";
import { COMMUNITIES_GET_ALL } from "@/constants/routes";
import axios from "axios";
import { validateEmail } from "@/constants/regex";
import { usePushNotifications } from "@/hooks/usePushNotificationState";
import { useTranslation } from "react-i18next";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function signUpPage() {
  const signup = useAuthStore((state) => state.signupInstructor);
  const [internalPage, setInternalPage] = useState(1); // 1 for first page, 2 for second page
  const [communities, setCommunities] = useState([]);
  const { expoPushToken, notification } = usePushNotifications();
  const { t } = useTranslation();
  //use state for all inputs
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    conPassword: "",
    combinedPhoneNumber: "",
    company: "MobiLearn Network",
    position: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
    gender: false,
    password: false,
    conPassword: false,
    combinedPhoneNumber: false,
    company: false,
    position: false,
  });

  const validateInputs = () => {
    const errors = {
      name: !inputs.name,
      email: !inputs.email || !validateEmail(inputs.email),
      gender: !inputs.gender,
      password: !inputs.password,
      conPassword: !inputs.conPassword,
      combinedPhoneNumber: !inputs.combinedPhoneNumber,
      company: !inputs.company,
      position: !inputs.position,
    };
    setValidationErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleInputChange = (name: string, value: string) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleAreaCodeChange = (areaCode: string) => {
    // Extract only the numeric part from the selected area code (e.g., "+1" from "+1 USA")
    const numericAreaCode = areaCode.split(" ")[0];
    // Split the combined phone number to separate the existing phone number
    const currentPhoneNumber = inputs.combinedPhoneNumber.replace(
      /^\+\d{1,3}\s/,
      ""
    ); // Remove area code from combined string
    const newCombinedPhoneNumber = `${numericAreaCode} ${currentPhoneNumber}`; // Merge new numeric area code with current phone number
    handleInputChange("combinedPhoneNumber", newCombinedPhoneNumber);
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    // Keep only the area code part from the existing combined phone number
    const areaCode = inputs.combinedPhoneNumber.split(" ")[0]; // Get the area code part
    const newCombinedPhoneNumber = `${areaCode} ${phoneNumber}`; // Merge area code with new phone number
    handleInputChange("combinedPhoneNumber", newCombinedPhoneNumber);
  };

  const handleNextPage = () => {
    getCommunities();
    setInternalPage(2);
  };

  const handleBack = () => {
    setInternalPage(1);
  };

  async function getCommunities() {
    try {
      const response = await axios.get(COMMUNITIES_GET_ALL);
      const communityNames = response.data.communities.map(
        (community: { name: string }) => community.name
      );
      setCommunities(communityNames);
    } catch (error) {
      console.log(error);
    }
  }

  const handleRegistration = async () => {
    if (!validateInputs()) {
      alert(t("instructorSignUpPageConstants.inputsEmptyAlert"));
      return;
    }
    if (inputs.password !== inputs.conPassword) {
      alert(t("instructorSignUpPageConstants.passwordMismatchAlert"));
      return;
    }
    try {
      await signup(
        inputs.name,
        inputs.email.toLowerCase(),
        inputs.password,
        inputs.gender.toLowerCase(),
        inputs.combinedPhoneNumber,
        inputs.company,
        inputs.position,
        expoPushToken?.data
      );
      router.push(INSTRUCTOR_REGISTRATION_SUCCESS);
    } catch (error) {
      console.log(error);
      alert(t("instructorSignUpPageConstants.errorSigningUpAlert"));
    }
  };

  const GENDER_DICTIONARY = {
    男: "Male",
    女: "Female",
    Male: "Male",
    Female: "Female",
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "white",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          //marginBottom: 48,
          marginTop: -64,
        }}
      >
        {internalPage === 2 && (
          <TouchableOpacity
            onPress={handleBack}
            style={{ marginBottom: 32, alignSelf: "flex-start" }}
          >
            <Image
              source={icons.backButton}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        )}
        {internalPage === 1 && (
          <>
            <Text
              style={{
                fontSize: 36,
                color: "#356FC5",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              {t("instructorSignUpPageConstants.pageTitle")}
            </Text>
            <Text
              style={{
                color: "#6C6C6C",
                textAlign: "center",
                marginBottom: 16,
                maxWidth: 0.8 * width,
              }}
            >
              {t("instructorSignUpPageConstants.pageSubTitle")}
            </Text>
          </>
        )}
      </View>
      {/* Internal first page */}
      {internalPage === 1 && (
        <View style={{ width: "100%" }}>
          <InputField
            inputTitle={t("instructorSignUpPageConstants.fields.0.inputTitle")}
            placeholder={
              t("instructorSignUpPageConstants.fields.0.placeHolder") ?? ""
            }
            value={inputs.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <InputField
            inputTitle={t("instructorSignUpPageConstants.fields.1.inputTitle")}
            placeholder={
              t("instructorSignUpPageConstants.fields.1.placeHolder") ?? ""
            }
            value={inputs.email}
            onChangeText={(text) => handleInputChange("email", text)}
          />
          <InputDropDownField
            inputTitle={t("instructorSignUpPageConstants.fields.2.inputTitle")}
            options={[
              t("instructorSignUpPageConstants.fields.2.options.0"), // Translated "Male" or "男"
              t("instructorSignUpPageConstants.fields.2.options.1"), // Translated "Female" or "女"
            ]}
            value={t(
              `instructorSignUpPageConstants.fields.2.options.${
                inputs.gender === "Male" ? 0 : 1
              }`
            )}
            onChange={(selectedLabel) => {
              // Map the selected translated label back to the original English value
              const selectedValue =
                GENDER_DICTIONARY[
                  selectedLabel as keyof typeof GENDER_DICTIONARY
                ];
              handleInputChange("gender", selectedValue);
            }}
          />
          <PhoneNumberInputField
            // areaCodes={t("instructorSignUpPageConstants.areaCodes.0")}
            areaCodes={[
              t("instructorSignUpPageConstants.areaCodes.0"),
              t("instructorSignUpPageConstants.areaCodes.1"),
              t("instructorSignUpPageConstants.areaCodes.2"),
              t("instructorSignUpPageConstants.areaCodes.3"),
              t("instructorSignUpPageConstants.areaCodes.4"),
              t("instructorSignUpPageConstants.areaCodes.5"),
              t("instructorSignUpPageConstants.areaCodes.6"),
              t("instructorSignUpPageConstants.areaCodes.7"),
              t("instructorSignUpPageConstants.areaCodes.8"),
              t("instructorSignUpPageConstants.areaCodes.9"),
              t("instructorSignUpPageConstants.areaCodes.10"),
              t("instructorSignUpPageConstants.areaCodes.11"),
              t("instructorSignUpPageConstants.areaCodes.12"),
              t("instructorSignUpPageConstants.areaCodes.13"),
              t("instructorSignUpPageConstants.areaCodes.14"),
              t("instructorSignUpPageConstants.areaCodes.15"),
              t("instructorSignUpPageConstants.areaCodes.16"),
              t("instructorSignUpPageConstants.areaCodes.17"),
              t("instructorSignUpPageConstants.areaCodes.18"),
              t("instructorSignUpPageConstants.areaCodes.19"),
              t("instructorSignUpPageConstants.areaCodes.20"),
              t("instructorSignUpPageConstants.areaCodes.21"),
              t("instructorSignUpPageConstants.areaCodes.22"),
              t("instructorSignUpPageConstants.areaCodes.23"),
              t("instructorSignUpPageConstants.areaCodes.24"),
            ]}
            phoneNumber={
              inputs.combinedPhoneNumber.split(" ").slice(1).join(" ") || ""
            } // Extract phone number
            onPhoneNumberChange={handlePhoneNumberChange}
            onAreaCodeChange={handleAreaCodeChange}
            selectedAreaCode={inputs.combinedPhoneNumber.split(" ")[0] || "+1"} // Extract area code
          />
          <RegisterButton
            text={t("instructorSignUpPageConstants.nextButtonText")}
            onPress={handleNextPage}
          />
        </View>
      )}
      {/* Internal Second Page */}
      {internalPage === 2 && (
        <View style={{ width: "100%" }}>
          <InputDropDownField
            inputTitle={t("instructorSignUpPageConstants.fields.4.inputTitle")}
            options={communities}
            value={inputs.company}
            onChange={(text) => handleInputChange("company", text)}
          />
          <InputField
            inputTitle={t("instructorSignUpPageConstants.fields.5.inputTitle")}
            placeholder={
              t("instructorSignUpPageConstants.fields.5.placeHolder") ?? ""
            }
            value={inputs.position}
            onChangeText={(text) => handleInputChange("position", text)}
          />
          <InputField
            inputTitle={t("instructorSignUpPageConstants.fields.6.inputTitle")}
            placeholder={
              t("instructorSignUpPageConstants.fields.6.placeHolder") ?? ""
            }
            secureTextEntry={true}
            value={inputs.password}
            onChangeText={(text) => handleInputChange("password", text)}
          />
          <InputField
            inputTitle={t("instructorSignUpPageConstants.fields.7.inputTitle")}
            placeholder={
              t("instructorSignUpPageConstants.fields.7.placeHolder") ?? ""
            }
            secureTextEntry={true}
            value={inputs.conPassword}
            onChangeText={(text) => handleInputChange("conPassword", text)}
          />
          <RegisterButton
            text={t("instructorSignUpPageConstants.regButtonText")}
            onPress={handleRegistration}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 16,
            }}
          ></View>
        </View>
      )}
    </SafeAreaView>
  );
}
