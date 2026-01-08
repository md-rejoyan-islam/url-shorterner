import Stripe from "stripe";
import { stripeConfig } from "./secret";

// Initialize Stripe instance
const stripe = new Stripe(stripeConfig.secretKey);

export { stripe, stripeConfig };
