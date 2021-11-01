//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = ["Metaverse", "NFT", "Future", "BlockChain", "Tokens", "Excited"];
    string[] secondWords = ["Web3", "Space", "OnChain", "Web3Bridge", "Layer 2", "CryptoCurriencies"];
    string[] thirdWords = ["Coin", "Community", "is", "Scalability", "Latency", "AreYouReady"];

    event NewEpicNFTMinted(address sender, uint256 tokenId);
    constructor() ERC721("RANDOMCRYTO", "RANDCRT"){
        console.log("This is my NFT contract. Whoa!");
    }


    function makeAnEpicNFT() public {
        require(_tokenIds.current() <= 49, "only 50 NFT avaliable");
        uint256 newItemId = _tokenIds.current();

        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));

        string memory finalSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>"));
        

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name: "',combinedWord,
                        '", "description": "A highly acclaimed collection of random words.", "images": "data:image/svg+xml;base64,',

                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");


        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, "finalTokenUri");

        _tokenIds.increment();
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }

    function TotalMintedSoFar() public view returns(uint256){
        return _tokenIds.current();
    }

    function pickRandomFirstWord(uint tokenId) internal view returns (string memory){
        // seed the random generator
        uint rand = random(string(abi.encodePacked("FIRST_WORDS", Strings.toString(tokenId))));
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint tokenId) internal view returns (string memory){
        uint rand = random(string(abi.encodePacked("SECOND_WORDS", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint tokenId) internal view returns (string memory){
        uint rand = random(string(abi.encodePacked("THIRD_WORDS", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }
}

