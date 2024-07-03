// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import { IEAS, AttestationRequest, AttestationRequestData, RevocationRequest, RevocationRequestData } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import { NO_EXPIRATION_TIME, EMPTY_UID } from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface Iindexer {
    function indexAttestation(bytes32 attestationUID) external;
    function indexAttestations(bytes32[] memory attestationUIDs) external;
}

contract MyToken is ERC721, ERC721Enumerable, ERC721Pausable, Ownable, ERC721Burnable {
    uint256 private _nextTokenId;
    string public baseURI;
    address public director;
    uint256 public price;
    mapping(address => uint256) public revenue;
    IEAS private immutable _eas;
    mapping(string => bytes32) schema;
    IERC20 token;
    Iindexer indexer;

    event Revenue(address indexed purchaser, address indexed receiver, uint256 indexed value);
    event EventUID(bytes32 UU);

    constructor(address initialOwner, address _director, string memory URI)
        ERC721("gilooTestMovie1", "GTM1")
        Ownable(initialOwner)
    {
        director = _director;
        price = 5000000;
        setBaseURI(URI);
        _eas = IEAS(0x4200000000000000000000000000000000000021);
        indexer = Iindexer(0x2C7BCE69D5Ee84EF73CC9286416F68E60F9A61b3);
        token = IERC20(0x0933f937d4b5c9ed6d7B39b4C187AB6d3b1322D6);
        // baseSepolia
        // schema["curatorLevel"] = 0x43cf08eb1faa7ce44af68069cf8c75d7195f8d2fb5bebd0516e254a4dce9f10b;
        schema["curatorLevel"] = 0x8df3f8e093835a3eab036f856de9a684041a0ec4599eaa38d2c7051d8303d3e7;
        schema["curatorPoint"] = 0xd99e3ecbf2db4e794993c2ecc397a532ec455e28432adab72545c2bf4659bfb9;
        schema["purchaserPoint"] = 0x55c9b190cb73535713629df9c6f749d19aace1ea2854ee8eae27268c1b6f30d7;
        schema["directorPoint"] = 0x0aab61cc821be6f6625613f911e2bd7cc426d8e40f4851c49cfb7a89e7b63cba;
        schema["curatorRevenue"] = 0x93c4fddb3bb65f779d17274cac86e007d61fe50801b449164f33abff7b191989;
        schema["purchaseTicket"] = 0xa030fd8da561af5edd2590ce0e1458c2c175fdc41ba68130ecf017e2b13cc880;
        // schema["proofOfWatched"] = 0x70b3480d4a2843216215cf17bcdad8e0116cd590c607c5639fb7d8cf851aab73;
        schema["proofOfWatched"] = 0x1322773af553519857376e6d0498d7d7361c3afad989c75e6658b64e63b0ad21;

        // baseFoundry
        // schema["curatorLevel"] = 0xe9b946d759779d47cc6179807d77deaa2f82c9c01cebb9b86064eb45867d1a96;
        // schema["curatorPoint"] = 0x9754319909dcbc7d4409d6cfdff0a17089a74ba5c1806e40512eb60413b1375a;
        // schema["purchaserPoint"] = 0x2ed6f6661ee7b144a4952b883813793adfeeb007d46de390df9be407ce687593;
        // schema["directorPoint"] = 0xfb8bcecfc8c11a7815b9b51767c8d77297ae00f70b6c1deb2c7cc5e7e43bf32a;
        // schema["curatorRevenue"] = 0x52273910db5055ebe553d0f94f6f00301a74a475960803bf0699c5575dd95463;
        // schema["purchaseTicket"] = 0xce93711e7cbca6ba258d742db2bf62b7f7229a902ee32b367510c4899436ab92;
        // schema["proofOfWatched"] = 0x9349323440f25e43216cf9918a989c82d8ecfd2084818d5aa98dbdc5eaf65258;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function mint(address to, address curator) public payable {
        // require(msg.value >= 1000000000000, "msg.value not enought, must 0.000001");
        require(token.allowance(msg.sender, address(this)) >= price, "token allowence not enough, must 5000000");
        token.transferFrom(msg.sender, address(this), price);
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        // (bool sent, ) = address(director).call{value: msg.value * 95 / 100}("");
        // require(sent, "send revenue fail");
        // revenue[director] += msg.value * 95 / 100;
        // (sent, ) = address(curator).call{value: msg.value * 5 / 100}("");
        // require(sent, "send revenue fail");
        // revenue[curator] += msg.value * 5 / 100;
        emit Revenue(to, director, price * 95 / 100);
        emit Revenue(to, curator, price * 5 / 100);
        indexer.indexAttestation(_attest("purchaserPoint", to, abi.encode(name(), to, 50)));
        indexer.indexAttestation(_attest("curatorPoint", curator, abi.encode(name(), curator, 5)));
        indexer.indexAttestation(_attest("directorPoint", director, abi.encode(name(), director, 15)));
        indexer.indexAttestation(_attest("curatorRevenue", curator, abi.encode(name(), curator, price * 5 / 100)));
        indexer.indexAttestation(_attest("curatorRevenue", director, abi.encode(name(), director, price * 95 / 100)));
        indexer.indexAttestation(_attest("purchaseTicket", to, abi.encode(name(), to)));
        indexer.indexAttestation(_attest("curatorLevel", curator, abi.encode(name(), curator, "blue")));
        revenue[director] += price * 95 / 100;
        revenue[curator] += price * 5 / 100;
        token.transfer(director, price * 95 / 100);
        token.transfer(curator, price * 5 / 100);
    }

    function mint(address to) public payable {
        // require(msg.value >= 1000000000000, "msg.value not enought, must 0.000001");
        require(token.allowance(msg.sender, address(this)) >= price, "token allowence not enough, must 5000000");
        token.transferFrom(msg.sender, address(this), price);
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        // (bool sent, ) = address(owner()).call{value: msg.value}("");
        // require(sent, "send revenue fail");
        token.transfer(director, price);
        revenue[director] += price;
        indexer.indexAttestation(_attest("purchaserPoint", to, abi.encode(name(), to, 50)));
        indexer.indexAttestation(_attest("directorPoint", director, abi.encode(name(), director, 15)));
        indexer.indexAttestation(_attest("curatorRevenue", director, abi.encode(name(), director, price)));
        indexer.indexAttestation(_attest("purchaseTicket", to, abi.encode(name(), to)));
    }

    function _attest(string memory _schema, address recipient, bytes memory data) internal returns(bytes32) {
        return _eas.attest(
                AttestationRequest({
                    schema: schema[_schema],
                    data: AttestationRequestData({
                        recipient: recipient,
                        expirationTime: NO_EXPIRATION_TIME,
                        revocable: true,
                        refUID: EMPTY_UID,
                        data: data,
                        value: 0
                    })
                })
            );
    }

    function proofOfWatchAttest(address recipient) external {
       indexer.indexAttestation( _attest("proofOfWatched", recipient, abi.encode(name(), recipient)));
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function setSchema(string memory name, bytes32 _schema) external {
        schema[name] = _schema;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return baseURI;
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function setBaseURI(string memory URI) public onlyOwner {
        baseURI = URI;
    }
    

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
