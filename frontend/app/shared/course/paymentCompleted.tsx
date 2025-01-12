import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import { Colors } from "@/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { paymentCompletedConstants as Constants } from "@/constants/textConstants";

const PaymentCompleted = () => {
    // CONSTANTS TO BE USED UNTIL COURSE DATA IS FINALISED

    const { courseId } = useLocalSearchParams();
    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton />
            </View>
            <ScrollView>
                {/* Page body */}
                <Image
                    source={Constants.completePurchase}
                    style={styles.completePurchaseImage}
                />
                <Image
                    source={Constants.completePurchaseSlide}
                    style={styles.completePurchaseSlide}
                />
                <Text style={styles.congratulations}>
                    {Constants.congratulations}
                </Text>
                <Text style={styles.congratulationSubtext}>
                    {Constants.congratulationSubtext}
                </Text>
                {/* Continue Button */}
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => {
                        console.log("Going to courseContent now!");
                        router.push({
                            pathname: "./courseContent",
                            params: {
                                courseId: courseId,
                            },
                        })
                    }
                    }
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
    title: {
        color: Colors.defaultBlue,
        fontFamily: "Inter-SemiBold",
        fontSize: 22,
    },
    completePurchaseImage: {
        marginTop: 10,
        marginBottom: 40,
        height: 61,
        width: 60,
        padding: 10,
        alignSelf: "center",
    },
    completePurchaseSlide: {
        height: 250,
        width: 295,
        alignSelf: "center",
        marginBottom: 30,
    },
    congratulations: {
        color: "#00154C",
        fontFamily: "Inter-SemiBold",
        fontSize: 25,
        alignSelf: "center",
    },
    congratulationSubtext: {
        color: "#00154C",
        fontFamily: "Inter-SemiBold",
        fontSize: 18,
        alignSelf: "center",
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

export default PaymentCompleted;
