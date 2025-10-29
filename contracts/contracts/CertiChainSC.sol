 // SPDX-License-Identifier: MIT
 pragma solidity ^0.8.18;

 /// @title CertiChainSC - A simple certificate registry
 /// @author GitHub Copilot
 /// @notice Lightweight contract to issue, revoke and query certificates
 contract CertiChainSC {
    address public owner;
    uint256 private nextId = 1;

    struct Certificate {
        uint256 id;
        address student;
        string fullName;
        string course;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(uint256 => Certificate) private certificates;
    mapping(address => uint256[]) private studentCertIds;

    event CertificateIssued(uint256 indexed id, address indexed student);
    event CertificateRevoked(uint256 indexed id, address indexed by);
    event CertificateUpdated(uint256 indexed id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Issue a new certificate to a student
    /// @return id The new certificate id
    function issueCertificate(address student, string memory fullName, string memory course) external onlyOwner returns (uint256 id) {
        require(student != address(0), "Invalid student");
        id = nextId++;
        certificates[id] = Certificate({
           id: id,
           student: student,
           fullName: fullName,
           course: course,
           issuedAt: block.timestamp,
           revoked: false
        });
        studentCertIds[student].push(id);
        emit CertificateIssued(id, student);
    }

    /// @notice Revoke an existing certificate
    function revokeCertificate(uint256 id) external onlyOwner {
        Certificate storage cert = certificates[id];
        require(cert.id != 0, "Not found");
        require(!cert.revoked, "Already revoked");
        cert.revoked = true;
        emit CertificateRevoked(id, msg.sender);
    }

    /// @notice Update certificate metadata (e.g., fix name or course)
    function updateCertificate(uint256 id, string memory fullName, string memory course) external onlyOwner {
        Certificate storage cert = certificates[id];
        require(cert.id != 0, "Not found");
        cert.fullName = fullName;
        cert.course = course;
        emit CertificateUpdated(id);
    }

    /// @notice Get certificate details by id
    function getCertificate(uint256 id) external view returns (
        uint256 cid,
        address student,
        string memory fullName,
        string memory course,
        uint256 issuedAt,
        bool revoked
    ) {
        Certificate storage cert = certificates[id];
        require(cert.id != 0, "Not found");
        return (cert.id, cert.student, cert.fullName, cert.course, cert.issuedAt, cert.revoked);
    }

    /// @notice Get certificate ids issued to a student
    function getCertificatesByStudent(address student) external view returns (uint256[] memory) {
        return studentCertIds[student];
    }

    /// @notice Transfer contract ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        owner = newOwner;
    }
 }