import React, { useState } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import SignInButton from "@/components/Button";
import InputField from "@/components/InputField";
import mobilearnHat from "@/assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore";
import { registrationSuccessInstructor as Constants } from "@/constants/textConstants";
import { INSTRUCTOR_LOGIN_PAGE, MEMBER_GUEST_HOME } from "@/constants/pages";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function LoginPage() {
  //const login = useAuthStore((state) => state.login);

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
          {Constants.pageTitle}
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
          {Constants.blueSubTitle}
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
          {Constants.role}
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
          {Constants.subTitle}
        </Text>
        <Link
          //href={MEMBER_GUEST_HOME}
          href={INSTRUCTOR_LOGIN_PAGE}
          style={{
            fontSize: 18,
            color: "#356FC5",
            textAlign: "center",
            marginTop: 32,
            marginBottom: 16,
            maxWidth: 0.8 * width,
            textDecorationLine: "underline",
          }}
        >
          {Constants.linkText}
        </Link>
      </View>
    </SafeAreaView>
  );
}
