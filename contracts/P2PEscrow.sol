// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title P2P Marketplace Escrow
/// @notice MVP escrow for a buyer/seller trade. Funds stay locked until the buyer confirms delivery.
contract P2PEscrow {
    enum TradeStatus {
        Created,
        Funded,
        Released,
        Cancelled
    }

    struct Trade {
        address payable seller;
        address buyer;
        uint256 amount;
        string productId;
        uint256 createdAt;
        TradeStatus status;
    }

    uint256 public nextTradeId;
    mapping(uint256 => Trade) public trades;

    event TradeCreated(uint256 indexed tradeId, address indexed seller, address indexed buyer, string productId);
    event TradeFunded(uint256 indexed tradeId, address indexed buyer, uint256 amount);
    event TradeReleased(uint256 indexed tradeId, address indexed seller, uint256 amount);
    event TradeCancelled(uint256 indexed tradeId);

    modifier tradeExists(uint256 tradeId) {
        require(tradeId < nextTradeId, "Trade does not exist");
        _;
    }

    modifier onlyBuyer(uint256 tradeId) {
        require(msg.sender == trades[tradeId].buyer, "Only buyer allowed");
        _;
    }

    modifier inStatus(uint256 tradeId, TradeStatus expectedStatus) {
        require(trades[tradeId].status == expectedStatus, "Invalid trade status");
        _;
    }

    /// @notice Creates a trade. The caller becomes the buyer.
    /// @param seller Address that will receive the escrowed funds after delivery confirmation.
    /// @param productId Marketplace product identifier associated with this trade.
    /// @return tradeId The id assigned to the new trade.
    function createTrade(address seller, string memory productId) external returns (uint256 tradeId) {
        require(seller != address(0), "Seller cannot be zero address");
        require(seller != msg.sender, "Buyer cannot be seller");

        tradeId = nextTradeId;
        trades[tradeId] = Trade({
            seller: payable(seller),
            buyer: msg.sender,
            amount: 0,
            productId: productId,
            createdAt: block.timestamp,
            status: TradeStatus.Created
        });

        nextTradeId++;

        emit TradeCreated(tradeId, seller, msg.sender, productId);
    }

    /// @notice Funds a created trade. Only the buyer can deposit.
    /// @param tradeId Trade id to fund.
    function fundTrade(uint256 tradeId)
        external
        payable
        tradeExists(tradeId)
        onlyBuyer(tradeId)
        inStatus(tradeId, TradeStatus.Created)
    {
        require(msg.value > 0, "Amount must be greater than zero");

        Trade storage trade = trades[tradeId];
        trade.amount = msg.value;
        trade.status = TradeStatus.Funded;

        emit TradeFunded(tradeId, msg.sender, msg.value);
    }

    /// @notice Confirms delivery and releases the escrowed funds to the seller.
    /// @param tradeId Trade id to release.
    function confirmDelivery(uint256 tradeId)
        external
        tradeExists(tradeId)
        onlyBuyer(tradeId)
        inStatus(tradeId, TradeStatus.Funded)
    {
        Trade storage trade = trades[tradeId];
        uint256 amount = trade.amount;
        address payable seller = trade.seller;

        trade.status = TradeStatus.Released;
        trade.amount = 0;

        (bool sent, ) = seller.call{value: amount}("");
        require(sent, "Payment failed");

        emit TradeReleased(tradeId, seller, amount);
    }

    /// @notice Cancels a trade that has not been funded yet.
    /// @param tradeId Trade id to cancel.
    function cancelTrade(uint256 tradeId)
        external
        tradeExists(tradeId)
        onlyBuyer(tradeId)
        inStatus(tradeId, TradeStatus.Created)
    {
        trades[tradeId].status = TradeStatus.Cancelled;

        emit TradeCancelled(tradeId);
    }

    /// @notice Returns all trade data in a frontend-friendly shape.
    /// @param tradeId Trade id to read.
    function getTrade(uint256 tradeId)
        external
        view
        tradeExists(tradeId)
        returns (
            address seller,
            address buyer,
            uint256 amount,
            string memory productId,
            uint256 createdAt,
            TradeStatus status
        )
    {
        Trade storage trade = trades[tradeId];

        return (trade.seller, trade.buyer, trade.amount, trade.productId, trade.createdAt, trade.status);
    }
}
