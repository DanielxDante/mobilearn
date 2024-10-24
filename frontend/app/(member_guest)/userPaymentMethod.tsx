import { View, Text, StyleSheet, BackHandler } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import { Colors } from "@/constants/colors";
import { memberGuestPaymentMethodPage as Constants } from "@/constants/textConstants";
import PaymentOptions from "@/components/PaymentOptions";
import { router, useSegments } from "expo-router";
import { MEMBER_GUEST_NAMESPACE } from "@/constants/pages";

const UserPaymentMethod = () => {
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

    const handleSelectMethod = (methodId: number) => {
        setSelectedMethod(methodId);
        console.log("Payment method: " + methodId);
    };

    const segments = useSegments();
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                console.log("Reached here!");
                // Get the current route
                const currentRoute = segments[segments.length - 2];
                console.log(currentRoute);
                // If we're on the member home page, go to hardware home
                if (currentRoute === MEMBER_GUEST_NAMESPACE) {
                    BackHandler.exitApp(); // Exit the app
                    return true;
                }

                return false;
            }
        );

        return () => backHandler.remove();
    }, [router, segments]);

    const handleContinue = () => {
        if (selectedMethod !== null) {
            console.log(`Selected Payment Method ID: ${selectedMethod}`);
            // Proceed to the next step in your payment process
        } else {
            console.log("No payment method selected");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton />
            </View>
            {/* Page body */}
            <View style={styles.body}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>{Constants.title}</Text>
                </View>
                {/* Payment types */}
                <View style={styles.paymentTypes}>
                    <PaymentOptions
                        selectedMethod={selectedMethod}
                        onSelectMethod={handleSelectMethod}
                    />
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
        marginTop: 20,
        alignItems: "center",
    },
    header: {
        color: Colors.defaultBlue,
        fontFamily: "Plus-Jakarta-Sans",
        marginLeft: 25,
        paddingBottom: 2,
        fontSize: 22,
        fontWeight: "bold",
    },
    body: {
        flex: 1,
        alignItems: "center",
    },
    titleView: {
        paddingTop: 40,
    },
    title: {
        color: Colors.defaultBlue,
        fontFamily: "Inter-SemiBold",
        fontSize: 22,
    },
    paymentTypes: {
        marginTop: 30,
    },
});

export default UserPaymentMethod;
