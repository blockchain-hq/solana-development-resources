import {
  airdropFactory,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  generateKeyPairSigner,
  lamports,
  MessageSigner,
  type Rpc,
  RpcSubscriptions,
  SolanaRpcApi,
  SolanaRpcSubscriptionsApi,
  TransactionSigner,
} from "@solana/kit";

import { CLUSTER_URL, CLUSTER_WS_URL } from "./constants";

export type Client = {
  rpc: Rpc<SolanaRpcApi>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
  wallet: TransactionSigner & MessageSigner;
};

let client: Client | undefined;
export const createClient = async (): Promise<Client> => {
  if (!client) {
    const rpc = createSolanaRpc(CLUSTER_URL);
    const rpcSubs = createSolanaRpcSubscriptions(CLUSTER_WS_URL);
    const airdrop = airdropFactory({ rpc, rpcSubscriptions: rpcSubs });

    const wallet = await generateKeyPairSigner();
    await airdrop({
      recipientAddress: wallet.address,
      lamports: lamports(1_000_000_000n),
      commitment: "confirmed",
    });

    client = { rpc, rpcSubscriptions: rpcSubs, wallet };
  }

  return client;
};
