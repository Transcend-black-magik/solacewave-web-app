import React from "react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";

const FlutterwaveButtonWrapper = ({ customerName, customerEmail, customerCountry, amount, currency, onSuccess }) => {
  const config = {
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: `tx-${Date.now()}`,
    amount,
    currency,
    payment_options: "card,ussd,banktransfer",
    customer: {
      email: customerEmail,
      name: customerName,
      phonenumber: "",
      country: customerCountry || "NG",
    },
    customizations: {
      title: "Therapy Payment",
      description: "Payment for your selected therapy plan",
    },
    callback: (response) => {
      onSuccess(response);
      closePaymentModal(); 
    },
    onClose: () => {},
  };

  return <FlutterWaveButton {...config} className="checkout-btn" />;
};

export default FlutterwaveButtonWrapper;
