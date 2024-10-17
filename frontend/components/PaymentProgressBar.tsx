import { View, Text, StyleSheet } from "react-native";
import React from "react";

import { Colors } from "@/constants/colors";
import { paymentProgressBarConstants as Constants } from "@/constants/textConstants";

interface PaymentProgressBarProps {
    active: number;
}

const PaymentProgressBar: React.FC<PaymentProgressBarProps> = ({ active }) => {
    return (
        <View style={styles.progressContainer}>
            <View style={styles.circleContainer}>
                {/* Step 1 */}
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
                {/* Horizontal Line */}
                <View style={styles.line}></View>
                {/* Step 2 */}
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
                {/* Horizontal Line */}
                <View style={styles.line}></View>
                {/* Step 3 */}
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
            </View>
            <View style={styles.labelContainer}>
                <Text
                    style={
                        active === 1 ? styles.stepLabelActive : styles.stepLabel
                    }
                >
                    {Constants.stepLabel[0]}
                </Text>
                <Text
                    style={
                        active === 2 ? styles.stepLabelActive : styles.stepLabel
                    }
                >
                    {Constants.stepLabel[1]}
                </Text>
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

const styles = StyleSheet.create({
    progressContainer: {
        justifyContent: "center",
        marginBottom: 24,
        paddingHorizontal: 50,
        alignItems: "center",
    },
    circleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    labelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
    },
});

export default PaymentProgressBar;
