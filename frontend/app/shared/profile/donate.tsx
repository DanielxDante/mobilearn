import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStripe } from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { router } from "expo-router";

import useAppStore from "@/store/appStore";
import useAuthStore from "@/store/authStore";
import BackButton from "@/components/BackButton";
import { memberDonatePage as Constants } from "@/constants/textConstants";
import { Colors } from "@/constants/colors";
import { sendNotification } from "@/components/notificationUtils";
import { usePushNotifications } from "@/hooks/usePushNotificationState";

const Donate = () => {
  const name = useAuthStore((state) => state.username);
  const email = useAuthStore((state) => state.email);
  const fetchStripePaymentSheet = useAppStore(
    (state) => state.fetchPaymentSheet
  );

  const scrollViewRef = React.useRef<ScrollView>(null);
  const [amount, setAmount] = useState("");
  const [noteText, setNoteText] = useState("");
  const [donateButtonDisabled, setDonateButtonDisabled] = useState(true);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const { expoPushToken, notification } = usePushNotifications();

  const handlePayment = async (
    donationAmount: number,
    default_currency: string
  ) => {
    setLoading(true);
    try {
      const { payment_intent, ephemeral_key, customer_id } =
        await fetchStripePaymentSheet(
          donationAmount.toString(),
          default_currency
        );
      await initPaymentSheet({
        merchantDisplayName: Constants.merchantDisplayName,

        customerId: customer_id,
        customerEphemeralKeySecret: ephemeral_key,
        paymentIntentClientSecret: payment_intent,

        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: name,
          email: email,
        },
        returnURL: Linking.createURL("stripe-redirect"),

        // Enable Apple Pay
        applePay: {
          merchantCountryCode: "SG",
        },
      });
      const { error } = await presentPaymentSheet();
      if (error) {
        Alert.alert(Constants.paymentCancelledAlert);
      } else {
        Alert.alert(Constants.paymentSuccessAlert);

        if (expoPushToken) {
          try {
            await sendNotification(
              expoPushToken.data,
              Constants.donationSuccessful,
              `${Constants.yourDonationMessage}${amount}`
            );
          } catch {
            console.log(error);
          }
        } else {
        }
        router.back();
      }
    } catch (error) {
      Alert.alert(Constants.error, Constants.donationErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBarContainer}>
        <BackButton />
        <Text style={styles.header}>{Constants.appBarTitle}</Text>
      </View>
      <ScrollView ref={scrollViewRef}>
        <View style={styles.body}>
          <View style={styles.upperBody}>
            <Image
              source={require("@/assets/images/member_guest_images/donate.png")}
            />
            <Text style={styles.donateText}>{Constants.donateText1}</Text>
            <Text style={styles.donateText}>{Constants.donateText2}</Text>
          </View>
          <View style={styles.lowerBody}>
            <View style={styles.donateInputContainer}>
              <Text style={styles.dollarSignLabel}>$</Text>
              <TextInput
                style={styles.donateAmountInput}
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                  const formattedText = text.replace(/[^0-9.]/g, "");
                  const decimalIndex = formattedText.indexOf(".");
                  if (decimalIndex >= 0) {
                    const integerPart = formattedText.slice(0, decimalIndex);
                    const decimalPart = formattedText.slice(
                      decimalIndex + 1,
                      decimalIndex + 3
                    );
                    setAmount(`${integerPart}.${decimalPart}`);
                  } else {
                    setAmount(formattedText);
                  }
                  setDonateButtonDisabled(
                    !formattedText || parseFloat(formattedText) <= 0
                  );
                }}
                placeholder="0"
                maxLength={10}
                onFocus={() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }}
              />
            </View>
            <TextInput
              style={styles.donateNoteInput}
              multiline
              numberOfLines={4}
              placeholder="Enter a note (optional)"
              placeholderTextColor={Colors.darkGray}
              onChangeText={(text) => setNoteText(text)}
            />
            <TouchableOpacity
              style={[
                styles.donateButton,
                donateButtonDisabled && { backgroundColor: Colors.Gray },
              ]}
              onPress={() => {
                const donationAmount = parseFloat(amount);
                const default_currency = "SGD";
                handlePayment(donationAmount, default_currency);
              }}
              disabled={donateButtonDisabled}
            >
              <Text style={styles.donateButtonText}>
                {Constants.donateButtonText}
              </Text>
            </TouchableOpacity>
            {loading && (
              <ActivityIndicator
                size="large"
                color={Colors.defaultBlue}
                style={styles.spinner}
              />
            )}
          </View>
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingTop: 30,
  },
  upperBody: {
    alignItems: "center",
    marginHorizontal: 30,
  },
  lowerBody: {
    marginHorizontal: 20,
  },
  donateText: {
    fontFamily: "Inter-Regular",
    color: Colors.defaultBlue,
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  donateButton: {
    backgroundColor: Colors.defaultBlue,
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  donateButtonText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#DEDEDE",
  },
  dollarSignLabel: {
    fontSize: 60,
    fontFamily: "Inter-Regular",
    color: Colors.darkGray,
  },
  donateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  donateAmountInput: {
    fontSize: 60,
    fontFamily: "Inter-Regular",
    color: Colors.darkGray,
    textAlign: "left",
  },
  donateNoteInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: Colors.darkGray,
    marginLeft: 20,
  },
  spinner: {
    marginTop: 20,
  },
});

export default Donate;
