import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      router.push("/shared/loginPage"); // Redirect to the login page
    }, 2000); // Adjust the timeout as needed
  }, [router]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return null;
}
