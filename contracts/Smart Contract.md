// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CertificateVerifier
 * @dev Hợp đồng thông minh để đăng ký và xác minh chứng chỉ giáo dục sử dụng Blockchain và IPFS.
 * Được thiết kế để chạy trên mạng EVM (như Sepolia).
 */
contract CertificateVerifier {
    // Cấu trúc dữ liệu để lưu trữ thông tin chứng chỉ
    struct Certificate {
        bytes32 ipfsCID;         // Content Identifier của file chứng chỉ trên IPFS (dạng bytes32) //==đổi thành string để lưu CID dài hơn
        bytes32 studentIdHash;   // Mã sinh viên đã được băm (hash)
        address issuer;          // Địa chỉ ví của nhà trường (Issuer)
        uint256 issuedAt;        // Dấu thời gian (timestamp) của block khi chứng chỉ được phát hành
        bool isValid;            // Đảm bảo struct được khởi tạo
    }

    // Ánh xạ (Mapping) để lưu trữ thông tin chi tiết của chứng chỉ
    // Key: SHA-256 Hash của file chứng chỉ (fileHash)
    // Value: Struct Certificate chứa dữ liệu đã lưu trữ
    mapping(bytes32 => Certificate) public certificates;

    // Ánh xạ để theo dõi các Nhà trường (Issuer) hợp lệ
    // Key: Địa chỉ ví của trường
    // Value: true nếu là Issuer hợp lệ
    mapping(address => bool) public isAuthorizedIssuer;

    // Địa chỉ người triển khai hợp đồng (Contract Owner)
    address public contractOwner;

    // --- Events (Sự kiện) ---
    // Sự kiện được phát ra khi chứng chỉ mới được đăng ký
    event CertificateRegistered(
        bytes32 indexed fileHash,
        address indexed issuer,
        bytes32 ipfsCID,
        bytes32 studentIdHash,
        uint256 issuedAt
    );

    // Sự kiện được phát ra khi một Issuer mới được cấp phép
    event IssuerAuthorized(address indexed issuerAddress);

    // --- Modifiers (Bộ điều chỉnh) ---
    // Yêu cầu người gọi là Chủ sở hữu hợp đồng //==xài Ownable của OpenZeppelin sẽ hay hơn
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only the contract owner can call this function.");
        _;
    }

    // Yêu cầu người gọi là Issuer hợp lệ
    modifier onlyAuthorizedIssuer() {
        require(isAuthorizedIssuer[msg.sender], "Only an authorized issuer can issue certificates.");
        _;
    }

    // --- Constructor (Hàm khởi tạo) ---
    constructor() {
        contractOwner = msg.sender;
        // Tự động thêm người triển khai hợp đồng làm Issuer đầu tiên
        isAuthorizedIssuer[msg.sender] = true;
        emit IssuerAuthorized(msg.sender);
    }

    // --- Chức năng Quản lý Issuer ---

    /**
     * @dev Thêm một địa chỉ mới vào danh sách Issuer hợp lệ. Chỉ Owner có thể gọi.
     * @param _issuerAddress Địa chỉ ví của nhà trường cần cấp phép.
     */
    function authorizeIssuer(address _issuerAddress) public onlyOwner {
        require(_issuerAddress != address(0), "Invalid address.");
        isAuthorizedIssuer[_issuerAddress] = true;
        emit IssuerAuthorized(_issuerAddress);
    }

    /**
     * @dev Thu hồi quyền Issuer của một địa chỉ. Chỉ Owner có thể gọi.
     * @param _issuerAddress Địa chỉ ví của nhà trường cần thu hồi quyền.
     */
    function revokeIssuer(address _issuerAddress) public onlyOwner {
        require(_issuerAddress != address(0), "Invalid address.");
        isAuthorizedIssuer[_issuerAddress] = false;
    }

    // --- Chức năng Phát hành Chứng chỉ (Bước 1) ---

    /**
     * @dev Nhà trường gọi hàm này để đăng ký một chứng chỉ mới lên blockchain.
     * @param _fileHash SHA-256 Hash của file chứng chỉ PDF/Image. (32 bytes)
     * @param _ipfsCID CID của file chứng chỉ trên IPFS. (Nên chuyển đổi sang bytes32 trước khi gọi)
     * @param _studentIdHash Hash của Mã sinh viên (hoặc thông tin sinh viên quan trọng khác). (32 bytes)
     */
    function registerCertificate(
        bytes32 _fileHash,
        bytes32 _ipfsCID,
        bytes32 _studentIdHash
    ) public onlyAuthorizedIssuer {
        // Đảm bảo chứng chỉ với hash này chưa từng được phát hành
        require(certificates[_fileHash].issuedAt == 0, "Certificate already registered.");
        
        // Lưu trữ thông tin chứng chỉ
        certificates[_fileHash] = Certificate(
            _ipfsCID,
            _studentIdHash,
            msg.sender,         // Địa chỉ người gửi (Nhà trường)
            block.timestamp,    // Dấu thời gian phát hành
            true
        );

        // Phát ra sự kiện để các dịch vụ ngoài (API backend) có thể theo dõi và phản hồi
        emit CertificateRegistered(
            _fileHash,
            msg.sender,
            _ipfsCID,
            _studentIdHash,
            block.timestamp
        );
    }

    // --- Chức năng Xác minh Chứng chỉ (Bước 3) ---

    /**
     * @dev Mọi người có thể gọi hàm này để kiểm tra thông tin của một chứng chỉ.
     * @param _fileHash SHA-256 Hash của file chứng chỉ cần xác minh.
     * @return 
     * _ipfsCID: CID IPFS của file gốc
     * _issuer: Địa chỉ ví của nhà trường đã phát hành
     * _issuedAt: Thời điểm chứng chỉ được phát hành
     * _studentIdHash: Mã sinh viên đã được băm (dùng để khớp/kiểm tra nội bộ)
     */
    function verifyCertificate(bytes32 _fileHash) 
        public 
        view 
        returns (
            bytes32 _ipfsCID, 
            address _issuer, 
            uint256 _issuedAt, 
            bytes32 _studentIdHash
        ) 
    {
        // Lấy dữ liệu từ ánh xạ
        Certificate memory cert = certificates[_fileHash];

        // Kiểm tra xem chứng chỉ có tồn tại hay không
        // Nếu issuedAt là 0, chứng chỉ chưa được đăng ký
        require(cert.issuedAt != 0 && cert.isValid, "Certificate not found or invalid."); 

        // Trả về thông tin
        return (
            cert.ipfsCID,
            cert.issuer,
            cert.issuedAt,
            cert.studentIdHash
        );
    }

    //== thêm chức năng hủy chứng chỉ (revoke) nếu cần thiết => Issuer có thể thu hồi chứng chỉ đã phát hành

    
}