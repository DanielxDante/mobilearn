import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";

import { Colors } from "@/constants/colors";
import { paymentProgressBarConstants as Constants } from "@/constants/textConstants";

interface PaymentProgressBarProps {
    active: number;
}

const PaymentProgressBar: React.FC<PaymentProgressBarProps> = ({ active }) => {
    return (
        <View style={styles.progressContainer}>
            {/* Step 1 */}
            <View style={styles.circleContainer}>
                <View style={styles.progressStep}>
                    <View
                        style={
                            active === 1 ? styles.circleActive : styles.circle
                        }
                    >
                        <Text
                            style={
                                active === 1
                                    ? styles.stepText
                                    : styles.stepTextInactive
                            }
                        >
                            {Constants.stepText[0]}
                        </Text>
                    </View>
                </View>
                <Text
                    style={
                        active === 1 ? styles.stepLabelActive : styles.stepLabel
                    }
                >
                    {Constants.stepLabel[0]}
                </Text>
            </View>
            {/* Horizontal Line */}
            <View style={styles.line}></View>
            {/* Step 2 */}
            <View style={styles.circleContainer}>
                <View style={styles.progressStep}>
                    <View
                        style={
                            active === 2 ? styles.circleActive : styles.circle
                        }
                    >
                        <Text
                            style={
                                active === 2
                                    ? styles.stepText
                                    : styles.stepTextInactive
                            }
                        >
                            {Constants.stepText[1]}
                        </Text>
                    </View>
                </View>
                <Text
                    style={
                        active === 2 ? styles.stepLabelActive : styles.stepLabel
                    }
                    numberOfLines={2}
                >
                    {Constants.stepLabel[1]}
                </Text>
            </View>
            {/* Horizontal Line */}
            <View style={styles.line}></View>
            {/* Step 3 */}
            <View style={styles.circleContainer}>
                <View style={styles.progressStep}>
                    <View
                        style={
                            active === 3 ? styles.circleActive : styles.circle
                        }
                    >
                        <Text
                            style={
                                active === 3
                                    ? styles.stepText
                                    : styles.stepTextInactive
                            }
                        >
                            {Constants.stepText[2]}
                        </Text>
                    </View>
                </View>
                <Text
                    style={
                        active === 3 ? styles.stepLabelActive : styles.stepLabel
                    }
                >
                    {Constants.stepLabel[2]}
                </Text>
            </View>
        </View>
    );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    progressContainer: {
        marginBottom: 24,
        paddingHorizontal: 50,
        flexDirection: "row",
    },
    circleContainer: {
        alignItems: "center",
        width: width * 0.2,
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        gap: 20,
    },
    progressStep: {
        alignItems: "center",
    },
    circleActive: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.defaultBlue,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: Colors.defaultBlue,
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#DEDEDE",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#DEDEDE",
    },
    stepText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff", // White text for active circle
    },
    stepTextInactive: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#6C6C6C", // White text for active circle
    },
    stepLabelActive: {
        fontSize: 12,
        color: Colors.defaultBlue,
        fontWeight: "bold",
        marginTop: 4,
        textAlign: "center",
    },
    stepLabel: {
        fontSize: 12,
        color: "#B1B1B1",
        marginTop: 4,
        textAlign: "center",
    },
    line: {
        flex: 1,
        height: 2,
        backgroundColor: Colors.defaultBlue,
        marginHorizontal: 10,
        marginTop: 30,
    },
});

export default PaymentProgressBar;
