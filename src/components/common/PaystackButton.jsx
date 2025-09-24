import React from "react";
import { usePaystackPayment } from "react-paystack";

const PaystackButton = ({ email, amount, publicKey, onSuccess, onClose }) => {
  const initializePayment = usePaystackPayment({
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100,
    publicKey,
  });

  return (
    <button onClick={() => initializePayment(onSuccess, onClose)} className="btn-paystack-branded">
      <img
        src="https://assets.paystack.com/assets/img/hero/Paystack-mark-white-twitter.png"
        alt="Paystack"
        className="paystack-logo"
      />
      <span>Pay with Paystack</span>
    </button>
  );
};

export default PaystackButton;
