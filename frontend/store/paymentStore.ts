import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from "axios";

export interface PaymentState {
    platformAccountHolderName: string,
    platformBankAccountNumber: string,
    platformRoutingNumber: string,
    setPlatformAccountHolderName: (accountHolderName: string) => Promise<void>,
    setPlatformBankAccountNumber: (bankAccountNumber: string) => Promise<void>,
    setPlatformRoutingNumber: (routingNumber: string) => Promise<void>,
    
};

export const usePaymentStore = create<PaymentState>()(
    persist(
        (set) => ({
            platformAccountHolderName: "",
            platformBankAccountNumber: "",
            platformRoutingNumber: "",
            // TODO: set these payment stores in backend
            setPlatformAccountHolderName: async (accountHolderName) => {
                set({ platformAccountHolderName: accountHolderName });
            },
            setPlatformBankAccountNumber: async (bankAccountNumber) => {
                set({ platformBankAccountNumber: bankAccountNumber });
            },
            setPlatformRoutingNumber: async (routingNumber) => {
                set({ platformRoutingNumber: routingNumber });
            }
        }),
        {
            name: "payment-store",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);