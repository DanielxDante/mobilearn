import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    // console.log("Index page");

    useEffect(() => {
      const SCHEME = "mobilearn";
      
      const handleDeepLink = ({ url }: { url: string }) => {
        try {
          const parsedUrl = new URL(url);
          
          // Validate scheme
          if (parsedUrl.protocol !== `${SCHEME}:`) {
            throw new Error(`Invalid URL scheme. Expected ${SCHEME}://`);
          }
          
          // Remove leading slash if present
          const path = parsedUrl.pathname.replace(/^\/+/, '');
          
          if (path === "reset-password") {
            const token = parsedUrl.searchParams.get("token");
            
            if (!token) {
              throw new Error("Reset password token is missing");
            }
            
            router.push({
              pathname: "/shared/newPassword",
              params: { token }
            });
          }
        } catch (error) {
          console.error("Deep link error:", error);
          // Add appropriate error handling (e.g., show toast/alert)
        }
      };
    
      const handleInitialURL = async () => {
        try {
          const url = await Linking.getInitialURL();
          if (url) {
            console.log("Initial URL:", url);
            handleDeepLink({ url });
          }
        } catch (error) {
          console.error("Initial URL error:", error);
        }
      };
    
      handleInitialURL();
      const linkListener = Linking.addEventListener("url", handleDeepLink);
      
      return () => linkListener.remove();
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
