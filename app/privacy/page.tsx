export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">CertiChain Privacy Policy</h2>

        <p>
          CertiChain is a blockchain-based certificate verification system that
          prioritizes user privacy and data security.
        </p>

        <h3 className="text-xl font-semibold mt-6">Data We Collect</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Student ID (hashed on blockchain for privacy)</li>
          <li>Student Name (for certificate display)</li>
          <li>Certificate files and metadata</li>
          <li>Authentication credentials (encrypted)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">How We Use Your Data</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Issue and verify certificates on blockchain</li>
          <li>Store certificate metadata on IPFS (decentralized storage)</li>
          <li>Authenticate users for dashboard access</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">Data Protection</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Student IDs are hashed using SHA-256 before storing on blockchain
          </li>
          <li>Passwords are encrypted using bcrypt</li>
          <li>Certificate files stored on IPFS (immutable and distributed)</li>
          <li>Blockchain provides tamper-proof verification</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">Contact</h3>
        <p>
          For privacy concerns or data deletion requests, please contact your
          institution&apos;s certificate issuer.
        </p>
      </section>
    </div>
  );
}
