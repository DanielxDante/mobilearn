import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      setTimeout(() => {
          setIsLoading(false);
          router.push("/shared/carouselPage"); // Redirect to the login page
      }, 2000); // Adjust the timeout as needed
  }, [router]);
  
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
