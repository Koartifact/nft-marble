// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTMarble is ERC721Enumerable, Ownable {
    // nft 발행 갯수 제한
    uint private _maxTokenCounts = 36;
    // tokenId 추적
    uint private _nextId = 0;
    // count for totalTransactions 
    uint public totalTransactions;

    struct Land {
        uint id;
        string countryName;
        bool isAvailable;
        uint latestPrice;
    }
    
    
    // array for print entire token list
    Land[] public lands;
    // mapping {name:Land}
    mapping(string => Land) private _tokenDetails;
    // mapping {tokenId:Land}
    mapping(uint => Land) private _tokenDetailsById;

    constructor() ERC721("NFTMarble", "NMB") {
        
    }

    modifier notOwner() {
        require(msg.sender != owner(), "Error - Owner can't trigger this funcion");
        _;
    }
    function getTokenDetail(string memory countryName) public view returns(Land memory) {
        return _tokenDetails[countryName];
    }

    function getTokenDetailById(uint tokenId) public view returns(Land memory) {
        return _tokenDetailsById[tokenId];
    }

    function mint(string memory _countryName) public onlyOwner {
        require(_nextId < _maxTokenCounts, "Error - all lands are occupied");
        Land memory land = Land(_nextId,_countryName, false, 0);
        _tokenDetails[_countryName] = land;
        _tokenDetailsById[_nextId] = land;
        lands.push(land);
        _safeMint(msg.sender, _nextId);
        _nextId++;
        totalTransactions++;
    }



    function changeAvailableState(string memory _countryName, bool state) public {
        // TODO
        require(isTokenOwner(getTokenDetail(_countryName).id), "Error - only token owner can change available state");
        Land memory land = getTokenDetail(_countryName);
        land.isAvailable = state;
        _tokenDetails[_countryName] = land;
        _tokenDetailsById[_tokenDetails[_countryName].id] = land;
    }

    function totalTransactionCount() public view returns(uint) {
        return totalTransactions;
    }

    function isTokenOwner(uint _tokenId) public view returns (bool) {
        return ownerOf(_tokenId) == msg.sender;
    }

    function isAvailable(string memory _countryName) public view returns(bool) {
        return getTokenDetail(_countryName).isAvailable;
    }

    function getAllLands() public view returns(Land[] memory) {
        return lands;
    }
    // Auction Feature
    // function buyLand(string memory _countryName) public notOwner() {
    //  require(isAvailable(_countryName), "Error - this land is not available for auction");
    // }
    // Auction Feature End
}