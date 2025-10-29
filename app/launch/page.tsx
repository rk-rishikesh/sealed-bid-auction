'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useAccount, useWalletClient, useChainId } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import Wallet from '../wallet';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';

const BlockLockPage = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const router = useRouter();
  const [decryptionTime, setDecryptionTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [auctionId, setAuctionId] = useState<string | null>(null);

  const handleNavigateToAuction = () => {
    if (auctionId) {
      router.push(`/auction/${auctionId}`);
    }
  };


  const handleLaunchAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!walletClient) throw new Error('Wallet not connected');
      if (!decryptionTime) throw new Error('Decryption time required');

      // Use ethers.js to get current block and timestamp, then calculate target block
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const currentBlock = await provider.getBlockNumber();
      console.log(currentBlock)
      const currentBlockData = await provider.getBlock(currentBlock);
      const currentTimestamp = currentBlockData?.timestamp || Math.floor(Date.now() / 1000);
      const targetTimestamp = Math.floor(new Date(decryptionTime).getTime() / 1000);
      const secondsPerBlock = 2; // Base layer blocks are ~2 seconds
      const blocksToAdd = Math.ceil((targetTimestamp - currentTimestamp) / secondsPerBlock);
      const blockHeight = BigInt(currentBlock + blocksToAdd);
      console.log(blockHeight)

      // Call launchAuction with calculated blockHeight
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.launchAuction(blockHeight);
      console.log(tx);
      
      // Get the auction ID from the transaction receipt
      const receipt = await tx.wait();
      const auctionIdFromTx = receipt.logs[0]?.args?.auctionId?.toString();
      setAuctionId(auctionIdFromTx || 'Unknown');
      setShowPopup(true);
    } catch (err) {
      let errorMsg = 'Transaction failed';
      console.log(errorMsg);
      if (err instanceof Error) errorMsg = err.message;
      // Optionally: display errorMsg in the UI if you want
    } finally {
      setLoading(false);
    }
  };

  const isOnBaseSepolia = chainId === 84532;

  return isConnected && isOnBaseSepolia ? (
    <div className="bg-black-pattern bg-cover bg-center min-h-screen">
      <div className="flex flex-col sm:flex-row h-auto sm:h-screen font-sans">
        <div className="hidden sm:block sm:w-[30%] sm:h-screen relative">
          <Image
            src="/assets/design/dark.svg"
            alt="Randamu Logo"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
            priority
          />
        </div>
        <div className="w-full pt-24 sm:w-[70%] h-auto sm:h-screen flex items-center">
          <div className="w-full px-4 sm:px-12 flex flex-col gap-8 sm:gap-64">
            <div className='flex flex-col gap-4'>
              <h1 className="text-5xl sm:text-6xl font-funnel-display font-light text-white mb-4">
                Launch <span className="font-bold">Auction</span>
              </h1>
              <p className="text-gray-100 text-lg mb-8 font-funnel-display">
                Start a new sealed-bid auction by specifying the bidding end block.
              </p>
            </div>
            <div>
              <form onSubmit={handleLaunchAuction} className="flex flex-row gap-6 w-full items-end">
                <div className="w-2/3">
                  <label className="font-funnel-display text-lg text-white w-full">
                    Set the Launch Deadline
                    <input
                      type="datetime-local"
                      value={decryptionTime}
                      onChange={e => setDecryptionTime(e.target.value)}
                      className="w-full h-20 px-4 border border-white bg-transparent text-white font-funnel-display text-lg mt-2 focus:outline-none"
                      min={new Date().toISOString().slice(0, 16)}
                      required
                      style={{ borderRadius: 0 }}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className={`w-1/3 h-20 font-funnel-display text-white border border-white bg-transparent font-bold text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                  style={{ borderRadius: 0 }}
                >
                  {loading ? 'Launching...' : 'Launch Auction'}
                </button>
              </form>
              <style jsx global>{`
                input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                  filter: invert(1);
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-4xl font-funnel-display text-white mb-8">
              Auction <span className="font-bold">Created</span>
            </h2>
            <div className="mb-4">
              <p className="text-6xl font-bold text-white mb-2">{auctionId}</p>
              <p className="text-sm text-white font-funnel-display">AUCTION ID</p>
            </div>
            <button
              onClick={handleNavigateToAuction}
              className="bg-blue-600 text-white px-8 py-3 font-funnel-display text-sm uppercase tracking-wide hover:bg-blue-700 transition-colors"
              style={{ borderRadius: 0 }}
            >
              View Auction
            </button>
          </div>
        </div>
      )}
    </div>
  ) : <Wallet />;
};

export default BlockLockPage;