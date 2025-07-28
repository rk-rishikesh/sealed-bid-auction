'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './header';
import { useAccount, useWalletClient } from 'wagmi';
import Wallet from '../wallet';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import { ethers } from 'ethers';

type Auction = {
  id: number;
  title: string;
  date: string;
  [key: string]: any;
};

const AuctionPage = () => {
  
  const router = useRouter();

  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const fetchAuctions = async () => {
      if (!walletClient || !address) return;
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Get current block and timestamp
      const currentBlock = await provider.getBlockNumber();
      const currentBlockData = await provider.getBlock(currentBlock);
      const currentTimestamp = currentBlockData?.timestamp || Math.floor(Date.now() / 1000);
      const secondsPerBlock = 12;

      let auctionIds = [];
      try {
        auctionIds = await contract.getCreatorAuctions(address);
      } catch (e) {
        const nextAuctionId = await contract.nextAuctionId();
        auctionIds = Array.from({ length: Number(nextAuctionId) }, (_, i) => i);
      }
      const auctionDetails = await Promise.all(
        auctionIds.map(async (id: number) => {
          const details = await contract.getAuction(id);
          return {
            id: Number(id),
            title: `Auction #${id}`,
            auctionEnded: details.auctionEnded,
            ...details,
          };
        })
      );
      setAuctions(auctionDetails);
    };
    fetchAuctions();
  }, [walletClient, address]);

  return (
    isConnected ? (
      <div className="min-h-screen bg-white-pattern font-sans">
        {/* Header */}
        <Header />
        <header className="pt-24 max-w-7xl mx-auto px-4 pb-20">
          <h1 className="text-5xl sm:text-6xl font-funnel-display font-light text-gray-900">
            Ongoing <span className="font-bold">Auctions</span>
          </h1>
        </header>

        {/* Grid */}
        <main className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fixed Launch Auction Card */}
            <div className="flex h-40 bg-white border border-gray-200 overflow-hidden shadow-sm cursor-pointer hover:border-gray-400 transition-colors" onClick={() => router.push('/launch')}>
              <div className="flex-shrink-0 w-40 h-40 bg-blue-600 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <div className="font-bold text-lg text-gray-900 mb-2 font-funnel-display">Launch New Auction</div>
                  <div className="text-gray-500 text-sm mb-2 font-funnel-display">Create a new sealed-bid auction</div>
                </div>
                <div>
                  <button className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-base font-funnel-display text-gray-900 transition-colors bg-white hover:border-gray-400">
                    Launch
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75V17.25M17.25 6.75H6.75M17.25 6.75L6.75 17.25" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Existing auctions */}
            {auctions.map((item) => {

              return (
                <div key={item.id} className="flex h-40 bg-white border border-gray-200 overflow-hidden shadow-sm">
                  {/* Image */}
                  <div className="flex-shrink-0 w-40 h-40 bg-gray-100 flex items-center justify-center">
                    <img
                      src={item.id % 2 === 0 ? '/assets/images/dark.jpg' : '/assets/images/light.jpg'}
                      alt="Auction visual"
                      className="object-contain w-40 h-40"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between p-6 relative">
                    <div>
                      <div className="font-bold text-lg text-gray-900 mb-2 font-funnel-display">{item.title}</div>
                      <div className="text-sm mb-2 font-funnel-display">
                        <span className={`font-bold ${item.auctionEnded ? 'text-red-500' : 'text-green-500'}`}>
                          {item.auctionEnded ? 'Ended' : 'Active'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => router.push(`/auction/${item.id}`)}
                        className={`inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-base font-funnel-display text-gray-900 transition-colors bg-white hover:border-gray-400 cursor-pointer`}
                      >
                        {!item.auctionEnded ? 'Bid' : 'Closed'}
                        {!item.auctionEnded && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 ml-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.25 6.75V17.25M17.25 6.75H6.75M17.25 6.75L6.75 17.25"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    ) : <Wallet />)
};

export default AuctionPage;