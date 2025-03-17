import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageSelectionPage = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageSelect = async (language: string) => {
    // Save the selected language to AsyncStorage
    await AsyncStorage.setItem("userLanguage", language);
    // Set the app's language
    i18n.changeLanguage(language);
    // Navigate to the main app
    router.replace("/shared/carouselPage"); // Replace with your main app route
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("languageSelection.title")}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLanguageSelect("en")}
      >
        <Text style={styles.buttonText}>{t("languageSelection.english")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLanguageSelect("cn")}
      >
        <Text style={styles.buttonText}>{t("languageSelection.chinese")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#356FC5",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LanguageSelectionPage;
