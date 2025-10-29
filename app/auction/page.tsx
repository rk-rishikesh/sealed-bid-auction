'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './header';
import { useAccount, useWalletClient, useChainId } from 'wagmi';
import Wallet from '../wallet';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import { ethers } from 'ethers';
import Image from 'next/image';

type Auction = {
  id: number;
  title: string;
  date?: string;
  auctionEnded?: boolean;
  biddingEndBlock?: number;
  owner?: string;
  highestBid?: string;
  highestBidder?: string;
  highestBidPaid?: boolean;
  revealedBidsCount?: number;
  totalBids?: number;
};

const AuctionPage = () => {

  const router = useRouter();

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [myAuctions, setMyAuctions] = useState<Auction[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'bidding-closed' | 'ended' | 'my-auctions'>('active');
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const fetchAuctions = async () => {
      if (!walletClient || !address) return;
      setLoading(true);
      const JsonProvider = new ethers.JsonRpcProvider(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`);
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Get current block number
      const blockNumber = await JsonProvider.getBlockNumber();
      setCurrentBlock(blockNumber);
      console.log('Current block number:', blockNumber);

      let auctionIds = [];

      const nextAuctionId = await contract.nextAuctionId();
      auctionIds = Array.from({ length: Number(nextAuctionId) }, (_, i) => i);

      const auctionDetails = await Promise.all(
        auctionIds.map(async (id: number) => {
          const details = await contract.getAuction(id);
          console.log("Auction : ", details);
          
          // Convert proxy to plain object
          const auctionData = {
            auctionID: Number(details.auctionID),
            biddingEndBlock: Number(details.biddingEndBlock),
            highestBid: details.highestBid.toString(),
            revealedBidsCount: Number(details.revealedBidsCount),
            totalBids: Number(details.totalBids),
            highestBidder: details.highestBidder,
            owner: details.owner,
            highestBidPaid: details.highestBidPaid,
            auctionEnded: details.auctionEnded,
          };
          
          return {
            id: Number(id),
            title: `Auction #${id}`,
            ...auctionData,
          };
        })
      );
      console.log('All auction details:', auctionDetails);
      setAuctions(auctionDetails);

      // Filter auctions by owner (connected address)
      const myAuctionDetails = auctionDetails.filter(auction => 
        auction.owner && auction.owner.toLowerCase() === address.toLowerCase()
      );
      setMyAuctions(myAuctionDetails);
      console.log('My auctions:', myAuctionDetails);
      setLoading(false);
    };
    fetchAuctions();
  }, [walletClient, address]);

  // Filter auctions based on active tab
  const getFilteredAuctions = () => {
    const sourceAuctions = activeTab === 'my-auctions' ? myAuctions : auctions;
    
    const filtered = sourceAuctions.filter(auction => {
      // Check if bidding has ended by comparing current block with bidding end block
      const biddingEnded = currentBlock >= Number(auction.biddingEndBlock);
      
      console.log(`Auction ${auction.id}: currentBlock=${currentBlock}, biddingEndBlock=${auction.biddingEndBlock}, biddingEnded=${biddingEnded}, auctionEnded=${auction.auctionEnded}`);
      
      switch (activeTab) {
        case 'active':
          // Active: bidding not ended AND auction not ended
          return !biddingEnded && !auction.auctionEnded;
        case 'bidding-closed':
          // Bidding closed: bidding ended BUT auction not ended
          return biddingEnded && !auction.auctionEnded;
        case 'ended':
          // Ended: auction is fully ended
          return auction.auctionEnded;
        case 'my-auctions':
          // My auctions: all auctions created by the user
          return true;
        default:
          return true;
      }
    });
    
    console.log(`Filtered ${activeTab} auctions:`, filtered);
    return filtered;
  };

  const filteredAuctions = getFilteredAuctions();

  const isOnBaseSepolia = chainId === 84532;

  return (
    isConnected && isOnBaseSepolia ? (
      <div className="min-h-screen bg-white-pattern font-sans">
        {/* Header */}
        <Header />
        
        {/* Loading Screen */}
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-lg font-funnel-display text-gray-600">Loading auctions...</p>
            </div>
          </div>
        ) : (
          <>
            <header className="pt-24 max-w-7xl mx-auto px-4 pb-8">
              <h1 className="text-5xl sm:text-6xl font-funnel-display font-light text-gray-900 mb-8">
                Ongoing <span className="font-bold">Auctions</span>
              </h1>
          
          {/* Tab Navigation */}
          <div className="mb-4 mt-4">
            <div className="flex flex-wrap">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 font-funnel-display font-bold text-lg bg-white text-gray-900 transition-colors ${
                  activeTab === 'active'
                    ? 'border border-gray-400'
                    : 'border border-transparent hover:border-gray-300'
                }`}
                style={{ borderRadius: 0 }}
              >
                Active Auctions
              </button>
              <button
                onClick={() => setActiveTab('bidding-closed')}
                className={`px-6 py-3 font-funnel-display font-bold text-lg bg-white text-gray-900 transition-colors ${
                  activeTab === 'bidding-closed'
                    ? 'border border-gray-400'
                    : 'border border-transparent hover:border-gray-300'
                }`}
                style={{ borderRadius: 0 }}
              >
                Bidding Closed
              </button>
              <button
                onClick={() => setActiveTab('ended')}
                className={`px-6 py-3 font-funnel-display font-bold text-lg bg-white text-gray-900 transition-colors ${
                  activeTab === 'ended'
                    ? 'border border-gray-400'
                    : 'border border-transparent hover:border-gray-300'
                }`}
                style={{ borderRadius: 0 }}
              >
                Auctions Ended
              </button>
              <button
                onClick={() => setActiveTab('my-auctions')}
                className={`px-6 py-3 font-funnel-display font-bold text-lg bg-white text-gray-900 transition-colors ${
                  activeTab === 'my-auctions'
                    ? 'border border-gray-400'
                    : 'border border-transparent hover:border-gray-300'
                }`}
                style={{ borderRadius: 0 }}
              >
                My Auctions
              </button>
            </div>
            {/* Separator Line */}
            <div className="border-t border-gray-300 mt-4"></div>
          </div>
        </header>

        {/* Grid */}
        <main className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fixed Launch Auction Card - only show on Active tab */}
            {activeTab === 'active' && (
              <div className="flex h-44 bg-white border border-gray-200 overflow-hidden shadow-sm cursor-pointer hover:border-gray-400 transition-colors" onClick={() => router.push('/launch')}>
                <div className="flex-shrink-0 w-44 h-44 bg-blue-600 flex items-center justify-center">
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
            )}

            {/* Filtered auctions */}
            {filteredAuctions.length > 0 ? (
              filteredAuctions.map((item) => {
                const biddingEnded = currentBlock >= Number(item.biddingEndBlock);
                const isActive = !biddingEnded && !item.auctionEnded;
                const isBiddingClosed = biddingEnded && !item.auctionEnded;

                return (
                  <div key={item.id} className="flex h-44 bg-white border border-gray-200 overflow-hidden shadow-sm">
                    {/* Image */}
                    <div className="flex-shrink-0 w-44 h-44 bg-gray-100 flex items-center justify-center">
                      <Image
                        src={item.id % 2 === 0 ? '/assets/images/dark.jpg' : '/assets/images/light.jpg'}
                        alt="Auction visual"
                        width={160}
                        height={160}
                        className="object-contain w-40 h-40"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between p-6 relative">
                      <div>
                        <div className="font-bold text-lg text-gray-900 mb-2 font-funnel-display">{item.title}</div>
                        <div className="text-sm mb-2 font-funnel-display">
                          <span className={`font-bold ${
                            isActive ? 'text-green-500' : 
                            isBiddingClosed ? 'text-yellow-500' : 
                            'text-red-500'
                          }`}>
                            {isActive ? 'Active' : isBiddingClosed ? 'Bidding Closed' : 'Ended'}
                          </span>
                        </div>
                        {item.highestBid && (
                          <div className="text-xs text-gray-500 font-funnel-display pb-4">
                            Highest: {ethers.formatEther(item.highestBid)} ETH
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => router.push(`/auction/${item.id}`)}
                          className={`inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-base font-funnel-display text-gray-900 transition-colors bg-white hover:border-gray-400 cursor-pointer`}
                        >
                          {isActive ? 'Bid' : isBiddingClosed ? 'View' : 'Closed'}
                          {isActive && (
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
              })
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500 text-lg font-funnel-display">
                  {activeTab === 'my-auctions' ? 'No auctions created by you yet.' : `No ${activeTab.replace('-', ' ')} auctions found.`}
                </p>
              </div>
            )}
          </div>
        </main>
          </>
        )}
      </div>
    ) : <Wallet />)
};

export default AuctionPage;