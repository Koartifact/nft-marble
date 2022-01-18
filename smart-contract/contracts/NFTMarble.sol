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
    uint private _totalTransactions;

    struct Land {
        // token id
        uint id;
        // countryName
        string countryName;
        // auction state
        bool isAuctionAvailable;
        // lastestPrice
        uint latestPrice;
        // ownedBy
        address ownedBy;
    }

    // Token Details
    // array for print entire token list
    Land[] private _lands;
    // mapping {name:Land}
    mapping(string => Land) private _tokenDetails;
    // mapping {tokenId:Land}
    mapping(uint => Land) private _tokenDetailsById;
    // Token Details end

    // Auction
    // {tokenId: [adress: balance]}
    mapping(uint => mapping(address => uint)) public bidder;
    // {tokenId: bidderCount}
    mapping(uint => uint) public bidderCount;
    // {tokenId: bidderAddress}
    mapping(uint => address) public highestBidder;
    // {tokenId: highestBid}
    mapping(uint => uint) public highestBid;
    //Auction end



    constructor() ERC721("NFTMarble", "NMB") {
        
    }

    modifier notOwner() {
        require(_msgSender() != owner(), "Error - Owner can't trigger this funcion");
        _;
    }
    function getTokenDetail(string memory _countryName) public view returns(Land memory) {
        return _tokenDetails[_countryName];
    }

    function getTokenDetailById(uint _tokenId) public view returns(Land memory) {
        return _tokenDetailsById[_tokenId];
    }

    function mint(string memory _countryName) public onlyOwner {
        require(_nextId < _maxTokenCounts, "Error - all lands are occupied");
        Land memory land = Land(_nextId,_countryName, false, 0, _msgSender());
        _tokenDetails[_countryName] = land;
        _tokenDetailsById[_nextId] = land;
        _lands.push(land);
        _safeMint(_msgSender(), _nextId);
        _nextId++;
        _totalTransactions++;
    }
    // for testing
    // function changeAvailableState(string memory _countryName, bool state) public {
    //     require(isTokenOwner(getTokenDetail(_countryName).id), "Error - only token owner can change available state");
    //     Land memory land = getTokenDetail(_countryName);
    //     land.isAvailable = state;
    //     _tokenDetails[_countryName] = land;
    //     _tokenDetailsById[_tokenDetails[_countryName].id] = land;
    // }

    function totalTransactionCount() public view returns(uint) {
        return _totalTransactions;
    }

    function isTokenOwner(uint _tokenId) public view returns (bool) {
        return ownerOf(_tokenId) == _msgSender();
    }

    function isAuctionAvailable(string memory _countryName) public view returns(bool) {
        return getTokenDetail(_countryName).isAuctionAvailable;
    }

    function getAllLands() public view returns(Land[] memory) {
        return _lands;
    }
    // Auction Feature
    // function buyLand(string memory _countryName) public notOwner() {
    //  require(isAvailable(_countryName), "Error - this land is not available for auction");
    // }

    function startAuction(address _from, uint _tokenId, uint _startPrice) public {
        require(_msgSender() != address(0), "Error - invalid address");
        require(address(getTokenDetailById(_tokenId).ownedBy) == _from, "Error - need to owner of this token");
        require(getTokenDetailById(_tokenId).isAuctionAvailable == false, "Error - this token already on the auction");
        Land memory land = getTokenDetailById(_tokenId);
        land.isAuctionAvailable = true;
        // need to refactor
        _tokenDetailsById[_tokenId] = land;
        _tokenDetails[getTokenDetailById(_tokenId).countryName] = land;
        _lands[_tokenId] = land;
    }

    // function bid(uint _tokenId) public payable notOwner {
    function bid(address _from, uint _tokenId) public payable {
        require(getTokenDetailById(_tokenId).isAuctionAvailable, "Error - Auction is not available for this token");
        require(msg.value >= 100, "Error - bid price need to bigger than 100 wei");
        if (bidder[_tokenId][_from] == 0) {
            bidderCount[_tokenId]++;
        }

        // TODO
        // incoming bid need to be bigger than current bid
        // bidder[_tokenId][_msgSender()] = msg.value;
        bidder[_tokenId][_from] = msg.value;
        highestBidder[_tokenId] = _from;
        // highestBidder[_tokenId] = _msgSender();
    }

    function closingAuction(uint _tokenId) public {
        bool auctionAvailable = getTokenDetailById(_tokenId).isAuctionAvailable;
        require(auctionAvailable, "Error - Auction is already closed");
        require(_msgSender() == getTokenDetailById(_tokenId).ownedBy, "Error - only token owner triggers this function");
        Land memory land = getTokenDetailById(_tokenId);
        land.isAuctionAvailable = false;
        _tokenDetailsById[_tokenId] = land;
        _tokenDetails[getTokenDetailById(_tokenId).countryName] = land;
        transferFrom(getTokenDetailById(_tokenId).ownedBy, highestBidder[_tokenId], _tokenId);
        // TODO
        // refund every bidder's balance except beneficiary
    }

    function auctionState(address _bidderAddr, uint _tokenId) public view returns(uint) {
        return bidder[_tokenId][_bidderAddr];
    }

    function getTokenBidderCount(uint _tokenId) public view returns(uint) {
        return bidderCount[_tokenId];
    }

    // Auction Feature End

    // TODO inherit
    // need to fix
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        Land memory land = getTokenDetailById(tokenId);
        land.ownedBy = to;
        _tokenDetailsById[tokenId] = land;
        _tokenDetails[getTokenDetailById(tokenId).countryName] = land;
        _transfer(from, to, tokenId);
    }
}