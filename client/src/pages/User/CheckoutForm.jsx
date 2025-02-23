/* eslint-disable react/prop-types */
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Modal, Fade, Box } from "@mui/material";
import style from "../../assets/style/user/premium.module.scss";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import toast from "react-hot-toast";
import { getUserFromStorage } from "../../utils/localeStorage";
import axios from "axios";
import { fetchUserByToken } from "../../utils/reusableFunc";

const CheckoutForm = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const token = getUserFromStorage();
  const [user, setUser] = useState([]);

  // Fetch user details
  useEffect(() => {
    const getUserByToken = async () => {
      try {
        const response = await fetchUserByToken(token);
        setUser(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getUserByToken();
  }, [token]);

  const checkAndUpdatePremiumStatus = async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL + ENDPOINT.users}/${user.id}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = response.data;
      setIsPremium(userData.isPremium);
      setIsExpired(userData.premiumExpired);
    } catch (error) {
      console.error("Error checking premium status:", error);
    }
  };

  useEffect(() => {
    checkAndUpdatePremiumStatus(token);
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const response = await axios.post(
        `${BASE_URL + ENDPOINT.users}/create-payment-intent`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const paymentIntentResponse = response.data;
      const clientSecret = paymentIntentResponse.clientSecret;

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: "Customer Name",
            },
          },
        }
      );

      if (error) {
        console.error("Stripe Error:", error.message);
        toast.error("Payment failed");
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment Successful!");

        await axios.get(`${BASE_URL + ENDPOINT.users}/update-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await checkAndUpdatePremiumStatus(token);

        handleClose();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box
          sx={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            maxWidth: "500px",
            margin: "200px auto",
          }}
          component="form"
          onSubmit={handleSubmit}
        >
          <p className={style.cardHeading}>Make a Payment</p>

          {isPremium && !isExpired && (
            <p className={style.infoMessage} style={{ marginBottom: "20px" }}>
              You already have premium access!
            </p>
          )}

          <div style={{ marginBottom: "20px" }}>
            <CardElement
              options={{
                style: { base: { color: "#000", fontSize: "16px" } },
              }}
            />
          </div>

          <div className={style.buttons}>
            <button
              type="submit"
              className={style.payNow}
              disabled={isPremium || loading || !stripe} 
            >
              {isPremium
                ? "Already Premium"
                : loading
                ? "Processing..."
                : "Pay Now"}
            </button>
            <button
              type="button"
              className={style.cancelBtn}
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CheckoutForm;
