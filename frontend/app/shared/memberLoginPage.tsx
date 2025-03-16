import React, { useState } from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import SignInButton from "@/components/Button";
import InputField from "@/components/InputField";
import mobilearnHat from "@/assets/images/MobilearnHat.png";
import useAuthStore from "@/store/authStore";
import { memberLoginPageConstants as Constants } from "@/constants/textConstants";
import {
  ADMIN_HOME,
  MEMBER_SIGNUP_PAGE,
  MEMBER_CHANNEL_REGISTRATION,
  MEMBER_RESET_PASSWORD_PAGE,
} from "@/constants/pages";
import InputDropDownField from "@/components/InputDropDownField";
import { Colors } from "@/constants/colors";
import { useTranslation } from "react-i18next";

const { height, width } = Dimensions.get("window"); // Get the screen width

export default function LoginPage() {
  const login = useAuthStore((state) => state.loginUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("member");
  const { t } = useTranslation();

  const handleSignIn = async () => {
    if (email.length === 0 || password.length === 0) {
      alert(t("memberLoginPageConstants.inputsEmptyAlert"));
    } else {
      try {
        const response = await login(email.toLowerCase(), password);

        if (response === "normal" || response === "core_member") {
          router.push(MEMBER_CHANNEL_REGISTRATION);
        } else if (response === "User disabled") {
          alert(t("memberLoginPageConstants.accountDisabledAlert"));
        } else if (response === "Invalid credentials") {
          alert(t("memberLoginPageConstants.invalidCredentialsAlert"));
        } else if (response === "admin") {
          router.push(ADMIN_HOME);
        }
      } catch (error) {
        console.log(error);
        alert(t("memberLoginPageConstants.errorSigningUpAlert"));
      }
    }
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
        <Image
          source={mobilearnHat}
          style={{
            width: 128,
            height: 96,
          }}
          resizeMode="contain" // Adjust as needed
        />
        <Text
          style={{
            fontSize: 36,
            color: "#356FC5",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {t("memberLoginPageConstants.pageTitle")}
        </Text>
        <Text
          style={{
            color: "#6C6C6C",
            textAlign: "center",
            marginBottom: 16,
            maxWidth: 0.8 * width,
          }}
        >
          {t("memberLoginPageConstants.pageSubTitle")}
        </Text>
      </View>
      <View style={{ width: "100%" }}>
        <InputField
          inputTitle={t("memberLoginPageConstants.fields.0.inputTitle")}
          placeholder={t("memberLoginPageConstants.fields.0.placeHolder") || ""}
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          inputTitle={t("memberLoginPageConstants.fields.1.inputTitle")}
          placeholder={t("memberLoginPageConstants.fields.1.placeHolder") || ""}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <View
          style={{
            marginTop: -10,
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/shared/resetPasswordPage")}
          >
            <Text
              style={{ color: Colors.defaultBlue, fontFamily: "Inter-Regular" }}
            >
              {t("memberLoginPageConstants.forgotPassword")}
            </Text>
          </TouchableOpacity>
        </View>
        <SignInButton
          text={t("memberLoginPageConstants.signInButtonText")}
          onPress={handleSignIn}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <Text
            style={{
              paddingRight: 3,
            }}
          >
            {t("memberLoginPageConstants.dontHaveAccountText")}
          </Text>
          <Link
            style={{ color: Colors.darkerBlue }}
            href={{ pathname: MEMBER_SIGNUP_PAGE }}
          >
            {t("memberLoginPageConstants.signUpText")}
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
