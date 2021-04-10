import React, { useState } from "react";
import "./App.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentMethod, Stripe, StripeCardElement } from "@stripe/stripe-js";

const Subscribe = () => {
  const stripe = useStripe() as Stripe;
  const elements = useElements();

  const [customerId, setCustomerId] = useState<string>("");
  const [priceId, setPriceId] = useState<string>("");

  const onSubscriptionComplete = (result: any) => {
    // Payment was successful.
    if (result.subscription.status === "active") {
      // `result.subscription.items.data[0].price.product` the customer subscribed to.
    }
  };

  const createSubscription = (
    customerId: string,
    paymentMethodId: string,
    priceId: string
  ) => {
    return (
      fetch("http://localhost:57679/api/billing/create-subscription", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
          paymentMethodId: paymentMethodId,
          priceId: priceId,
        }),
      })
        .then((response) => {
          return response.json();
        })
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer.
            throw result;
          }
          return result;
        })
        .then((result) => {
          return {
            paymentMethodId: paymentMethodId,
            priceId: priceId,
            subscription: result,
          };
        })
        .then(() => {})
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .catch((error) => {})
    );
  };

  const handleSubmit = async (event: any) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // There can only ever be one of each type of stripe element.
    const cardElement = elements.getElement(CardElement) as StripeCardElement;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);

      createSubscription(
        customerId,
        (paymentMethod as PaymentMethod).id,
        priceId
      );
    }
  };

  return (
    <>
      <p>Intelli Pro PriceId price_1IaFBTBZ3RciYKBiXWVUJZU1</p>
      <p>Intelli Free PriceId price_1IaF8WBZ3RciYKBiJlhWRfDB</p>
      <h1>Subscripe</h1>
      <input
        placeholder="debug-priceId"
        value={priceId}
        onChange={(e) => setPriceId(e.target.value)}
      ></input>
      <input
        placeholder="debug-customerId"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      ></input>
      <br />
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    </>
  );
};

export default Subscribe;
