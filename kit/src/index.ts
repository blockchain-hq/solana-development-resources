import {
  address,
  generateKeyPair,
  generateKeyPairSigner,
  lamports,
} from "@solana/kit";
import { createClient } from "./client";
import { LAMPORTS_PER_SOL } from "./constants";

// project setup & test
const setupProject = async () => {
  const client = await createClient();
  const account = address("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
  const { value: balance } = await client.rpc.getBalance(account).send();
  console.log(`Balance: ${Number(balance) / LAMPORTS_PER_SOL} SOL`);
};

const generatedFundedSigner = async () => {
  // generate new keypair
  // uses browser's built-in native crypto library - creates a native keypair
  const wallet: CryptoKeyPair = await generateKeyPair();

  console.log("Generate keypair using generateKeyPair() fn.");
  console.log(wallet.publicKey, "Public Key");

  // generate signer object expected by kit
  // native keypair is wrapped into signer object to work with kit
  const signer = await generateKeyPairSigner();
  const client = await createClient();
  const { value: signerBalance } = await client.rpc
    .getBalance(signer.address)
    .send();

  console.log("Generated signer using generateKeyPairsSigner() method");
  console.log(signer.address, "Address");
  console.log("Balance before airdrop: ", signerBalance);

  console.log("Airdrop successful");
  const { value: signerBalanceAfterAirdrop } = await client.rpc
    .getBalance(signer.address)
    .send();

  console.log("Balance after airdrop: ", signerBalanceAfterAirdrop);
};

setupProject();
generatedFundedSigner();
