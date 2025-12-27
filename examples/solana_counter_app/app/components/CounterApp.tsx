"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor"; 
import IDL from "../../target/idl/counter.json";

const PROGRAM_ID = new PublicKey("9zHmFM4RbsHrXNKkoSZyPoCyWHZNB4CsSuQWMryzrvcK");

export default function CounterApp() {
  const { connection } = useConnection();
  const { publicKey, wallet, signTransaction, signAllTransactions } = useWallet();
  const [program, setProgram] = useState<Program | null>(null);
  const [counterKeypair, setCounterKeypair] = useState<Keypair | null>(null);
  const [counter, setCounter] = useState<PublicKey | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [setValue, setSetValue] = useState<string>("");

  useEffect(() => {
    if (publicKey && connection && signTransaction && signAllTransactions) {
      initializeProgram();
    } else {
      setProgram(null);
      setCount(null);
    }
  }, [publicKey, connection, signTransaction, signAllTransactions]);

  const initializeProgram = async () => {
    if (!publicKey || !connection || !signTransaction || !signAllTransactions) {
      return;
    }

    try {
      const provider = new anchor.AnchorProvider(
        connection,
        {
          publicKey,
          signTransaction,
          signAllTransactions,
        },
        { commitment: "confirmed" }
      );

      anchor.setProvider(provider);

      const programInstance = new Program(
        IDL as anchor.Idl,
        provider
      );
      setProgram(programInstance);

      // Get or create counter keypair (stored in localStorage for browser)
      const COUNTER_KEYPAIR_KEY = "solana_counter_keypair";
      let counterKp: Keypair;
      
      const storedKeypair = localStorage.getItem(COUNTER_KEYPAIR_KEY);
      if (storedKeypair) {
        const secretKey = JSON.parse(storedKeypair);
        counterKp = Keypair.fromSecretKey(new Uint8Array(secretKey));
      } else {
        counterKp = Keypair.generate();
        localStorage.setItem(
          COUNTER_KEYPAIR_KEY,
          JSON.stringify(Array.from(counterKp.secretKey))
        );
      }

      setCounterKeypair(counterKp);
      setCounter(counterKp.publicKey);

      // Try to fetch counter if it exists
      await fetchCounter(programInstance, counterKp.publicKey);
    } catch (error: any) {
      setMessage({ type: "error", text: `Initialization error: ${error.message}` });
    }
  };

  const fetchCounter = async (prog: Program<anchor.Idl>, counterPda: PublicKey) => {
    try {
      const counterAccount = await (prog.account as any).counter.fetch(counterPda);
      setCount(counterAccount.count);
    } catch (error) {
      // Counter doesn't exist yet
      setCount(null);
    }
  };

  const initialize = async () => {
    if (!program || !publicKey || !counter || !counterKeypair) {
      setMessage({ type: "error", text: "Please connect wallet first" });
      return;
    }

    setLoading("Initializing counter...");
    setMessage(null);

    try {
      const tx = await program.methods
        .initialize()
        .accounts({
          payer: publicKey,
          counter: counter,
          systemProgram: SystemProgram.programId,
        })
        .signers([counterKeypair])
        .rpc();

      setMessage({
        type: "success",
        text: `Counter initialized! Transaction: ${tx.slice(0, 8)}...`,
      });

      await fetchCounter(program, counter);
    } catch (error: any) {
      setMessage({ type: "error", text: `Initialize error: ${error.message}` });
    } finally {
      setLoading(null);
    }
  };

  const increment = async () => {
    if (!program || !counter) {
      setMessage({ type: "error", text: "Please connect wallet first" });
      return;
    }

    setLoading("Incrementing...");
    setMessage(null);

    try {
      const tx = await program.methods
        .increment()
        .accounts({
          counter: counter,
        })
        .rpc();

      setMessage({
        type: "success",
        text: `Incremented! Transaction: ${tx.slice(0, 8)}...`,
      });

      await fetchCounter(program, counter);
    } catch (error: any) {
      setMessage({ type: "error", text: `Increment error: ${error.message}` });
    } finally {
      setLoading(null);
    }
  };

  const decrement = async () => {
    if (!program || !counter) {
      setMessage({ type: "error", text: "Please connect wallet first" });
      return;
    }

    setLoading("Decrementing...");
    setMessage(null);

    try {
      const tx = await program.methods
        .decrement()
        .accounts({
          counter: counter,
        })
        .rpc();

      setMessage({
        type: "success",
        text: `Decremented! Transaction: ${tx.slice(0, 8)}...`,
      });

      await fetchCounter(program, counter);
    } catch (error: any) {
      setMessage({ type: "error", text: `Decrement error: ${error.message}` });
    } finally {
      setLoading(null);
    }
  };

  const setCounterValue = async () => {
    if (!program || !counter) {
      setMessage({ type: "error", text: "Please connect wallet first" });
      return;
    }

    const value = parseInt(setValue);
    if (isNaN(value) || value < 0 || value > 255) {
      setMessage({ type: "error", text: "Please enter a valid number (0-255)" });
      return;
    }

    setLoading("Setting value...");
    setMessage(null);

    try {
      const tx = await program.methods
        .set(value)
        .accounts({
          counter: counter,
        })
        .rpc();

      setMessage({
        type: "success",
        text: `Counter set to ${value}! Transaction: ${tx.slice(0, 8)}...`,
      });

      setSetValue("");
      await fetchCounter(program, counter);
    } catch (error: any) {
      setMessage({ type: "error", text: `Set error: ${error.message}` });
    } finally {
      setLoading(null);
    }
  };

  const closeCounter = async () => {
    if (!program || !publicKey || !counter) {
      setMessage({ type: "error", text: "Please connect wallet first" });
      return;
    }

    if (!confirm("Are you sure you want to close the counter account?")) {
      return;
    }

    setLoading("Closing counter...");
    setMessage(null);

    try {
      const tx = await program.methods
        .close()
        .accounts({
          payer: publicKey,
          counter: counter,
        })
        .rpc();

      setMessage({
        type: "success",
        text: `Counter closed! Transaction: ${tx.slice(0, 8)}...`,
      });

      setCount(null);
    } catch (error: any) {
      setMessage({ type: "error", text: `Close error: ${error.message}` });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container">
      <h1>Solana Counter App</h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <WalletMultiButton />
      </div>

      {!publicKey ? (
        <div>
          <p style={{ marginBottom: "1rem", textAlign: "center" }}>
            Connect your Phantom wallet to interact with the counter program
          </p>
        </div>
      ) : (
        <>
          <div className="wallet-info">
            <strong>Wallet:</strong> {publicKey.toBase58()}
            <br />
            <strong>Counter Account:</strong> {counter?.toBase58()}
          </div>

          <div className="counter-display">
            <div className="counter-label">Current Count</div>
            <div className="counter-value">
              {count !== null ? count : "Not initialized"}
            </div>
          </div>

          <div className="button-group">
            {count === null ? (
              <button
                className="button"
                onClick={initialize}
                disabled={loading !== null}
              >
                {loading === "Initializing counter..." ? "Initializing..." : "Initialize Counter"}
              </button>
            ) : (
              <>
                <button
                  className="button"
                  onClick={increment}
                  disabled={loading !== null}
                >
                  {loading === "Incrementing..." ? "Incrementing..." : "Increment (+1)"}
                </button>
                <button
                  className="button"
                  onClick={decrement}
                  disabled={loading !== null}
                >
                  {loading === "Decrementing..." ? "Decrementing..." : "Decrement (-1)"}
                </button>
                <button
                  className="button button-danger"
                  onClick={closeCounter}
                  disabled={loading !== null}
                >
                  {loading === "Closing counter..." ? "Closing..." : "Close Counter"}
                </button>
              </>
            )}
          </div>

          {count !== null && (
            <div>
              <h2>Set Counter Value</h2>
              <div className="input-group">
                <label htmlFor="setValue">Enter value (0-255):</label>
                <input
                  id="setValue"
                  type="number"
                  min="0"
                  max="255"
                  value={setValue}
                  onChange={(e) => setSetValue(e.target.value)}
                  placeholder="Enter a number"
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <button
                  className="button"
                  onClick={setCounterValue}
                  disabled={loading !== null || !setValue}
                >
                  {loading === "Setting value..." ? "Setting..." : "Set Value"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {message && (
        <div className={`status ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading && (
        <div className="status info">
          {loading}
        </div>
      )}
    </div>
  );
}
