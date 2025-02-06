import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const handleDeepLink = ({ url }: { url: string }) => {
        try {
            const urlParts = url.split("://");
            const path = urlParts[1].split("?")[0];
            const queryParams = new URLSearchParams(urlParts[1].split("?")[1]);
            
            console.log("Full path:", path);
            console.log("Token:", queryParams.get("token"));
        
            if (path === "reset-password") {
            const token = queryParams.get("token");
            if (!token) throw new Error("Missing token");
            setIsLoading(false);
            router.replace({
                pathname: "/shared/newPassword",
                params: { token }
            }); // Redirect to the login page
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
            } else {
              // If there's no deep link, continue to normal flow
              setTimeout(() => {
                setIsLoading(false);
                router.push("/shared/carouselPage"); // Redirect to the carousel page after 2 seconds
              }, 2000); // Adjust the timeout as needed
            }
          };
      
          getInitialUrl(); // Get deep link URL on app start
      
          // Listen for deep link events when the app is already running
          const deepLinkListener = Linking.addEventListener("url", (event) => {
            handleDeepLink({ url: event.url });
          });
      
          return () => {
            // Clean up the listener when the component unmounts
            deepLinkListener.remove();
          };
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
