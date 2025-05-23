import { router } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Button from "../../components/MediumButton";
import { instructorSignInUpPageConstants as Constants } from "@/constants/textConstants";
import SignInUp from "../../assets/images/SignInUp.png";
import { MEMBER_GUEST_NAMESPACE } from "@/constants/pages";
import { INSTRUCTOR_LOGIN_PAGE } from "@/constants/pages";
import { INSTRUCTOR_SIGNUP_PAGE } from "@/constants/pages";
import { useTranslation } from "react-i18next";

const SignUpPage = () => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
        justifyContent: "center",
      }}
    >
      <Image
        source={SignInUp}
        style={{
          width: 256,
          height: 288,
          marginTop: 16,
          marginBottom: 40,
        }}
        resizeMode="contain" // Adjust as needed
      />
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 16,
          marginHorizontal: 36,
          color: "#356FC5",
          //paddingHorizontal: 40,
        }}
      >
        {t("instructorSignInUpPageConstants.signUpPageTitle")}
      </Text>
      <Text
        style={{
          color: "#6c6c6c",
          textAlign: "center",
          marginBottom: 26,
          marginHorizontal: 32,
        }}
      >
        {t("instructorSignInUpPageConstants.signUpPageSubtitle")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          columnGap: 16,
        }}
      >
        <Button
          text={t("instructorSignInUpPageConstants.signInButtonText")}
          isBlue={true}
          onPress={() => {
            router.push(INSTRUCTOR_LOGIN_PAGE);
            console.log("login pressed");
          }}
        ></Button>
        <Button
          text={t("instructorSignInUpPageConstants.signUpButtonText")}
          isBlue={false}
          onPress={() => {
            router.push(INSTRUCTOR_SIGNUP_PAGE);
            console.log("signup pressed");
          }}
        ></Button>
      </View>
    </View>
  );
};

export default SignUpPage;
