import React from "react";

const StripeCheckoutFormButton = () => {
    return (
        <TouchableOpacity 
            style={[
                styles.donateButton, 
                donateButtonDisabled && { backgroundColor: Colors.Gray }
            ]}
            onPress={() => {
                const donationAmount = parseFloat(amount);
                console.log(`Donating $${donationAmount} with note: ${noteText}`);
                
            }}
            disabled={donateButtonDisabled}
        >
            <Text style={styles.donateButtonText}>
                {Constants.donateButtonText}
            </Text>
        </TouchableOpacity>
    );
}

export default StripeCheckoutFormButton;