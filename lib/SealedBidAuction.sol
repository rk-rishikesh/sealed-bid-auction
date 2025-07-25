// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TypesLib} from "blocklock-solidity/src/libraries/TypesLib.sol";
import {AbstractBlocklockReceiver} from "blocklock-solidity/src/AbstractBlocklockReceiver.sol";
// Import ReentrancyGuard which is an Openzeppelin solidity library that helps prevent reentrant calls to a function.
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SealedBidAuction 
    is AbstractBlocklockReceiver, ReentrancyGuard 
    { 

    uint256 public nextAuctionId;

    struct AuctionData {
        uint256 auctionID;
        uint256 biddingEndBlock;
        uint256 highestBid;
        uint256 revealedBidsCount;
        uint256 totalBids;
        address highestBidder;
        address owner;
        bool highestBidPaid;
        bool auctionEnded;
    }

    mapping(uint256 => AuctionData) public auctions;

    struct Bid {
        uint256 auctionID;
        uint256 requestID;
        address bidder; 
        TypesLib.Ciphertext sealedBid; // Encrypted / sealed bid amount
        bytes decryptionKey; // The timelock decryption key used to unseal the sealed bid
        uint256 unsealedBid; // Decrypted/unsealed bid amount, revealed after auction end
        bool revealed; // Status of whether the bid has been revealed
    }

    mapping(uint256 => Bid) public userBids;
    mapping(address => uint256) public userBidID;
    mapping(address => uint256) public pendingReturns;
    
    // Track auctions created by each creator
    mapping(address => uint256[]) public creatorAuctions;
    
    uint256 public constant RESERVE_PRICE = 0.001 ether;

    // Events
    event AuctionLaunched(uint256 indexed auctionId, address indexed owner, uint256 biddingEndBlock);
    event SealedBidPlaced(uint256 indexed auctionId, uint256 indexed requestId, address indexed bidder);
    event BidRevealed(uint256 indexed auctionId, uint256 indexed requestId, address indexed bidder, uint256 unsealedBid);
    event HighestBidFulfilled(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event RefundWithdrawn(uint256 indexed auctionId, address indexed user, uint256 amount);
    event AuctionFinalized(uint256 indexed auctionId);

    modifier onlyBeforeAuctionEnds(uint256 auctionid) {
        require(block.number < auctions[auctionid].biddingEndBlock, "Auction has already ended.");
        _;
    }

    modifier onlyAfterAuctionEnds(uint256 auctionid) {
        require(block.number > auctions[auctionid].biddingEndBlock, "Auction is yet to end.");
        _;
    }

    modifier validateReservePrice() {
        require(msg.value > RESERVE_PRICE, "Bid must be accompanied by a deposit larger to the reserve price.");
        _;
    }

    modifier onlyAfterBidsUnsealed(uint256 auctionid) {
        require(auctions[auctionid].revealedBidsCount == auctions[auctionid].totalBids, "Not all bids have been revealed.");
        _;
    }

    constructor(address blocklockSender) AbstractBlocklockReceiver(blocklockSender) {}

    function launchAuction(uint256 _biddingEndBlock) external returns(uint256) {
        uint256 auctionId = nextAuctionId;
        nextAuctionId++;
        AuctionData storage newAuction = auctions[auctionId];
        newAuction.auctionID = auctionId;
        newAuction.biddingEndBlock = _biddingEndBlock;
        newAuction.owner = msg.sender;
        auctions[auctionId] = newAuction;
        creatorAuctions[msg.sender].push(auctionId);
        emit AuctionLaunched(auctionId, msg.sender, _biddingEndBlock);
        return auctionId;
    }

    function placeSealedBid(
            uint256 auctionId,
            uint32 callbackGasLimit,
            TypesLib.Ciphertext calldata sealedBid
        )external
         payable
         validateReservePrice
         onlyBeforeAuctionEnds(auctionId)
         returns (uint256)
    {
        uint256 biddingEndBlock = auctions[auctionId].biddingEndBlock;

        bytes memory blockLockCondition = abi.encodePacked(hex"42", abi.encode(biddingEndBlock));
        (uint256 requestID, uint256 requestPrice) =
            _requestBlocklockPayInNative(callbackGasLimit, blockLockCondition, sealedBid);

        Bid memory newBid = Bid({
            auctionID: auctionId,
            requestID: requestID,
            bidder: msg.sender,
            sealedBid: sealedBid,
            decryptionKey: hex"",
            unsealedBid: 0,
            revealed: false
        });

        userBids[requestID] = newBid;
        userBidID[msg.sender] = requestID;
        auctions[auctionId].totalBids = auctions[auctionId].totalBids + 1;
        pendingReturns[msg.sender] = RESERVE_PRICE;
        emit SealedBidPlaced(auctionId, requestID, msg.sender);
        return requestID;
    }


    function _requestBlocklockPayInNative(
        uint32 callbackGasLimit,
        bytes memory condition,
        TypesLib.Ciphertext calldata ciphertext
    ) internal override returns (uint256 requestId, uint256 requestPrice) {
        requestPrice = blocklock.calculateRequestPriceNative(callbackGasLimit);

        require(msg.value >= requestPrice, "Insufficient ETH");

        requestId = blocklock.requestBlocklock{value: (msg.value - RESERVE_PRICE)}(callbackGasLimit, condition, ciphertext);
    }

    function _onBlocklockReceived(uint256 requestID, bytes calldata decryptionKey)
        internal
        override
    {
        require(
            userBids[requestID].decryptionKey.length == 0, "Bid decryption key already received from timelock contract."
        );

        // update the stored bid data
        Bid storage bid = userBids[requestID];
        bid.decryptionKey = decryptionKey;
        bid.revealed = true;

        // decrypt bid amount
        uint256 decryptedSealedBid = abi.decode(_decrypt(bid.sealedBid, decryptionKey), (uint256));
        bid.unsealedBid = decryptedSealedBid;

        // update highest bid
        updateHighestBid(bid.auctionID ,requestID, decryptedSealedBid);
        emit BidRevealed(bid.auctionID, requestID, bid.bidder, decryptedSealedBid);
    }

    function updateHighestBid(uint256 auctionId, uint256 bidID, uint256 unsealedBid) internal {
        Bid storage bid = userBids[bidID];

        bid.unsealedBid = unsealedBid;
        bid.revealed = true;
        auctions[auctionId].revealedBidsCount = auctions[auctionId].revealedBidsCount + 1;

        if (unsealedBid > auctions[auctionId].highestBid && userBids[bidID].unsealedBid > RESERVE_PRICE) {
            auctions[auctionId].highestBid = unsealedBid;
            auctions[auctionId].highestBidder = bid.bidder;
        }
    }

    function withdrawRefund(uint256 auctionId) external onlyAfterAuctionEnds(auctionId) nonReentrant {
        require(msg.sender != auctions[auctionId].highestBidder, "Highest bidder cannot withdraw refund.");
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "Nothing to withdraw.");
        pendingReturns[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit RefundWithdrawn(auctionId, msg.sender, amount);
    } 

     function fulfillHighestBid(uint256 auctionId) external payable onlyAfterAuctionEnds(auctionId) onlyAfterBidsUnsealed(auctionId) {
        
        require(auctions[auctionId].highestBid > 0, "Highest bid is zero.");
        require(msg.sender == auctions[auctionId].highestBidder, "Only the highest bidder can fulfil.");
        require(!auctions[auctionId].highestBidPaid, "Payment has already been completed.");
        require(
            msg.value == auctions[auctionId].highestBid - RESERVE_PRICE, "Payment must be equal to highest bid minus the reserve amount."
        );
        auctions[auctionId].highestBidPaid = true;
        pendingReturns[msg.sender] = 0;
        payable(auctions[auctionId].owner).transfer(msg.value + RESERVE_PRICE);
        emit HighestBidFulfilled(auctionId, msg.sender, msg.value + RESERVE_PRICE);
    }

    function finalizeAuction(uint256 auctionId) external onlyAfterBidsUnsealed(auctionId) {
        require(!auctions[auctionId].auctionEnded, "Auction already finalised.");
        auctions[auctionId].auctionEnded = true;
        emit AuctionFinalized(auctionId);
    }

    // Getter: Get auction details by auctionId
    function getAuction(uint256 auctionId) external view returns (
        uint256 auctionID,
        uint256 biddingEndBlock,
        uint256 highestBid,
        uint256 revealedBidsCount,
        uint256 totalBids,
        address highestBidder,
        address owner,
        bool highestBidPaid,
        bool auctionEnded
    ) {
        AuctionData storage a = auctions[auctionId];
        return (
            a.auctionID,
            a.biddingEndBlock,
            a.highestBid,
            a.revealedBidsCount,
            a.totalBids,
            a.highestBidder,
            a.owner,
            a.highestBidPaid,
            a.auctionEnded
        );
    }

    // Getter: Get bid details by requestId
    function getBid(uint256 requestId) external view returns (
        uint256 auctionID,
        uint256 requestID,
        address bidder,
        TypesLib.Ciphertext memory sealedBid,
        bytes memory decryptionKey,
        uint256 unsealedBid,
        bool revealed
    ) {
        Bid storage b = userBids[requestId];
        return (
            b.auctionID,
            b.requestID,
            b.bidder,
            b.sealedBid,
            b.decryptionKey,
            b.unsealedBid,
            b.revealed
        );
    }

    // Getter: Get the user's bid request ID
    function getUserBidId(address user) external view returns (uint256) {
        return userBidID[user];
    }

    // Getter: Get the user's pending return
    function getPendingReturn(address user) external view returns (uint256) {
        return pendingReturns[user];
    }

    // Getter: Get all auction IDs created by a specific creator
    function getCreatorAuctions(address creator) external view returns (uint256[] memory) {
        return creatorAuctions[creator];
    }

}
