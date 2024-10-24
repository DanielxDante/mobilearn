import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { paymentOverviewConstants as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import BackButton from "@/components/BackButton";
import PaymentProgressBar from "@/components/PaymentProgressBar";

interface PaymentOverviewProps {}

const PaymentOverview = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton />
            </View>
            {/* Progress Bar */}
            <PaymentProgressBar active={1} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appBarContainer: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 30,
        alignItems: "center",
    },
});

export default PaymentOverview;
