import axios from "axios";
import { useRazorpay } from "react-razorpay";

// interface OrderResponse {
//   id: string;
//   amount: number;
//   currency: "INR";
// }

// interface RazorpayResponse {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

const PaymentButtonRuno = () => {
  const { Razorpay } = useRazorpay();

  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID; // Ensure environment variables are prefixed with REACT_APP
  // console.log(RAZORPAY_KEY_ID);

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/razorpay/create-order",
        { amount: 3000 },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 401) {
        alert("Unauthorized");
        return;
      }

      const order = response.data;
      // console.log(order);

      const options = {
        key: RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "Runofresh",
        description: "Payment for your order",

        order_id: order.id,
        handler: async (response) => {
          try {
            const verification = await axios.post(
              "http://localhost:3001/razorpay/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                withCredentials: true,
              }
            );

            if (verification.data.message !== "Payment verified successfully") {
              return;
            }

            alert("Payment successful!"); // TODO: toast notification for payment completion or maybe not
            // payment verified -> now we create the appointment

            const items = [
              {
                itemId: 1,
                quantity: 2,
                price: 299.0,
              },
              {
                itemId: 2,
                quantity: 1,
                price: 499.0,
              },
              {
                itemId: 3,
                quantity: 1,
                price: 399.0,
              },
              {
                itemId: 4,
                quantity: 1,
                price: 599.0,
              },
            ];

            const body = {
              shipping_address: "Birubari, Guwahati Assam",
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              items: items,
            };

            const result = await axios.post(
              "http://localhost:3001/orders",
              {
                ...body,
              },
              {
                withCredentials: true,
              }
            );
            console.log(result);
          } catch (err) {
            alert("Payment failed: " + err.message);
            console.log(err);
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
          method: "upi",
        },
        // notes: {
        //   address: "Razorpay Corporate Office",
        // },
        theme: {
          color: "#3399cc",
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <button
      onClick={handlePayment}
      className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      aria-label="Proceed to checkout"
    >
      Checkout
    </button>
  );
};
export default PaymentButtonRuno;
