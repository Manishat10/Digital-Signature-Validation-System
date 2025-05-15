// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SignatureChain {
    struct Certificate {
        string certificateNumber;
        string hash;
        uint timestamp;
    }

    mapping(string => Certificate) public certificates;

    function storeCertificate(string memory _certNumber, string memory _hash) public {
        certificates[_certNumber] = Certificate(_certNumber, _hash, block.timestamp);
    }

    function getCertificate(string memory _certNumber) public view returns (string memory, string memory, uint) {
        Certificate memory cert = certificates[_certNumber];
        return (cert.certificateNumber, cert.hash, cert.timestamp);
    }
}
