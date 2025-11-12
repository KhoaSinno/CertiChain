// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertiChain{
    //cau truc cua chung chi - Certificate: ipfsCID, issuer, issuedAt, isValid
    struct Certificate{
        address issuer; //dia chi vi cua (issuer)
        uint256 issuedAt; //timestamp khi chung chi duoc phat hanh
        bool isValid; //trang thai hop le cua chung chi
    }

    //danh sach cac chung chi dang luu tru tren he thong: byte32 => Certificate
    //byte32 la luu ma hash cua chung chi, neu them vao struct truong fileHash thi se du thua
    mapping(bytes32 => Certificate) public certificates;

    //danh sach cac issuer hop le: address => bool
    mapping(address => bool) public isAuthorizedIssuer;

    //dia chi nguoi deploy smart contract (public)
    address public contractOwner;

    //---su kien---
    // khi phat hanh chung chi moi: CertificateRegistered (dua vao struct Certificate)
    event CertificateRegistered(
        bytes32 indexed fileHash,
        address indexed issuer,
        uint256 issuedAt
    );  
    // cap phep cho 1 address lam issuer: IssuerAuthorized
    event IssuerAuthorized(
        address indexed issuerAddress
    );
    
    // ---phan quyen---
    // onlyOwner
    modifier onlyOwner(){
        require(msg.sender == contractOwner, "Only the contract owner can call this function.");
        _;
    }
    // onlyAuthorizedIssuer
    modifier onlyAuthorizedIssuer(){
        require(isAuthorizedIssuer[msg.sender], "Only an authorized issuer can issue certificates.");
        _;
    }

    // ham khoi tao: msg.sender, isAuthorizedIssuer (owner cung la issuer) => emit 
    constructor(){
        contractOwner = msg.sender;
        //them owner la issuer
        isAuthorizedIssuer[msg.sender] = true;
        emit IssuerAuthorized(msg.sender);
    }

    //---chuc nang cua owner---
    // them dia chi moi vao danh sach issuer: authorizeIssuer
    function authorizeIssuer(address _issuerAddress) public onlyOwner{
        require(_issuerAddress != address(0), "Invalid address"); //address(0) = 0x0000000000000000000000000000000000000000
        isAuthorizedIssuer[_issuerAddress] = true;
        emit IssuerAuthorized(_issuerAddress);
    }
    // thu hoi quyen issuer: revokeIssuer
    function revokeIssuer(address _issuerAddress)public onlyOwner{
        require(_issuerAddress != address(0), "Invalid address");
        isAuthorizedIssuer[_issuerAddress] = false;
    }


    //---chuc nang chinh cua he thong---
    // phat hanh chung chi: registerCertificate
    function registerCertificate(
        bytes32 _fileHash
    )public onlyAuthorizedIssuer{
        //dam bao chung chi chua phat hanh
        require(certificates[_fileHash].issuedAt == 0, "Certificate already registered.");

        //luu thong tin chung chi
        certificates[_fileHash] = Certificate(
            msg.sender,
            block.timestamp,
            true
        );

        //phat ra su kien cho BE call
        emit CertificateRegistered(
            _fileHash, 
            msg.sender, 
            block.timestamp
        );
    }
    // xac minh chung chi: verifyCertificate
    function verifyCertificate(bytes32 _fileHash) public
    view
    returns(
        address _issuer,
        uint _isssedAt,
        bool _isValid
    ){
        //lay du lieu
        Certificate memory cert = certificates[_fileHash];

        //kiem tra chung chi co ton tai hay khong
        require(cert.issuedAt != 0 && cert.isValid, "Certificate not found or invalid.");

        return (
            cert.issuer,
            cert.issuedAt,
            cert.isValid
        );
    }
}