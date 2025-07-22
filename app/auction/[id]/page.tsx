"use client";
import React, { useEffect, useState } from "react";
import Header from "../header";
import { useParams } from 'next/navigation';

// Mock data for the auction item
const auctionItem = {
    title: 'Item',
    date: 'August 02, 2025',
};

const BidPage = () => {
    const params = useParams();
    const id = typeof params.id === 'string' ? parseInt(params.id, 10) : 0;
    const title = "Item";
    const date = "August 02, 2025";

    // Timer logic
    const [timeLeft, setTimeLeft] = useState("");
    useEffect(() => {
        const endDate = new Date(date);
        const updateTimer = () => {
            const now = new Date();
            const diff = endDate.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft("Auction ended");
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            let str = "";
            if (days > 0) str += `${days}d `;
            if (hours > 0 || days > 0) str += `${hours}h `;
            if (minutes > 0 || hours > 0 || days > 0) str += `${minutes}m `;
            str += `${seconds}s left`;
            setTimeLeft(str);
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [date]);

    return (
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
                                    alt={auctionItem.title}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        </div>
                        {/* Right: Info and Actions */}
                        <div className="w-full flex flex-col justify-start p-4">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-funnel-display mb-4">
                                {auctionItem.title}
                            </h2>


                            <div className="flex flex-wrap gap-4">
                                {/* Timer */}
                                <div className="w-full mb-4 text-lg font-funnel-display text-blue-700">
                                    {timeLeft}
                                </div>
                                {/* Input Number    */}
                                <input
                                    type="number"
                                    placeholder="Enter your bid in dollars"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 font-funnel-display text-lg"
                                />

                                <button
                                    onClick={() => {
                                        console.log("Bid placed");
                                    }}
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 bg-white text-gray-900 font-funnel-display text-lg font-bold hover:border-gray-400 transition-colors shadow-sm"
                                >
                                    Place Bid
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
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default BidPage;
