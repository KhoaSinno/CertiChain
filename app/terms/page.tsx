export default function TermsPage() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">CertiChain Terms of Service</h2>

        <p className="text-muted-foreground">Last updated: November 14, 2025</p>

        <h3 className="text-xl font-semibold mt-6">1. Acceptance of Terms</h3>
        <p>
          By accessing and using CertiChain, you accept and agree to be bound by
          the terms and provision of this agreement.
        </p>

        <h3 className="text-xl font-semibold mt-6">2. Use License</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Permission is granted to use CertiChain for certificate verification
            purposes
          </li>
          <li>
            Certificates are issued by authorized educational institutions only
          </li>
          <li>Certificate data is stored on blockchain and IPFS (immutable)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">3. User Responsibilities</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Maintain confidentiality of your account credentials</li>
          <li>Report any unauthorized access immediately</li>
          <li>Ensure accuracy of information provided</li>
          <li>Use the service only for legitimate verification purposes</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">
          4. Certificate Verification
        </h3>
        <p>All certificates issued through CertiChain are:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Registered on Base Sepolia blockchain</li>
          <li>Stored on IPFS for decentralized access</li>
          <li>Cryptographically verified for authenticity</li>
          <li>Immutable and tamper-proof</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">5. Privacy</h3>
        <p>
          Student IDs are hashed using SHA-256 before storing on blockchain to
          protect privacy. See our Privacy Policy for more details.
        </p>

        <h3 className="text-xl font-semibold mt-6">
          6. Limitation of Liability
        </h3>
        <p>
          CertiChain provides certificate verification &quot;as is&quot; without
          warranty of any kind. The platform is not liable for any damages
          arising from use of the service.
        </p>

        <h3 className="text-xl font-semibold mt-6">7. Contact</h3>
        <p>
          For questions about these Terms, please contact your
          institution&apos;s certificate issuer.
        </p>
      </section>
    </div>
  );
}
