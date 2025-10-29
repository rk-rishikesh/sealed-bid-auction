// Base Sepolia
export const CONTRACT_ADDRESS = "0x6c11615AC3726e621e0fD477Ff6db69F9CbE3850"

export const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "blocklockSender",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "AuctionFinalized",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "biddingEndBlock",
				"type": "uint256"
			}
		],
		"name": "AuctionLaunched",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "requestId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "unsealedBid",
				"type": "uint256"
			}
		],
		"name": "BidRevealed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Funded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "HighestBidFulfilled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "subscriptionId",
				"type": "uint256"
			}
		],
		"name": "NewSubscriptionId",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "OwnershipTransferRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RefundWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "requestId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			}
		],
		"name": "SealedBidPlaced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "RESERVE_PRICE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "acceptOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "auctions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "auctionID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "biddingEndBlock",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "highestBid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "revealedBidsCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBids",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "highestBidder",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "highestBidPaid",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "auctionEnded",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "blocklock",
		"outputs": [
			{
				"internalType": "contract IBlocklockSender",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "createSubscriptionAndFundNative",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "creatorAuctions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "finalizeAuction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "fulfillHighestBid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fundContractNative",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "getAuction",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "auctionID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "biddingEndBlock",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "highestBid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "revealedBidsCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBids",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "highestBidder",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "highestBidPaid",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "auctionEnded",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "requestId",
				"type": "uint256"
			}
		],
		"name": "getBid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "auctionID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "requestID",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"components": [
					{
						"components": [
							{
								"internalType": "uint256[2]",
								"name": "x",
								"type": "uint256[2]"
							},
							{
								"internalType": "uint256[2]",
								"name": "y",
								"type": "uint256[2]"
							}
						],
						"internalType": "struct BLS.PointG2",
						"name": "u",
						"type": "tuple"
					},
					{
						"internalType": "bytes",
						"name": "v",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "w",
						"type": "bytes"
					}
				],
				"internalType": "struct TypesLib.Ciphertext",
				"name": "sealedBid",
				"type": "tuple"
			},
			{
				"internalType": "bytes",
				"name": "decryptionKey",
				"type": "bytes"
			},
			{
				"internalType": "uint256",
				"name": "unsealedBid",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "revealed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			}
		],
		"name": "getCreatorAuctions",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getPendingReturn",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserBidId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "requestId",
				"type": "uint256"
			}
		],
		"name": "isInFlight",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_biddingEndBlock",
				"type": "uint256"
			}
		],
		"name": "launchAuction",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextAuctionId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "subId",
				"type": "uint256"
			}
		],
		"name": "pendingRequestExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "pendingReturns",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"internalType": "uint32",
				"name": "callbackGasLimit",
				"type": "uint32"
			},
			{
				"components": [
					{
						"components": [
							{
								"internalType": "uint256[2]",
								"name": "x",
								"type": "uint256[2]"
							},
							{
								"internalType": "uint256[2]",
								"name": "y",
								"type": "uint256[2]"
							}
						],
						"internalType": "struct BLS.PointG2",
						"name": "u",
						"type": "tuple"
					},
					{
						"internalType": "bytes",
						"name": "v",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "w",
						"type": "bytes"
					}
				],
				"internalType": "struct TypesLib.Ciphertext",
				"name": "sealedBid",
				"type": "tuple"
			}
		],
		"name": "placeSealedBid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "requestId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "decryptionKey",
				"type": "bytes"
			}
		],
		"name": "receiveBlocklock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_blocklock",
				"type": "address"
			}
		],
		"name": "setBlocklock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "subId",
				"type": "uint256"
			}
		],
		"name": "setSubId",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "subscriptionId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "topUpSubscriptionNative",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "consumers",
				"type": "address[]"
			}
		],
		"name": "updateSubscription",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userBidID",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userBids",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "auctionID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "requestID",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"components": [
					{
						"components": [
							{
								"internalType": "uint256[2]",
								"name": "x",
								"type": "uint256[2]"
							},
							{
								"internalType": "uint256[2]",
								"name": "y",
								"type": "uint256[2]"
							}
						],
						"internalType": "struct BLS.PointG2",
						"name": "u",
						"type": "tuple"
					},
					{
						"internalType": "bytes",
						"name": "v",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "w",
						"type": "bytes"
					}
				],
				"internalType": "struct TypesLib.Ciphertext",
				"name": "sealedBid",
				"type": "tuple"
			},
			{
				"internalType": "bytes",
				"name": "decryptionKey",
				"type": "bytes"
			},
			{
				"internalType": "uint256",
				"name": "unsealedBid",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "revealed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"name": "withdrawNative",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "withdrawRefund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]