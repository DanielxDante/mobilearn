import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { resetPasswordAwait as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import useAuthStore from "@/store/authStore";
import { useTranslation } from "react-i18next";

const ResetPasswordAwait = () => {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email: string }>();
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
      <View style={styles.body}>
        {/* Title */}
        <Text style={styles.title}>
          {t("resetPasswordAwait.title")}
        </Text>
        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            {t("resetPasswordAwait.subtitle1")}
            <Text style={{ fontWeight: "800" }}>{email}</Text>
            {t("resetPasswordAwait.subtitle2")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  title: {
    fontFamily: "Inter-Regular",
    fontSize: 24,
    color: Colors.defaultBlue,
    paddingTop: 50,
    paddingBottom: 20,
  },
  subtitleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    color: "#6C6C6C",
  },
});

export default ResetPasswordAwait;
