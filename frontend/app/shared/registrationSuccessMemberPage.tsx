import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, useSegments } from "expo-router";

import Button from "../../components/LargeButton";
import InputField from "@/components/InputField";
import mobilearnHat from "@/assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore";
import { registrationSuccessMember as Constants } from "@/constants/textConstants";
import {
  MEMBER_CHANNEL_REGISTRATION,
  MEMBER_GUEST_TABS,
} from "@/constants/pages";
import { useTranslation } from "react-i18next";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function LoginPage() {
  //const login = useAuthStore((state) => state.login);
  const segments = useSegments();
  const { t } = useTranslation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Get the current route
        const currentRoute = segments[segments.length - 1];
        // If we're on the member home page, go to hardware home
        if (currentRoute === MEMBER_GUEST_TABS) {
          BackHandler.exitApp(); // Exit the app
          return true;
        }

        return false;
      }
    );
    return () => backHandler.remove();
  }, [router, segments]);

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
          {t("registrationSuccessMember.pageTitle")}
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
          {t("registrationSuccessMember.blueSubTitle")}
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
          {t("registrationSuccessMember.role")}
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
          {t("registrationSuccessMember.subTitle")}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push(MEMBER_CHANNEL_REGISTRATION);
          }}
        >
          <Text style={styles.buttonText}>
            {t("registrationSuccessMember.linkText")}
          </Text>
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
