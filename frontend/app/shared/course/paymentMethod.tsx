import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import { Colors } from "@/constants/colors";
import PaymentOptions from "@/components/PaymentOptions";
import PaymentProgressBar from "@/components/PaymentProgressBar";
import { router, useLocalSearchParams } from "expo-router";
import Course from "@/types/shared/Course/Course";
import { paymentMethodConstants as Constants } from "@/constants/textConstants";

const PaymentMethod = () => {
    // CONSTANTS TO BE USED UNTIL COURSE DATA IS FINALISED
    const price = 35;

    const { courseSelected } = useLocalSearchParams();
    const course: Course =
        typeof courseSelected === "string" ? JSON.parse(courseSelected) : [];

    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

    const handleSelectMethod = (methodId: number) => {
        setSelectedMethod(methodId);
    };

    const handleContinue = () => {
        if (selectedMethod !== null) {
            console.log(`Selected Payment Method ID: ${selectedMethod}`);
            router.push({
                pathname: "./paymentCardDetails",
                params: {
                    courseSelected: courseSelected,
                    paymentSelected: selectedMethod,
                },
            });
            // Proceed to the next step in your payment process
        } else {
            console.log("No payment method selected");
        }
    };

    const isPaymentSelected = () => {
        return selectedMethod !== null;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton />
            </View>
            <ScrollView>
                {/* Progress Bar */}
                <PaymentProgressBar active={2} />
                {/* Page body */}
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
                {/* Price section */}
                <View style={styles.priceContainer}>
                    <View style={styles.priceContainerLeft}>
                        <Image
                            source={Constants.dollarIcon}
                            style={styles.dollarIcon}
                        />
                        <Text style={styles.totalPrice}>
                            {"  "}
                            {Constants.totalPrice}
                        </Text>
                    </View>
                    <Text style={styles.totalPrice}>
                        {price}
                        {Constants.currency}
                    </Text>
                </View>
                {/* Horizontal line */}
                <View style={styles.horizontalLine}></View>
                {/* Continue Button */}
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    disabled={!isPaymentSelected()}
                >
                    <Text style={styles.continueText}>
                        {Constants.continueButton}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    appBarContainer: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 30,
        alignItems: "center",
    },
    titleView: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    title: {
        color: Colors.defaultBlue,
        fontFamily: "Inter-SemiBold",
        fontSize: 22,
    },
    paymentTypes: {
        marginTop: 30,
        marginHorizontal: 20,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 80,
        marginHorizontal: 20,
        marginBottom: 10,
    },
    priceContainerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    dollarIcon: {
        height: 20,
        width: 20,
        resizeMode: "contain",
    },
    totalPrice: {
        fontSize: 15,
        fontFamily: "Inter-SemiBold",
        color: Colors.defaultBlue,
    },
    horizontalLine: {
        borderWidth: 1,
        width: width * 0.9,
        alignSelf: "center",
        borderColor: "#DEDEDE",
    },
    continueButton: {
        height: 50,
        width: width * 0.8,
        backgroundColor: Colors.defaultBlue,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
        borderRadius: 8,
    },
    continueText: {
        fontSize: 15,
        fontFamily: "Inter-Regular",
        color: "#EFEFEF",
    },
});

export default PaymentMethod;
