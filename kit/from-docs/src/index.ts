import { createClient } from "./client";

const tutorial = async () => {
  const client = await createClient();
  const { value: balance } = await client.rpc
    .getBalance(client.wallet.address)
    .send();

  console.log(`Balance: ${balance} lamports`);
};

tutorial();
