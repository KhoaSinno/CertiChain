import { Badge } from "@/src/components/ui/badge";
import { GraduationCap, Shield, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 bg-background flex items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Soft radial gradient overlay */}
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_60%_at_50%_30%,theme(colors.primary/10),transparent_70%)]" />

        {/* Top-left blurred circle */}
        <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-primary/20 via-blue-400/15 to-purple-400/10 blur-3xl" />

        {/* Bottom-right blurred circle */}
        <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-purple-500/20 via-fuchsia-400/15 to-primary/10 blur-3xl" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="container mx-auto px-6 text-center flex flex-col items-center justify-center">
        <Badge
          variant="secondary"
          className="mb-4 bg-primary text-primary-foreground shadow-primary"
        >
          <span>
            🚀 Blockchain + IPFS + NFT 2025 | <b>by KDN Team</b>
          </span>
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-vietnamese leading-tight">
          Hệ thống chứng chỉ số minh bạch
          <br />
          <span className="text-gradient-primary font-bold">
            dựa trên blockchain (NFT)
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          CertiChain kết hợp IPFS để lưu trữ chứng chỉ, Sepolia Blockchain và
          mint NFT để xác minh, đảm bảo tính minh bạch, bất biến và chống giả
          mạo tuyệt đối.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-background/50 supports-[backdrop-filter]:bg-background/30 backdrop-blur-md border border-border/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-vietnamese">
              🏫 Nhà trường
            </h3>
            <p className="text-muted-foreground text-vietnamese">
              Tạo và phát hành chứng chỉ kỹ thuật số minh bạch
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-background/50 supports-[backdrop-filter]:bg-background/30 backdrop-blur-md border border-border/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-vietnamese">
              👩‍🎓 Sinh viên
            </h3>
            <p className="text-muted-foreground text-vietnamese">
              Chia sẻ chứng chỉ dễ dàng với link hoặc QR code
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-background/50 supports-[backdrop-filter]:bg-background/30 backdrop-blur-md border border-border/40 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-primary">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-vietnamese">
              🏢 Nhà tuyển dụng
            </h3>
            <p className="text-muted-foreground text-vietnamese">
              Xác minh chứng chỉ độc lập, không cần liên hệ trường
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
