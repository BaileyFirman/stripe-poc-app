import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentMethod, Stripe, StripeCardElement } from "@stripe/stripe-js";

const Subscribe = () => {
  const stripe = useStripe() as Stripe;
  const elements = useElements();

  function onSubscriptionComplete(result: any) {
    // Payment was successful.
    if (result.subscription.status === "active") {
      // Change your UI to show a success message to your customer.
      // Call your backend to grant access to your service based on
      // `result.subscription.items.data[0].price.product` the customer subscribed to.
    }
  }

  function createSubscription(
    customerId: string,
    paymentMethodId: string,
    priceId: string
  ) {
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
        // Normalize the result to contain the object returned by Stripe.
        // Add the additional details we need.
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
        .catch((error) => {
          // An error has happened. Display the failure to the user here.
          // We utilize the HTML element we created.
          // showCardError(error);
        })
    );
  }

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
        "cus_JFgBloKlbL5wiy",
        (paymentMethod as PaymentMethod).id,
        "price_1IaFBTBZ3RciYKBiXWVUJZU1"
      );
    }
  };

  return (
    <>
      <p>A customer Id cus_JFgBloKlbL5wiy</p>
      <p>Intelli Pro PriceId price_1IaFBTBZ3RciYKBiXWVUJZU1</p>
      <p>Intelli Free PriceId price_1IaF8WBZ3RciYKBiJlhWRfDB</p>
      <h1>Subscripe</h1>
      <input placeholder="debug-priceId"></input>
      <input placeholder="debug-subscriptionId"></input>
      <br />
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    </>
  );
}

export default Subscribe;
