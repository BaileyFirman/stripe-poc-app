import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Subscribe from "./Subscribe";
import reportWebVitals from "./reportWebVitals";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreateUser } from "./CreateUser";

const stripePromise = loadStripe(
  "pk_test_51IT0YfBZ3RciYKBiRIOAi3NJsLtOkO1nNTCLJ9AIWP2hf7NKA4UkFnpWElc0kamu5SKMpia43pRkEkSscGQhwVBM00ZmmUlJxe"
);

ReactDOM.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <CreateUser />
      <Subscribe />
    </Elements>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
