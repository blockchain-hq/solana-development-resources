# Solana Counter App

A Next.js web application to interact with a Solana counter program on Devnet using Phantom wallet.

## Features

- Connect Phantom wallet
- Initialize counter account
- Increment counter
- Decrement counter
- Set counter to a specific value
- Close counter account

## Setup

1. Install dependencies:
```bash
yarn install
# or
npm install
```

2. Build the Anchor program (if not already built):
```bash
anchor build
```

3. Deploy the program to Devnet (if not already deployed):
```bash
anchor deploy
```

4. Run the development server:
```bash
yarn dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

6. Click "Select Wallet" and choose Phantom to connect

## How It Works

- The app uses Phantom wallet adapter for wallet connection
- The counter account keypair is stored in browser localStorage
- All transactions are sent to Solana Devnet
- The app uses the Anchor framework to interact with the on-chain program

## Program ID

The program is deployed at: `9zHmFM4RbsHrXNKkoSZyPoCyWHZNB4CsSuQWMryzrvcK`

## Requirements

- Phantom wallet browser extension installed
- Phantom wallet set to Devnet (Settings > Developer Mode > Change Network)
- Some SOL in your Phantom wallet for transaction fees (you can get devnet SOL from a faucet)

## Notes

- Make sure you have the Anchor program built and deployed before using the UI
- The counter account is separate from your wallet and is stored locally in your browser

