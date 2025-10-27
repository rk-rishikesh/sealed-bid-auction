# Sealed Bid Auction Platform

A decentralized auction platform built with Next.js, TypeScript, and Wagmi that enables sealed-bid auctions using Blocklock encryption technology.

## Features

### 🔐 Sealed Bid Auctions
- **Encrypted Bidding**: Bids are encrypted using Blocklock technology until the auction ends
- **Transparent Results**: All bids are revealed and processed fairly after the bidding period
- **Secure Process**: No bid information is visible during the active bidding phase

### 🏗️ Smart Contract Integration
- **Base Sepolia Network**: Deployed on Base Sepolia testnet
- **Ethereum Integration**: Full Web3 wallet connectivity via Wagmi
- **Real-time Updates**: Live block tracking for accurate auction timing

### 📱 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Tabbed Interface**: Organized view of Active, Bidding Closed, Ended, and My Auctions
- **Real-time Status**: Live auction status updates based on blockchain state
- **Loading States**: Smooth user experience with proper loading indicators

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, ethers.js
- **Encryption**: Blocklock.js
- **Network**: Base Sepolia

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet
- Base Sepolia testnet ETH

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sealed-bid-auction
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating an Auction
1. Connect your Web3 wallet
2. Navigate to the "Active Auctions" tab
3. Click "Launch New Auction"
4. Set the bidding end time
5. Confirm the transaction

### Bidding on Auctions
1. Browse available auctions in the "Active Auctions" tab
2. Click on an auction to view details
3. Enter your bid amount in ETH
4. Place your sealed bid (encrypted until auction ends)

### Managing Your Auctions
- **My Auctions**: View all auctions you've created
- **Bidding Closed**: Auctions where bidding has ended but not yet finalized
- **Ended**: Fully completed auctions

## Smart Contract

The application interacts with a deployed smart contract on Base Sepolia:

- **Contract Address**: `0x605aEbc596552cc69ebb3164e0a7a1800d373b61`
- **Network**: Base Sepolia
- **Features**: Sealed bidding, auction management, refund system

## Project Structure

```
├── app/
│   ├── auction/
│   │   ├── [id]/          # Individual auction pages
│   │   └── page.tsx       # Auction listing page
│   ├── launch/            # Auction creation
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
├── lib/
│   └── contract.ts       # Contract ABI and configuration
└── public/               # Static assets
```

## Key Features Explained

### Blocklock Encryption
- Bids are encrypted using Blocklock.js before being sent to the blockchain
- Decryption keys are revealed only after the bidding period ends
- Ensures complete bid privacy during active bidding

### Auction States
- **Active**: Bidding is open, users can place sealed bids
- **Bidding Closed**: Bidding period ended, awaiting finalization
- **Ended**: Auction completed, winner determined

### User Roles
- **Auction Creator**: Can create auctions and finalize them
- **Bidder**: Can place bids and withdraw refunds
- **Winner**: Can fulfill winning bid payment

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
