import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const requestAirdrop = async (
  connection: Connection,
  publicKey: PublicKey,
  solAmount: number
): Promise<string> => {
  const signature = await connection.requestAirdrop(
    publicKey,
    solAmount * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(signature);
  return signature;
};

