"use client";
import React, { useState } from "react";
import Header from "../../components/header";
import Wallet from "../wallet";
import { useAccount, useWalletClient } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract";

const LaunchAuctionPage = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [biddingEndBlock, setBiddingEndBlock] = useState(0);
  const [status, setStatus] = useState<null | "pending" | "success" | "error">(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("pending");
    setError(null);
    setTxHash(null);
    try {
      if (!walletClient) throw new Error("Wallet not connected");
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "launchAuction",
        args: [biddingEndBlock],
      });
      setTxHash(hash);
      setStatus("success");
    } catch (err: any) {
      setError(err?.message || "Transaction failed");
      setStatus("error");
    }
  };

  if (!isConnected) return <Wallet />;

  return (
    <div className="min-h-screen bg-white-pattern font-sans">
      <Header />
      <div className="pt-24 min-h-screen flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8">
          <h1 className="text-5xl sm:text-6xl font-funnel-display font-light text-gray-900 mb-4">
            Launch <span className="font-bold">Auction</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 font-funnel-display">
            Start a new sealed-bid auction by specifying the bidding end block.
          </p>
          <form onSubmit={handleLaunch} className="flex flex-col gap-6">
            <label className="font-funnel-display text-lg text-gray-700">
              Bidding End Block
              <input
                type="number"
                min={0}
                value={biddingEndBlock}
                onChange={e => setBiddingEndBlock(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 font-funnel-display text-lg mt-2"
                required
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 bg-white text-gray-900 font-funnel-display text-lg font-bold hover:border-gray-400 transition-colors shadow-sm rounded-md"
              disabled={status === "pending"}
            >
              {status === "pending" ? "Launching..." : "Launch Auction"}
            </button>
          </form>
          {status === "success" && txHash && (
            <div className="mt-6 text-green-600 font-funnel-display">
              Auction launched!<br />
              <span className="break-all">Tx: {txHash}</span>
            </div>
          )}
          {status === "error" && error && (
            <div className="mt-6 text-red-600 font-funnel-display">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchAuctionPage; 