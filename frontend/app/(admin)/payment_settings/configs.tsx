import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { router } from "expo-router";

import { usePaymentStore } from '@/store/paymentStore';
import BackButton from '@/components/BackButton';
import HeaderText from "@/components/HeaderText";
import LargeButton from '@/components/LargeButton';
import InputField from '@/components/InputField';

const PaymentConfigs = () => {
    const { 
        platformAccountHolderName,
        platformBankAccountNumber,
        platformRoutingNumber,
        setPlatformAccountHolderName,
        setPlatformBankAccountNumber,
        setPlatformRoutingNumber } = usePaymentStore();

    const [accountHolderName, setAccountHolderName] = useState(platformAccountHolderName);
    const [bankAccountNumber, setBankAccountNumber] = useState(platformBankAccountNumber);
    const [routingNumber, setRoutingNumber] = useState(platformRoutingNumber);

    const handleSave = () => {
        setPlatformAccountHolderName(accountHolderName);
        setPlatformBankAccountNumber(bankAccountNumber);
        setPlatformRoutingNumber(routingNumber);
        router.back();
        console.log("Payment settings saved");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton 
                    style={styles.backButton}
                />
                <HeaderText
                    text={"Payment Configurations"}
                    style={styles.headerText}
                />
            </View>
            <View style={styles.configsContainer}>
                <InputField
                    inputTitle={"Account Holder's Name"}
                    placeholder={"Enter account holder name"}
                    value={accountHolderName}
                    onChangeText={setAccountHolderName}
                />
                <InputField
                    inputTitle={"Bank Account Number"}
                    placeholder={"Enter bank account number"}
                    value={bankAccountNumber}
                    onChangeText={setBankAccountNumber}
                />
                <InputField
                    inputTitle={"Routing Number"}
                    placeholder={"Enter routing number"}
                    value={routingNumber}
                    onChangeText={setRoutingNumber}
                />
            </View>
            <View style={styles.footerContainer}>
                <LargeButton
                    text={"SAVE"}
                    isBlue={true}
                    onPress={handleSave}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    appBarContainer: {
        flexDirection: "row",
        marginTop: 40,
        alignItems: "center",
        marginLeft: 30
    },
    backButton: {
        marginLeft: 5
    },
    headerText: {
        fontSize: 25,
        marginLeft: 20
    },
    configsContainer: {
        flexDirection: "column",
        marginTop: 30,
        marginHorizontal: 20
    },
    footerContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto",
        marginBottom: 30,
    },
});

export default PaymentConfigs;