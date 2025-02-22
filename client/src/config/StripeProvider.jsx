/* eslint-disable react/prop-types */
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const PUBLISHABLE_KEY =
  "pk_test_51QmdAIKrG0Wwg7VibhlRQjvVBqEziTFJh3WhN4ifcwr7FDhLWFTgk1BKJEGZxWWXVKHKdEXsMJ4lxN7ZxhtTxX9A00tKyN2IcI";

const stripePromise = loadStripe(PUBLISHABLE_KEY);

const StripeProvider = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

export default StripeProvider;
