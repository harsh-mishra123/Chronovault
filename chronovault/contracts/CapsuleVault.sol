// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ChronoVault - Decentralized Time Capsule DApp
/// @author Harsh
/// @notice Users can lock encrypted data on-chain with unlock time and receive an NFT as proof
contract CapsuleVault is ERC721, Ownable {
    uint256 public nextId;

    struct Capsule {
        address owner;       // Capsule owner
        string ipfsHash;     // Encrypted message or files stored on IPFS
        uint256 unlockTime;  // Timestamp when capsule can be unlocked
        bool isUnlocked;     // True after capsule is unlocked
    }

    mapping(uint256 => Capsule) public capsules;

    event CapsuleCreated(uint256 indexed id, address indexed owner, uint256 unlockTime);
    event CapsuleUnlocked(uint256 indexed id, string ipfsHash);
   

    constructor() ERC721("ChronoVault Capsule", "CVC") Ownable(msg.sender) {}

    /// @notice Create a new time capsule
    /// @param _ipfsHash IPFS hash of the encrypted data
    /// @param _unlockTime Timestamp when the capsule can be unlocked
    function createCapsule(string memory _ipfsHash, uint256 _unlockTime) external {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");

        uint256 id = nextId++;
        capsules[id] = Capsule({
            owner: msg.sender,
            ipfsHash: _ipfsHash,
            unlockTime: _unlockTime,
            isUnlocked: false
        });

        _mint(msg.sender, id);

        emit CapsuleCreated(id, msg.sender, _unlockTime);
    }

    /// @notice Unlock a time capsule after the unlock time
    /// @param _id ID of the capsule to unlock
    /// @return The IPFS hash (encrypted data)
    function openCapsule(uint256 _id) external view returns (string memory) {
        require(_ownerOf(_id) != address(0), "Capsule does not exist");

        Capsule memory c = capsules[_id];
        require(block.timestamp >= c.unlockTime, "Capsule still locked");

        return c.ipfsHash; // Encrypted IPFS CID to frontend for decryption
    }
}
