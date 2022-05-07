# Paper Pals

Paper Pals is an ERC1155 Smart Contract and was done as part of a 24h Code Jam challenge for DoinGud.

The premise of Paper Pals collaborative documentation and the minting is meant to be as a loyalty token for holders of the ERC20 Token InkCoin. In order to mint Paper Pals the minter needs to hold an amount of InkCoins, the amounts determines the rarity of Paper Pals they will be able to mint (as too incentivize holding a larger stake in token).

Minting does however require a payment of 0.08 ether per piece and all shares are split evenly between two addresses on withdrawal.

Each tier of Paper Pals has a max supply and they all provide the utility of writing into a collective message, the tier of the NFT determines which book you write to aswell as how long each of your messages can be. 

Furthermore, the NFTs also mutate as the metadata (and images) of the NFT will change for every NFT in the same tier depending on how much has been written into it. First the NFT will look like a blank parchment, then a few pages and finally into a fully fledged book. All determined by the amount of content inside it.

The contract itself is also upgradeable by utilizing a proxy architecture and partial unit tests through Hardhat has been added to ensure tested functionality.

Contract can be seen live on Polygon
Proxy: https://polygonscan.com/address/0x7ead7eff0ef7cacfcbe30bf39219857aa2454304#code
InkCoin: https://polygonscan.com/address/0x613c5697ba2badb10d18c6c3756b8eaf43201697#code
PaperPals:https://polygonscan.com/address/0x7791f4146ca4680c1865c324a0e008465617215e#code

# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
