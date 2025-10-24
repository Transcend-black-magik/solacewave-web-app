import React from "react";
import { usePaystackPayment } from "react-paystack";

const PaystackButton = ({
  email,
  amount,
  currency = "NGN",
  channels = ["card"],
  publicKey,
  onSuccess,
  onClose,
  metadata = {},
}) => {
  // Convert to smallest currency unit (kobo/cents)
  const convertedAmount = Math.round(parseFloat(amount) * 100);

  // Automatically allow extra payment methods for NGN users
  const allowedChannels =
    currency === "NGN"
      ? ["card", "bank", "bank_transfer", "ussd"]
      : ["card"];

  const config = {
    reference: `${Date.now()}`,
    email,
    amount: convertedAmount,
    currency,
    channels: allowedChannels,
    publicKey,
    metadata,
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <button
      onClick={() => initializePayment(onSuccess, onClose)}
      className="btn-paystack-branded"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "#3BB75E",
        border: "none",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "15px",
        transition: "all 0.2s ease",
      }}
    >
      <img
        src="https://assets.paystack.com/assets/img/hero/Paystack-mark-white-twitter.png"
        alt="Paystack"
        className="paystack-logo"
        style={{ width: "22px", height: "22px" }}
      />
      <span>
        Pay with Paystack {currency === "NGN" ? "(Card / Transfer / USSD)" : ""}
      </span>
    </button>
  );
};

export default PaystackButton;
