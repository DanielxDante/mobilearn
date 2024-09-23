import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, FlatList } from 'react-native';

import { usePaymentStore } from '@/store/paymentStore';
import BackButton from '@/components/BackButton';
import HeaderText from "@/components/HeaderText";

const PaymentTransactions = () => {
    // const { PlatformTransactions } = usePaymentStore();

    return (
        <SafeAreaView style={styles.container}>
            {/* AppBar */}
            <View style={styles.appBarContainer}>
                <BackButton 
                    style={styles.backButton}
                />
                <HeaderText
                    text={"Payment Transactions"}
                    style={styles.headerText}
                />
            </View>
            {/* <FlatList
                data={transactionData}
                renderItem={({ item }) => (
                    <TransactionItem 
                        transaction={item}
                    />
                )}
                keyExtractor={(item) => item.timestamp}
                contentContainerStyle={styles.listContainer}
            /> */}
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
    listContainer: {
        paddingHorizontal: 25,
        paddingVertical: 20,
    },
});

export default PaymentTransactions;