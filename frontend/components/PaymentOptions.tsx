import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";

import Payment from "@/types/shared/Payment";
import { paymentData } from "@/constants/temporaryPayment";
import { Colors } from "@/constants/colors";

interface PaymentOptionsProps {
    selectedMethod: number | null;
    onSelectMethod: (id: number) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
    selectedMethod,
    onSelectMethod,
}) => {
    return (
        <View>
            {paymentData.map((method) => (
                <TouchableOpacity
                    key={method.id}
                    style={styles.option}
                    onPress={() => onSelectMethod(method.id)}
                >
                    <View style={styles.radioContainer}>
                        <View
                            style={[
                                styles.radioCircle,
                                selectedMethod === method.id &&
                                    styles.selectedCircle,
                            ]}
                        />
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={styles.methodName}>{method.name}</Text>
                        <View style={styles.logos}>
                            {method.logos.map((logo, index) => (
                                <View key={index} style={styles.logoContainer}>
                                    <Image source={logo} style={styles.logo} />
                                </View>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    option: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
    },
    radioContainer: {
        marginRight: 10,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.defaultBlue,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedCircle: {
        backgroundColor: Colors.defaultBlue,
    },
    optionContent: {
        alignItems: "flex-start",
    },
    logos: {
        flexDirection: "row",
    },
    logoContainer: {
        padding: 5,
        borderWidth: 1,
        borderColor: "#D9D9D9",
        marginHorizontal: 4,
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    logo: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    methodName: {
        fontSize: 13,
        fontFamily: "Inter-Regular",
        color: "#6C6C6C",
        marginBottom: 5,
    },
});

export default PaymentOptions;
