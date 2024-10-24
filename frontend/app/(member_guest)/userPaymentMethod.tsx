import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import { Colors } from "@/constants/colors";
import { memberGuestPaymentMethodPage as Constants } from "@/constants/textConstants";
import PaymentOptions from "@/components/PaymentOptions";

const UserPaymentMethod = () => {
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

    const handleSelectMethod = (methodId: number) => {
        setSelectedMethod(methodId);
        console.log("Payment method: " + methodId);
    };

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
