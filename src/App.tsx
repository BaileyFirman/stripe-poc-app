import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentMethod, Stripe, StripeCardElement } from "@stripe/stripe-js";

function App() {
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
    customerId: any,
    paymentMethodId: any,
    priceId: any
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
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        //.then(handlePaymentThatRequiresCustomerAction)
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

  function createPaymentMethod(
    cardElement: any,
    customerId: any,
    priceId: any
  ) {
    return stripe
      .createPaymentMethod({
        type: "card",
        card: cardElement,
      })
      .then((result) => {
        if (result.error) {
          // displayError(error);
        } else {
          createSubscription(customerId, result.paymentMethod.id, priceId);
        }
      });
  }

  const handleSubmit = async (event: any) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement) as StripeCardElement;

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);

      createSubscription(
        "cus_J6V0ZpcuoityrE",
        (paymentMethod as PaymentMethod).id,
        "price_1IVBuZBZ3RciYKBicKZ4M5qC"
      );
    }
  };

  return (
    <>
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

export default App;
