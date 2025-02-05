import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    // console.log("Index page");

    useEffect(() => {
        // Check for deep link on app load
        const handleDeepLink = ({ url }: { url: string }) => {
          try {
            const { pathname, searchParams } = new URL(url);  // Use URL constructor to handle deep link
            if (pathname === "/reset-password") {
              const token = searchParams.get("token");
              if (token) {
                router.push({
                  pathname: "/shared/newPassword",
                  params: { token: token },
                });
              }
            }
          } catch (error) {
            console.log("Error handling deep link:", error);
          }
        };
    
        const linkListener = Linking.addEventListener("url", handleDeepLink);
    
        // Check if the app was opened via a deep link
        Linking.getInitialURL().then((url) => {
          if (url) {
            console.log(url)
            handleDeepLink({ url });
          }
        });
    
        return () => {
          linkListener.remove();
        };
      }, [router]);

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
