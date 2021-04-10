import { useState } from "react";

type CreateUserProps = {};

export const CreateUser: React.FC<CreateUserProps> = ({}) => {
  const [email, setEmail] = useState<string>("");
  const [id, setId] = useState<string>("");

  const createUser = async (customerId: string, customerEmail: string) => {
    const createCustomerUrl =
      "http://localhost:57679/api/billing/create-customer";
    const response = await fetch(createCustomerUrl, {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        customerId,
        email: customerEmail,
      }),
    });

    console.log(response.json())
    console.log(response);
  };

  return (
    <>
      <h1>Create a user</h1>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        placeholder="id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      ></input>
      <button onClick={() => (async () => await createUser(id, email))()}>
        Create User
      </button>
    </>
  );
};
