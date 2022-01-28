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
    mapping(uint => mapping(address => uint)) public bidderBalance;
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

    // Buy land 
    function buyLand(address _from, uint _tokenId) public {
        require(owner() != _from, "Error - contract owner can't trigger buyLand func");
        Land memory _land = getTokenDetailById(_tokenId);
        require(owner() == _land.ownedBy, "Error - this land owned by user");
        _land.ownedBy = _from;
        _changeLandState(_tokenId, _land);
        transferFrom(owner(), _from, _tokenId);
    } 

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

    // Auction Features
    function startAuction(address _from,uint _tokenId, uint _startPrice) public {
        require(_from != address(0), "Error - invalid address");
        require(address(getTokenDetailById(_tokenId).ownedBy) == _from, "Error - need to owner of this token");
        require(getTokenDetailById(_tokenId).isAuctionAvailable == false, "Error - this token already on the auction");
        Land memory _land = getTokenDetailById(_tokenId);
        _land.isAuctionAvailable = true;
        // need to refactor
        _changeLandState(_tokenId, _land);
        highestBid[_tokenId] = _startPrice;
        highestBidder[_tokenId] = _from;
    }

    function bid(address _from, uint _tokenId) public payable {
        require(_from != address(0), "Error - invalid address");

        // require(getTokenDetailById(_tokenId).ownedBy == _from, "Error - token owner can't bid");
        require(getTokenDetailById(_tokenId).isAuctionAvailable, "Error - Auction is not available for this token");
        require(msg.value >= 100, "Error - bid price need to bigger than 100 wei");

        // incoming bid need to be bigger than current bid
        if (bidderBalance[_tokenId][_from] == 0) {
            require(msg.value > highestBid[_tokenId], "Error - bid need to be bigger than previous highest bid");
            bidderBalance[_tokenId][_from] = msg.value;
            bidderCount[_tokenId]++;
        } else {
            require(bidderBalance[_tokenId][_from] + msg.value > highestBid[_tokenId], "Error - bid need to be bigger than previous highest bid");
            bidderBalance[_tokenId][_from] = bidderBalance[_tokenId][_from] + msg.value;     
        }

        highestBidder[_tokenId] = payable(_from);
        highestBid[_tokenId] = bidderBalance[_tokenId][_from];
    }
    // TODO: Need to implement "refund" feature
    // TODO: after closingAuction() call => land state need to be changed 
    // Option 1: implement server => handling most of features in server
    // Option 2: implement "refund" feature in smart contract (* meh)
    
    function closingAuction(address _from, uint _tokenId) public {
        bool auctionAvailable = getTokenDetailById(_tokenId).isAuctionAvailable;
        require(auctionAvailable, "Error - Auction is already closed");
        require(_from == getTokenDetailById(_tokenId).ownedBy, "Error - only token owner triggers this function");
        Land memory _land = getTokenDetailById(_tokenId);
        _land.isAuctionAvailable = false;

        if(highestBidder[_tokenId] == _land.ownedBy) {
            delete highestBidder[_tokenId];
            delete highestBid[_tokenId];
        } else {
            sendEth(payable(_from), highestBid[_tokenId]);
            // TODO refund every bidder's balance except beneficiary
            // need to be here
            _land.latestPrice = highestBid[_tokenId];
            _land.ownedBy = highestBidder[_tokenId];
            highestBid[_tokenId] = 0;
            bidderCount[_tokenId] = 0;
            transferFrom(_from, highestBidder[_tokenId], _tokenId);
        }
        _changeLandState(_tokenId, _land);
    }



    function getTokenBidderCount(uint _tokenId) public view returns(uint) {
        return bidderCount[_tokenId];
    }

    function getHighestBid(uint _tokenId) public view returns(uint) {
        return highestBid[_tokenId];
    }

    function getHighestBidder(uint _tokenId) public view returns(address) {
        return highestBidder[_tokenId];
    }

    // auction testing function collection
    function auctionState(address _bidderAddr, uint _tokenId) public view returns(uint) {
        return bidderBalance[_tokenId][_bidderAddr];
    }
    // Auction Feature End

    // private helper functions
    function sendEth(address payable _to, uint amount) private {
        _to.transfer(amount);
    }
    function _changeLandState(uint _tokenId, Land memory _land) private {
        _tokenDetailsById[_tokenId] = _land;
        _tokenDetails[getTokenDetailById(_tokenId).countryName] = _land;
        _lands[_tokenId] = _land;
    }
    // private helper functions end

    // inherited from ERC721 
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        //solhint-disable-next-line max-line-length
        Land memory land = getTokenDetailById(tokenId);
        land.ownedBy = to;
        _tokenDetailsById[tokenId] = land;
        _tokenDetails[getTokenDetailById(tokenId).countryName] = land;
        _transfer(from, to, tokenId);
        _totalTransactions++;
    }

    // default eth receive func
    receive() external payable {

    }
}