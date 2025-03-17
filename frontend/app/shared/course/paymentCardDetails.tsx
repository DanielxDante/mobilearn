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
import PaymentProgressBar from "@/components/PaymentProgressBar";
import { router, useLocalSearchParams } from "expo-router";
import Course from "@/types/shared/Course/Course";
import { paymentCardDetailsConstants as Constants } from "@/constants/textConstants";
import PaymentInputField from "@/components/PaymentInputField";
import { useTranslation } from "react-i18next";

const PaymentCardDetails = () => {
  // CONSTANTS TO BE USED UNTIL COURSE DATA IS FINALISED
  const price = 35;

  // CREDIT CARD CONST
  const CARDNUMBERLENGTH = 19;
  const CVVLENGTH = 3;
  const EXPIRYDATELENGTH = 5;
  const NAMELENGTHMAXIMUM = 50;

  const { courseSelected, paymentSelected } = useLocalSearchParams();
  const course: Course =
    typeof courseSelected === "string" ? JSON.parse(courseSelected) : [];

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (paymentSelected !== null) {
      // INSERT PAYMENT API CALL HERE
      console.log(`Payment made with Payment Method ID: ${paymentSelected}`);
      router.push({
        pathname: "./paymentCompleted",
        params: {
          courseSelected: courseSelected,
        },
      });
      // Proceed to the next step in your payment process
    } else {
      console.log("Payment not made");
    }
  };

  const isFormValid = () => {
    return (
      cardNumber.length === CARDNUMBERLENGTH &&
      cvv.length === CVVLENGTH &&
      expiryDate.length == EXPIRYDATELENGTH &&
      name.length <= NAMELENGTHMAXIMUM &&
      name.length > 0
    );
  };

  const { t } = useTranslation();

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
          <Text style={styles.title}>
            {t("paymentCardDetailsConstants.title")}
          </Text>
        </View>
        {/* Card details */}
        <View style={styles.cardDetailsContainer}>
          <PaymentInputField
            placeholder={t("paymentCardDetailsConstants.cardNumberPlaceholder")}
            maxLength={CARDNUMBERLENGTH}
            isCardNumber={true}
            onChangeText={setCardNumber}
          />
          <View style={styles.cardSecondRow}>
            <PaymentInputField
              placeholder={t(
                "paymentCardDetailsConstants.cvvNumberPlaceholder"
              )}
              secureTextEntry={true}
              maxLength={CVVLENGTH}
              numbersOnly={true}
              onChangeText={setCvv}
            />
            <PaymentInputField
              placeholder={t(
                "paymentCardDetailsConstants.expiryDatePlaceholder"
              )}
              maxLength={EXPIRYDATELENGTH}
              isExpiryDate={true}
              onChangeText={setExpiryDate}
            />
          </View>
          <PaymentInputField
            placeholder={t("paymentCardDetailsConstants.namePlaceholder")}
            maxLength={NAMELENGTHMAXIMUM}
            numbersOnly={false}
            onChangeText={setName}
          />
          <Text style={styles.disclaimer}>
            {t("paymentCardDetailsConstants.disclaimer")}
          </Text>
        </View>
        {/* Price section */}
        <View style={styles.priceContainer}>
          <View style={styles.priceContainerLeft}>
            <Image source={Constants.dollarIcon} style={styles.dollarIcon} />
            <Text style={styles.totalPrice}>
              {"  "}
              {t("paymentCardDetailsConstants.totalPrice")}
            </Text>
          </View>
          <Text style={styles.totalPrice}>
            {price}
            {t("paymentCardDetailsConstants.currency")}
          </Text>
        </View>
        {/* Horizontal line */}
        <View style={styles.horizontalLine}></View>
        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={!isFormValid()}
        >
          <Text style={styles.continueText}>
            {t("paymentCardDetailsConstants.continueButton")}
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
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    color: Colors.defaultBlue,
    fontFamily: "Inter-SemiBold",
    fontSize: 22,
  },
  cardDetailsContainer: {
    marginHorizontal: 20,
  },
  cardSecondRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  disclaimer: {
    fontFamily: "Inter-Regular",
    fontSize: 10,
    color: "#6C6C6C",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
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

export default PaymentCardDetails;
