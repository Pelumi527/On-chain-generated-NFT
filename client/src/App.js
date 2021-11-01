import './App.css';
import React, { useState, useEffect } from "react"
import {ethers} from "ethers"
import twitterLogo from './assets/twitter.svg';
import myEpicNft from "./utils/myEpicNFT.json";
import {Spinner} from "react-bootstrap"



// Constants
const TWITTER_HANDLE = 'FatoluP';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const CONTRACT_ADDRESS = "0x5ddd10fadeA217fD7Ab36B6c263C71c490936997";

  const [currentAccount, setCurrentAccount] = useState(undefined)
  const [mintedNFT, setMintedNFT] = useState(0)
  const [isloading, setIsLoading] = useState(false)
  // Render Methods
   const checkIfWalletIsConnected = async () => {
    const {ethereum} = window;

    if (!ethereum) {
      // console.log("make sure you have metamask");
      return
    } else {
      // console.log("We have an ethereum object", ethereum);
    }

    const accounts = ethereum.request({method: 'eth_accounts'});

    if (accounts.length !== 0) {
      const account = accounts[0];
      // console.log("Found an authorized account", account);

      setupEventListener()
      setCurrentAccount(account)
    } else {
      // console.log("No authorized account found");
    }

  }



  const connectWallet = async () => {
    const {ethereum} = window;
    let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }

      try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 


      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const {ethereum} = window;

      if(ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")
      } else{
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalMinted = async () => {
    try {
      const {ethereum} = window;

      if(ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        let minted =  await connectedContract.TotalMintedSoFar()
        console.log(minted)
        setMintedNFT(minted.toNumber() + 1)


        console.log("Setup event listener!")
      } else{
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }

  } 

  const askContractToMintNft = async () => {
    
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();
        setIsLoading(true)
        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

        getTotalMinted()
        setIsLoading(false)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}


  useEffect(() => {
    checkIfWalletIsConnected();
    getTotalMinted()
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === undefined ? (
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
              Connect to Wallet
            </button>
          ) : (
            <button onClick={() => [askContractToMintNft()]} className="cta-button connect-wallet-button">
             {isloading == true ? 
              ( <Spinner animation="border" variant="primary">Processing</Spinner>)             
            : "Mint NFT"}
            </button>
          )}
        </div>
        <div>
          <p className="gradient-text">{mintedNFT} out of {TOTAL_MINT_COUNT} NFTs minted.</p>
          <div>
              <button className="cta-button connect-wallet-button">
                <a href="https://testnets.opensea.io/collection/randomcryto-h8nhweluoy" target="_blank">View NFT Collection</a>
              </button>
          </div>
        </div>
        <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

// {loading == true ?
//   (<span className="sr-only spinner-grow text-primary" role="status"></span>
//   ) : ("Mint NFT")}