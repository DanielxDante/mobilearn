import React, { useState } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import RegisterButton from "@/components/Button";
import InputField from "@/components/InputField";
import InputDropDownField from "@/components/InputDropDownField";
//import mobilearnHat from "../../assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore"; // Import the store
import { validateEmail } from "@/constants/regex";
import {
  signUpPageConstants as Constants,
  signUpPageConstants,
} from "@/constants/textConstants";
import {
  MEMBER_GUEST_HOME,
  MEMBER_REGISTRATION_SUCCESS,
} from "@/constants/pages";
import { usePushNotifications } from "@/hooks/usePushNotificationState";
import { useTranslation } from "react-i18next";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function signUpPage() {
  const signup = useAuthStore((state) => state.signupUser);
  const login = useAuthStore((state) => state.loginUser);
  const { expoPushToken, notification } = usePushNotifications();
  const { t } = useTranslation();

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    gender: "male",
    password: "",
    conPassword: "",
    //membership: "normal",
  });

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
    gender: false,
    password: false,
    conPassword: false,
    // membership: false,
  });

  const validateInputs = () => {
    const errors = {
      name: !inputs.name,
      email: !inputs.email || !validateEmail(inputs.email),
      gender: !inputs.gender,
      password: !inputs.password,
      conPassword: !inputs.conPassword,
      // membership: !inputs.membership,
    };
    setValidationErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleInputChange = (name: string, value: string) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
    // console.log(inputs);
  };

  const handleRegistration = async () => {
    if (!validateInputs()) {
      alert(t("signUpPageConstants.inputsEmptyAlert"));
      return;
    }
    if (inputs.password !== inputs.conPassword) {
      alert(t("signUpPageConstants.passwordMismatchAlert"));
      return;
    }
    try {
      const response_signup = await signup(
        inputs.name,
        inputs.email.toLowerCase(),
        inputs.password,
        inputs.gender.toLowerCase(),
        "normal",
        expoPushToken?.data
      );
      //immediately login the user
      if (
        response_signup !== undefined &&
        response_signup === "The email is already in use."
      ) {
        alert(t("signUpPageConstants.emailInUseAlert"));
        return;
      }
      const response = await login(inputs.email.toLowerCase(), inputs.password);
      console.log(response);
      if (response === "normal") {
        router.push(MEMBER_REGISTRATION_SUCCESS);
      } else if (response === "User disabled") {
        alert(t("signUpPageConstants.accountDisabledAlert"));
      } else if (response === "Invalid credentials") {
        alert(t("signUpPageConstants.invalidCredentialsAlert"));
      } else {
        alert(t("signUpPageConstants.errorSigningUpAlert"));
      }
    } catch (error) {
      console.log(error);
      alert(t("signUpPageConstants.errorSigningUpAlert"));
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
        {/* Logo at the top */}
        {/* <Image
          source={mobilearnHat}
          style={{
            width: 128,
            height: 96,
          }}
          resizeMode="contain" // Adjust as needed
        /> */}
        <Text
          style={{
            fontSize: 36,
            color: "#356FC5",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {t("signUpPageConstants.pageTitle")}
        </Text>
        <Text
          style={{
            color: "#6C6C6C",
            textAlign: "center",
            marginBottom: 16,
            maxWidth: 0.8 * width,
          }}
        >
          {t("signUpPageConstants.pageSubTitle")}
        </Text>
      </View>
      <View style={{ width: "100%" }}>
        <InputField
          inputTitle={t("signUpPageConstants.fields.0.inputTitle")}
          placeholder={t("signUpPageConstants.fields.0.placeHolder") ?? ""}
          value={inputs.name}
          onChangeText={(value) => handleInputChange("name", value)}
        />
        <InputField
          inputTitle={t("signUpPageConstants.fields.1.inputTitle")}
          placeholder={t("signUpPageConstants.fields.1.placeHolder") ?? ""}
          value={inputs.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
        <InputDropDownField
          inputTitle={t("signUpPageConstants.fields.2.inputTitle")}
          options={[
            t("signUpPageConstants.fields.2.options.0"), // Translated "Male" or "男"
            t("signUpPageConstants.fields.2.options.1"), // Translated "Female" or "女"
          ]}
          value={t(
            `signUpPageConstants.fields.2.options.${
              inputs.gender === "male" ? 0 : 1
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
        <InputField
          inputTitle={t("signUpPageConstants.fields.3.inputTitle")}
          placeholder={t("signUpPageConstants.fields.3.placeHolder") ?? ""}
          secureTextEntry={true}
          value={inputs.password}
          onChangeText={(value) => handleInputChange("password", value)}
        />
        <InputField
          inputTitle={t("signUpPageConstants.fields.4.inputTitle")}
          placeholder={t("signUpPageConstants.fields.4.placeHolder") ?? ""}
          secureTextEntry={true}
          value={inputs.conPassword}
          onChangeText={(value) => handleInputChange("conPassword", value)}
        />
        <RegisterButton
          text={t("signUpPageConstants.regButtonText")}
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
    </SafeAreaView>
  );
}
