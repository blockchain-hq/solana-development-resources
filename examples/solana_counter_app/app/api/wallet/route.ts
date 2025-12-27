import { NextRequest, NextResponse } from "next/server";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateWallet } from "../../lib/wallet";
import { requestAirdrop } from "../../lib/airdrop";
import fs from "fs";
import path from "path";

const CLUSTER_URL = "https://api.devnet.solana.com";

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json() as { action: string };

    if (action === "getOrCreate") {
      const connection = new Connection(CLUSTER_URL, "confirmed");
      const walletPath = path.join(process.cwd(), "wallets", "user-wallet.json");
      const wallet = await getOrCreateWallet(connection, walletPath);

      return NextResponse.json({
        publicKey: wallet.publicKey.toBase58(),
        secretKey: Array.from(wallet.secretKey),
      });
    }

    if (action === "airdrop") {
      const { publicKey, solAmount } = await request.json() as { publicKey: string, solAmount: number };
      const connection = new Connection(CLUSTER_URL, "confirmed");
      const pubKey = new PublicKey(publicKey);
      const signature = await requestAirdrop(connection, pubKey, solAmount ?? 2);

      return NextResponse.json({
        signature,
        message: "Airdrop successful",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

