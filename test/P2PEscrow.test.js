const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("P2PEscrow", function () {
  async function deployFixture() {
    const [buyer, seller, other] = await ethers.getSigners();
    const P2PEscrow = await ethers.getContractFactory("P2PEscrow");
    const escrow = await P2PEscrow.deploy();

    return { escrow, buyer, seller, other };
  }

  it("creates a trade with the caller as buyer", async function () {
    const { escrow, buyer, seller } = await deployFixture();

    await expect(escrow.connect(buyer).createTrade(seller.address))
      .to.emit(escrow, "TradeCreated")
      .withArgs(0, seller.address, buyer.address);

    const trade = await escrow.trades(0);
    expect(trade.seller).to.equal(seller.address);
    expect(trade.buyer).to.equal(buyer.address);
    expect(trade.amount).to.equal(0);
    expect(trade.status).to.equal(0);
  });

  it("lets only the buyer fund a created trade", async function () {
    const { escrow, buyer, seller, other } = await deployFixture();
    const amount = ethers.parseEther("1");

    await escrow.connect(buyer).createTrade(seller.address);

    await expect(
      escrow.connect(other).fundTrade(0, { value: amount }),
    ).to.be.revertedWith("Only buyer allowed");

    await expect(escrow.connect(buyer).fundTrade(0, { value: amount }))
      .to.emit(escrow, "TradeFunded")
      .withArgs(0, buyer.address, amount);

    const trade = await escrow.trades(0);
    expect(trade.amount).to.equal(amount);
    expect(trade.status).to.equal(1);
  });

  it("releases funds to the seller when the buyer confirms delivery", async function () {
    const { escrow, buyer, seller } = await deployFixture();
    const amount = ethers.parseEther("1");

    await escrow.connect(buyer).createTrade(seller.address);
    await escrow.connect(buyer).fundTrade(0, { value: amount });

    const releaseTx = escrow.connect(buyer).confirmDelivery(0);

    await expect(releaseTx)
      .to.emit(escrow, "TradeReleased")
      .withArgs(0, seller.address, amount);
    await expect(releaseTx).to.changeEtherBalances([escrow, seller], [-amount, amount]);

    const trade = await escrow.trades(0);
    expect(trade.amount).to.equal(0);
    expect(trade.status).to.equal(2);
  });

  it("prevents non-buyers from confirming delivery", async function () {
    const { escrow, buyer, seller, other } = await deployFixture();

    await escrow.connect(buyer).createTrade(seller.address);
    await escrow.connect(buyer).fundTrade(0, { value: ethers.parseEther("1") });

    await expect(escrow.connect(other).confirmDelivery(0)).to.be.revertedWith(
      "Only buyer allowed",
    );
  });

  it("cancels only trades that are not funded", async function () {
    const { escrow, buyer, seller } = await deployFixture();

    await escrow.connect(buyer).createTrade(seller.address);

    await expect(escrow.connect(buyer).cancelTrade(0))
      .to.emit(escrow, "TradeCancelled")
      .withArgs(0);

    expect((await escrow.trades(0)).status).to.equal(3);

    await escrow.connect(buyer).createTrade(seller.address);
    await escrow.connect(buyer).fundTrade(1, { value: ethers.parseEther("1") });

    await expect(escrow.connect(buyer).cancelTrade(1)).to.be.revertedWith(
      "Invalid trade status",
    );
  });
});
