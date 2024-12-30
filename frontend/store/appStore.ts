import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from "axios";

import {
    PAYMENT_STRIPE_FETCH_PAYMENT_SHEET_URL
} from "@/constants/routes";

export interface AppState {
    fetchPaymentSheet: (amount: string, currency: string) => Promise<{
        payment_intent: string;
        ephemeral_key: string;
        customer_id: string;
    }>;
};

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            fetchPaymentSheet: async (amount, currency) => {
                console.log("Fetching donation payment sheet...");
                try {
                    const response = await axios.post(
                        PAYMENT_STRIPE_FETCH_PAYMENT_SHEET_URL,
                        { amount, currency },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    
                    const responseData = response.data;

                    return {
                        payment_intent: responseData.payment_intent,
                        ephemeral_key: responseData.ephemeral_key,
                        customer_id: responseData.customer_id,
                    };
                } catch (error) {
                    console.log("Unexpected error has occurred. Error: ", error);
                    throw new Error("Unexpected error has occurred.");
                }
            }
        }),
        {
            name: "app-store",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAppStore;