import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from "axios";

export interface AdminState {
    platformAccountHolderName: string,
    platformBankAccountNumber: string,
    platformRoutingNumber: string,
    setPlatformAccountHolderName: (accountHolderName: string) => Promise<void>,
    setPlatformBankAccountNumber: (bankAccountNumber: string) => Promise<void>,
    setPlatformRoutingNumber: (routingNumber: string) => Promise<void>,
    
    recommenderSystemFeature: boolean,
    setRecommenderSystemFeature: (isEnabled: boolean) => Promise<void>,
    instructorAnalyticsFeature: boolean,
    setInstructorAnalyticsFeature: (isEnabled: boolean) => Promise<void>,
};

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            platformAccountHolderName: "",
            platformBankAccountNumber: "",
            platformRoutingNumber: "",
            // TODO: set these admin stores in backend
            setPlatformAccountHolderName: async (accountHolderName) => {
                set({ platformAccountHolderName: accountHolderName });
            },
            setPlatformBankAccountNumber: async (bankAccountNumber) => {
                set({ platformBankAccountNumber: bankAccountNumber });
            },
            setPlatformRoutingNumber: async (routingNumber) => {
                set({ platformRoutingNumber: routingNumber });
            },
            recommenderSystemFeature: false,
            setRecommenderSystemFeature: async (isEnabled) => {
                set({ recommenderSystemFeature: isEnabled });
            },
            instructorAnalyticsFeature: false,
            setInstructorAnalyticsFeature: async (isEnabled) => {
                set({ instructorAnalyticsFeature: isEnabled });
            },
        }),
        {
            name: "admin-store",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);