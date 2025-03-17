import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import LanguageSelectionPage from "./shared/languageSelectionPage";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);

  useEffect(() => {
    const checkLanguage = async () => {
      const userLanguage = await AsyncStorage.getItem("userLanguage");
      if (userLanguage) {
        // User has already selected a language, navigate to the main app
        router.replace("/shared/carouselPage"); // Replace with your main app route
      } else {
        // Show the language selection page
        setShowLanguageSelection(true);
      }
      setIsLoading(false);
    };

    //clear the async storage
    //AsyncStorage.removeItem("userLanguage");

    checkLanguage();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#356FC5" />
      </View>
    );
  }

  if (showLanguageSelection) {
    return <LanguageSelectionPage />;
  }

  return null; // Or your main app component
};

export default App;
