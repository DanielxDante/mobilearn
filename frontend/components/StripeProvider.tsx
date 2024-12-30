import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import * as Linking from "expo-linking";

const merchantId = Constants.expoConfig?.plugins?.find(
    (p) => p[0] === "@stripe/stripe-react-native"
)?.[1]?.merchantIdentifier;

const publishableKey = Constants.expoConfig?.plugins?.find(
    (p) => p[0] === "@stripe/stripe-react-native"
)?.[1]?.publishableKey; 

if (!merchantId || !publishableKey) {
    throw new Error("Stripe environment variable(s) not found");
}

const ExpoStripeProvider = (
    props: Omit<
        React.ComponentProps<typeof StripeProvider>,
        "publishableKey" | "merchantIdentifier"
    >
) => {
    return (
        <StripeProvider
            publishableKey={publishableKey}
            merchantIdentifier={merchantId}
            urlScheme={Linking.createURL("/")?.split(":")[0]}
            {...props}
        />
    )
};

export default ExpoStripeProvider;