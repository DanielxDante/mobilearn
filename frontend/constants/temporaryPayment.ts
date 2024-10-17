import temporaryImages from "@/constants/temporaryImages";
import Payment from "@/types/shared/Payment";

export const paymentData: Payment[] = [
    {
        id: 1,
        name: "Credit / Debit Card",
        logos: [temporaryImages.visa, temporaryImages.master, temporaryImages.paypal, temporaryImages.maestro]
    },
    {
        id: 2,
        name: "Alipay",
        logos: [temporaryImages.visa],
    }
]