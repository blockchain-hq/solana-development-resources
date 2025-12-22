import { getCreateAccountInstruction } from "@solana-program/system";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { Client } from "./client";
import { generateKeyPairSigner } from "@solana/kit";
import {
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
} from "@solana-program/compute-budget";

export const createMint = async (
  client: Client,
  options: { decimals?: number } = {}
) => {
  const mintSize = getMintSize();
  const mint = await generateKeyPairSigner();
  const mintRent = await client.rpc
    .getMinimumBalanceForRentExemption(BigInt(mintSize))
    .send();

  const createAccountIx = getCreateAccountInstruction({
    payer: client.wallet,
    newAccount: mint,
    space: mintSize,
    lamports: mintRent,
    programAddress: TOKEN_PROGRAM_ADDRESS,
  });

  const initializeMint = getInitializeMintInstruction({
    mint: mint.address,
    decimals: options.decimals || 0,
    mintAuthority: client.wallet.address,
    freezeAuthority: client.wallet.address,
  });

  const setComputeLimitIx = getSetComputeUnitLimitInstruction({
    units: 50_000,
  });
  const setComputePriceIx = getSetComputeUnitPriceInstruction({
    microLamports: 10_000,
  });
};
