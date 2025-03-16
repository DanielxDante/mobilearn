import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";

import { newPasswordPage as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import useAuthStore from "@/store/authStore";
import { useTranslation } from "react-i18next";

const newPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const resetPassword = useAuthStore((state) => state.resetPasswordUser);
  const { t } = useTranslation();

  const handleDeepLink = ({ url }: { url: string }) => {
    try {
      const { pathname, searchParams } = new URL(url);

      if (pathname === "/shared/newPassword") {
        const linkToken = searchParams.get("token");
        if (linkToken) {
          setToken(linkToken);
        }
        if (!linkToken) throw new Error("Missing token");
      }
    } catch (error) {
      console.error("Deep link error:", error);
    }
  };

  useEffect(() => {
    const getInitialUrl = async () => {
      let initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
      setIsLoading(false);
    };

    getInitialUrl();
  }, []);

  const handlePasswordSubmit = async () => {
    if (password.length === 0) {
      alert(t("newPasswordPage.emptyPassword"));
    } else if (password != confirmPassword) {
      alert(t("newPasswordPage.differentPassword"));
    } else {
      const response = await resetPassword(token, password);
      if (response === "Password successfully reset") {
        Alert.alert(
          t("newPasswordPage.success"),
          t("newPasswordPage.passwordChanged"),
          [
            {
              text: t("newPasswordPage.ok"),
              onPress: () => {
                router.replace("/shared/carouselPage");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        alert(t("newPasswordPage.error"));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Image source={Constants.backButton} style={styles.backButton} />
        </TouchableOpacity>
      </View>
      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title}>{t("newPasswordPage.title")}</Text>
        {/* Password input */}
        <TextInput
          secureTextEntry={true}
          autoCapitalize="none"
          style={styles.inputField}
          onChangeText={setPassword}
          placeholder={t("newPasswordPage.placeholder1")}
        />
        <TextInput
          secureTextEntry={true}
          autoCapitalize="none"
          style={styles.inputField}
          onChangeText={setConfirmPassword}
          placeholder={t("newPasswordPage.placeholder2")}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handlePasswordSubmit}
        >
          <Text style={styles.submitButtonText}>
            {t("newPasswordPage.submitButton")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  appBarContainer: {
    flexDirection: "row",
    marginVertical: 20,
    alignItems: "center",
  },
  backButton: {
    height: 25,
    width: 25,
    marginLeft: 25,
    padding: 5,
  },
  body: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: 24,
    color: Colors.defaultBlue,
    paddingTop: 70,
    paddingBottom: 30,
  },
  inputField: {
    borderWidth: 2,
    borderColor: "#356FC5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    width: "100%",
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: Colors.defaultBlue,
    paddingVertical: 12,
    borderRadius: 5,
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  submitButtonText: {
    color: "#FFFFFF",
  },
});

export default newPassword;
