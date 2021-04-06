import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
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
      <App />
    </Elements>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
