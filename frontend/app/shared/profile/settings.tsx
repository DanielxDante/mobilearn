import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "@/components/BackButton";
import { router } from "expo-router";

const SettingsPage = () => {
  const { t, i18n } = useTranslation();

  // Function to toggle between English and Chinese
  const toggleLanguage = async () => {
    const newLanguage = i18n.language === "en" ? "cn" : "en";
    await i18n.changeLanguage(newLanguage);
    await AsyncStorage.setItem("userLanguage", newLanguage); // Save the selected language
  };

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.header}>{t("settings.title")}</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.upperBody}>
          {/* Language Section */}
          <View style={styles.languageSection}>
            <Text style={styles.title}>{t("settings.changeLanguage")}</Text>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={toggleLanguage}
            >
              <Text style={styles.languageButtonText}>
                {i18n.language === "en" ? "EN" : "英文"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  appBarContainer: {
    flexDirection: "row",
    marginTop: 40,
    alignItems: "center",
  },
  header: {
    color: "#356FC5", // Colors.defaultBlue
    fontFamily: "Plus-Jakarta-Sans",
    marginLeft: 25,
    paddingBottom: 2,
    fontSize: 22,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 30,
  },
  upperBody: {
    marginHorizontal: 30,
  },
  languageSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: "#6C6C6C",
  },
  languageButton: {
    backgroundColor: "#356FC5", // Colors.defaultBlue
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  languageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-Regular",
    fontWeight: "bold",
  },
});

export default SettingsPage;
