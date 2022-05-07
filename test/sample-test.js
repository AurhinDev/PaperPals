const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Initial Deployment", function () {
  it("Should deploy all contracts", async function () {
    
    const [owner, operator] = await ethers.getSigners();

    // Deploy Proxy
    const UpgradableProxy = await ethers.getContractFactory("UpgradableProxy");
    const proxy = await UpgradableProxy.deploy();
    await proxy.deployed();

    expect(await proxy.proxyOwner()).to.equal(owner.address);

    // Deploy Erc20
    const INKCoin = await ethers.getContractFactory("INKCoin");
    const ink = await INKCoin.deploy();
    await ink.deployed();

    expect(await ink.isController(owner.address)).to.equal(true);
    expect(await ink.balanceOf(owner.address)).to.equal(10000);

    // Deploy Erc1155
    const PaperPals = await ethers.getContractFactory("PaperPals");
    const papa = await PaperPals.deploy();
    await papa.deployed();

    await papa.setInkAddress(ink.address);

    //Set Implementation
    await proxy.upgradeTo(papa.address);
    expect(await proxy.implementation()).to.equal(papa.address);

    expect(await papa.diamond_supply()).to.equal(1);
    expect(await papa.gold_supply()).to.equal(2);
    expect(await papa.silver_supply()).to.equal(3);
    expect(await papa.bronze_supply()).to.equal(4);
    expect(await papa.getSupply()).to.equal(10);

    expect(await papa.paused()).to.equal(true);
    await papa.pause(false);
    expect(await papa.paused()).to.equal(false);

    expect(await papa.balanceOf(owner.address, 0)).to.equal(1);
    expect(await papa.balanceOf(owner.address, 1)).to.equal(2);
    expect(await papa.balanceOf(owner.address, 2)).to.equal(3);
    expect(await papa.balanceOf(owner.address, 3)).to.equal(4);

    await papa.writeMessage(0, '1st Diamond submission ');
    expect(await papa.readMessage(0)).to.equal('1st Diamond submission ');
    await papa.writeMessage(1, '1st Gold submission');
    expect(await papa.readMessage(1)).to.equal("1st Gold submission");
    
    await expect(papa.writeMessage(2, 'This is the first Silver submission')).to.be.revertedWith("Message is too long");
    expect(await papa.readMessage(2)).to.equal('');

    await expect(papa.writeMessage(3, 'This is the first Bronze submission')).to.be.revertedWith("Message is too long");
    expect(await papa.readMessage(3)).to.equal('');

    //Metadata changes depending on how much the book is filled
    expect(await papa.tierURI(0)).to.equal("https://saint.mypinata.cloud/ipfs/QmfPgMGgi2vLy33wvpYq18BWoHFM995W9SmzbBgkgqyZLn/0.json");
    await papa.writeMessage(0, '2nd ');
    await papa.writeMessage(0, '3rd ');
    await papa.writeMessage(0, '4th ');
    expect(await papa.tierURI(0)).to.equal("https://saint.mypinata.cloud/ipfs/QmYWh6TGLspPGBpSCcsvN2fwLwiXPVnzR5NBTuz1PdexnS/0.json");
    await papa.writeMessage(0, '5th ');
    await papa.writeMessage(0, '6th ');
    await papa.writeMessage(0, '7th ');
    await papa.writeMessage(0, '8th ');
    await papa.writeMessage(0, '9th ');
    await papa.writeMessage(0, '10th ');
    expect(await papa.tierURI(0)).to.equal("https://saint.mypinata.cloud/ipfs/QmZ5EsMoqdpP8Jt7hd5q8kQ2XTEARD8kYFqbWU9DvztUw7/0.json");

    // Connect another account without ink balance

    expect(await ink.balanceOf(operator.address)).to.equal(0);

    await expect(papa.connect(operator).claim(1, {
      value: ethers.utils.parseEther("0")
    })).to.be.revertedWith("Need to send more value");

    await expect(papa.connect(operator).claim(0, {
			value: ethers.utils.parseEther('1'),
		})).to.be.revertedWith("Wrong mint amount");

    await expect(papa.connect(operator).claim(5, {
			value: ethers.utils.parseEther('1'),
		})).to.be.revertedWith("Can't mint that many");

    await expect(papa.connect(operator).claim(1, {
			value: ethers.utils.parseEther('1'),
		})).to.be.revertedWith("Not enough INK");

    // Try write without NFT
    await expect(papa.connect(operator).writeMessage(2, "I'm operator")).to.be.revertedWith("Must hold paper of this tier to write");

    // Send over INK, to allow mint and then writing
    await ink.approve(owner.address, 500);
    await ink.transferFrom(owner.address, operator.address, 200);
    expect(await ink.allowance(owner.address, owner.address)).to.equal(300);

    expect(await ink.balanceOf(owner.address)).to.equal(9800);
    expect(await ink.balanceOf(operator.address)).to.equal(200);

    await papa.connect(operator).claim(1, {
			value: ethers.utils.parseEther('1'),
		});

    // Operator should have minted 1 Silver Tier NFT
    expect(await papa.balanceOf(operator.address, 2)).to.equal(1);

    // Silver NFT max message length is 16char
    await expect(papa.connect(operator).writeMessage(2, "I'm operator. Hey! How are you doing???")).to.be.revertedWith("Message is too long");

    // No empty messages allowed
    await expect(papa.connect(operator).writeMessage(2, "")).to.be.revertedWith("Can't push empty messages");

    await papa.connect(operator).writeMessage(2, 'I am operator. ')

    await papa.connect(owner).writeMessage(2, 'I am owner.')

    expect(await papa.readMessage(2)).to.equal('I am operator. I am owner.');
    expect(await papa.getSupply()).to.equal(11);
    expect(await papa.readMessage(0)).to.equal('1st Diamond submission 2nd 3rd 4th 5th 6th 7th 8th 9th 10th ');

  });
});
