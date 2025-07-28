"use client";
import React, { useEffect, useState } from "react";
import Header from "../header";
import { useParams } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import Wallet from '../../wallet';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import { Blocklock, encodeCiphertextToSolidity, encodeCondition } from "blocklock-js";
import { ethers } from 'ethers';

const BidPage = () => {
    const { address, isConnected } = useAccount();
    const [auction, setAuction] = useState<any>(null);
    const [currentBlock, setCurrentBlock] = useState<number>(0);
    const [userBidId, setUserBidId] = useState<number | null>(null);
    const [userBid, setUserBid] = useState<any>(null);
    const [pendingReturn, setPendingReturn] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const { data: walletClient } = useWalletClient();
    const params = useParams();
    const id = typeof params.id === 'string' ? parseInt(params.id, 10) : 0;

    useEffect(() => {
        const fetchAuction = async () => {
            if (!walletClient || !address) return;
            const provider = new ethers.BrowserProvider(walletClient.transport);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            const auctionData = await contract.getAuction(id);
            setAuction(auctionData);
            const blockNumber = await provider.getBlockNumber();
            setCurrentBlock(blockNumber);

            // Fetch user's bid info
            try {
                const userBidIdResult = await contract.getUserBidId(address);
                setUserBidId(Number(userBidIdResult));
                if (Number(userBidIdResult) > 0) {
                    const userBidData = await contract.getBid(userBidIdResult);
                    setUserBid(userBidData);
                }
                const pendingReturnResult = await contract.getPendingReturn(address);
                setPendingReturn(Number(pendingReturnResult));
            } catch (e) {
                // User hasn't bid
            }
        };
        fetchAuction();
    }, [walletClient, address, id]);

    const handleWithdrawRefund = async () => {
        if (!walletClient) return;
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(walletClient.transport);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            const tx = await contract.withdrawRefund(id);
            await tx.wait();
            // Refresh data
            window.location.reload();
        } catch (err: any) {
            console.error('Withdraw failed:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFulfillHighestBid = async () => {
        if (!walletClient) return;
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(walletClient.transport);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            const highestBid = Number(auction.highestBid);
            const reservePrice = 0.001 * 10 ** 18; // 0.001 ETH in wei
            const paymentAmount = highestBid - reservePrice;
            const tx = await contract.fulfillHighestBid(id, { value: paymentAmount });
            await tx.wait();
            // Refresh data
            window.location.reload();
        } catch (err: any) {
            console.error('Fulfill failed:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizeAuction = async () => {
        if (!walletClient) return;
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(walletClient.transport);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            const tx = await contract.finalizeAuction(id);
            await tx.wait();
            // Refresh data
            window.location.reload();
        } catch (err: any) {
            console.error('Finalize failed:', err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper functions to check user roles
    const isBiddingEnded = () => currentBlock >= Number(auction?.biddingEndBlock);
    const isHighestBidder = () => address === auction?.highestBidder;
    const isAuctionOwner = () => address === auction?.owner;
    const hasUserBid = () => userBidId && userBidId > 0;
    const canWithdrawRefund = () => hasUserBid() && !isHighestBidder();

    return (
        isConnected ? (
            <div>
                <Header />
                <div className="pt-24 min-h-screen bg-white-pattern font-sans flex flex-col items-center py-12 px-4">
                    <div className="w-full max-w-6xl bg-white">
                        {/* Section Title and Subtitle */}
                        <div className="mb-10">
                            <h1 className="text-5xl sm:text-6xl font-funnel-display font-light text-gray-900 mb-4">
                                Auction <span className="font-bold">Details</span>
                            </h1>
                            <p className="text-gray-500 text-lg max-w-2xl">
                                Randamu's Blocklock Encryption keeps your bid encrypted till the auction ends.
                            </p>
                        </div>
                        {/* Two-column layout */}
                        <div className="flex flex-col md:flex-row gap-4 items-center md:items-stretch">
                            {/* Left: Large Image */}
                            <div className="w-1/2 flex items-center justify-start">
                                <div className="max-w-md aspect-square bg-blue-600 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={id % 2 === 0 ? '/assets/images/dark.jpg' : '/assets/images/light.jpg'}
                                        alt={auction?.title}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            </div>
                            {/* Right: Info and Actions */}
                            <div className="w-full flex flex-col justify-start p-4">
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-funnel-display mb-4">
                                    {auction?.title}
                                </h2>

                                {auction ? (
                                    <div>
                                        <div className="mb-6">
                                            <table className="w-full border-collapse border border-gray-300">
                                                <tbody>
                                                    <tr className="border-b border-gray-300">
                                                        <td className="px-4 py-3 font-funnel-display font-bold text-gray-900 bg-gray-50">Auction ID</td>
                                                        <td className="px-4 py-3 font-funnel-display text-gray-700">{auction.auctionID.toString()}</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-300">
                                                        <td className="px-4 py-3 font-funnel-display font-bold text-gray-900 bg-gray-50">Bidding End Block</td>
                                                        <td className="px-4 py-3 font-funnel-display text-gray-700">{auction.biddingEndBlock.toString()}</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-300">
                                                        <td className="px-4 py-3 font-funnel-display font-bold text-gray-900 bg-gray-50">Owner</td>
                                                        <td className="px-4 py-3 font-funnel-display text-gray-700">{auction.owner}</td>
                                                    </tr>
                                                    {auction.auctionEnded && (
                                                        <>
                                                            <tr className="border-b border-gray-300">
                                                                <td className="px-4 py-3 font-funnel-display font-bold text-gray-900 bg-gray-50">Highest Bid</td>
                                                                <td className="px-4 py-3 font-funnel-display text-green-600 font-bold">{ethers.formatEther(auction.highestBid)} ETH</td>
                                                            </tr>
                                                            <tr className="border-b border-gray-300">
                                                                <td className="px-4 py-3 font-funnel-display font-bold text-gray-900 bg-gray-50">Winner</td>
                                                                <td className="px-4 py-3 font-funnel-display text-gray-700 font-bold">{auction.highestBidder}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="px-4 py-3 font-funnel-display font-bold text-gray-900 bg-gray-50">Payment Status</td>
                                                                <td className="px-4 py-3 font-funnel-display">
                                                                    {auction.highestBidPaid ? (
                                                                        <span className="text-green-600 font-bold">✓ Completed</span>
                                                                    ) : (
                                                                        <span className="text-red-600 font-bold">Pending</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {currentBlock < Number(auction.biddingEndBlock) ? (
                                            <div className="mb-6">
                                                <h3 className="text-xl font-bold font-funnel-display text-gray-900 mb-4">Place Your Bid</h3>
                                                <div className="flex flex-wrap gap-4">
                                                    <input
                                                        type="number"
                                                        placeholder="Enter your bid in ETH"
                                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 font-funnel-display text-lg"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            console.log("Bid placed");
                                                        }}
                                                        className="px-6 py-3 border border-gray-300 bg-white text-gray-900 font-funnel-display text-lg font-bold hover:border-gray-400 transition-colors shadow-sm"
                                                    >
                                                        Place Bid
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-5 h-5 ml-2 inline"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M17.25 6.75V17.25M17.25 6.75H6.75M17.25 6.75L6.75 17.25"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-6">
                                                <div className="text-lg font-funnel-display text-red-500 font-bold">
                                                    Bidding Closed
                                                </div>
                                            </div>
                                        )}

                                        {auction && isBiddingEnded() && !auction.auctionEnded && (
                                            <div className="mb-6">
                                                <h3 className="text-xl font-bold font-funnel-display text-gray-900 mb-4">Available Actions</h3>
                                                <div className="flex flex-wrap gap-4">
                                                    {canWithdrawRefund() !== 0 && pendingReturn !== 0 && (
                                                        <button
                                                            onClick={handleWithdrawRefund}
                                                            disabled={loading}
                                                            className="px-6 py-3 bg-blue-600 text-white font-funnel-display font-bold hover:bg-blue-700 disabled:opacity-50"
                                                        >
                                                            {loading ? 'Withdrawing...' : 'Withdraw Refund'}
                                                        </button>
                                                    )}

                                                    {isHighestBidder() && !auction.highestBidPaid && (
                                                        <button
                                                            onClick={handleFulfillHighestBid}
                                                            disabled={loading}
                                                            className="px-6 py-3 bg-green-600 text-white font-funnel-display font-bold hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            {loading ? 'Paying...' : 'Pay Winning Bid'}
                                                        </button>
                                                    )}

                                                    {isAuctionOwner() && !auction.auctionEnded && (
                                                        <button
                                                            onClick={handleFinalizeAuction}
                                                            disabled={loading}
                                                            className="px-6 py-3 bg-blue-600 text-white font-funnel-display font-bold hover:bg-blue-700 disabled:opacity-50"
                                                        >
                                                            {loading ? 'Finalizing...' : 'Finalize Auction'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="font-funnel-display text-lg text-gray-700">Loading auction...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : <Wallet />)
};

export default BidPage;
