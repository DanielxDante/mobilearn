import React, { useState } from "react";
import { 
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import SignInButton from "@/components/Button";
import InputField from "@/components/InputField";
import mobilearnHat from "@/assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore";
import { waitingPageInstructor as Constants } from "@/constants/textConstants";
import { INSTRUCTOR_LOGIN_PAGE, MEMBER_GUEST_HOME } from "@/constants/pages";
import { useTranslation } from "react-i18next";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function LoginPage() {
  //const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();

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
        <Image
          source={mobilearnHat}
          style={{
            width: 128,
            height: 96,
          }}
          resizeMode="contain" // Adjust as needed
        />
        <Text // MObiLearn
          style={{
            fontSize: 48,
            color: "#356FC5",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {t("waitingPageInstructor.pageTitle")}
        </Text>
        <Text // You have registered as an
          style={{
            fontSize: 24,
            color: "#356FC5",
            textAlign: "center",
            marginBottom: 16,
            maxWidth: 0.8 * width,
          }}
        >
          {t("waitingPageInstructor.blueSubTitle")}
        </Text>
        <Image
          source={Constants.image}
          style={{
            width: 128,
            height: 96,
          }}
          resizeMode="contain" // Adjust as needed
        />
        <Text // Role
          style={{
            fontSize: 32,
            color: "#356FC5",
            textAlign: "center",
            marginBottom: 16,
            maxWidth: 0.8 * width,
          }}
        >
          {t("waitingPageInstructor.status")}
        </Text>
        <Text // SubTitle
          style={{
            fontSize: 16,
            color: "#6c6c6c",
            textAlign: "center",
            marginBottom: 16,
            maxWidth: 0.8 * width,
          }}
        >
          {t("waitingPageInstructor.subTitle")}
        </Text>
        <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push(INSTRUCTOR_LOGIN_PAGE);
            }}
          >
            <Text style={styles.buttonText}>{t("waitingPageInstructor.linkText")}</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#356FC5",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#356FC5",
  },
  buttonText: {
    fontWeight: "500",
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center", 
  },
});