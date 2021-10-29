
const hre = require("hardhat");

async function main() {
  const MyEpicNFT= await hre.ethers.getContractFactory("MyEpicNFT");
  const myEpicNFT = await MyEpicNFT.deploy();

  await myEpicNFT.deployed();

  console.log("myEpicNFT deployed to:", myEpicNFT.address);

  const txn = await myEpicNFT.makeAnEpicNFT();
  await txn.wait();
  console.log("Minted NFT1")

  const txn2 = await myEpicNFT.makeAnEpicNFT();
  await txn2.wait();
  console.log("Minted NFT2")

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
