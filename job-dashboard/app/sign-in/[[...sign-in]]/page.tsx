import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-2xl font-black tracking-tight text-[#f5f4f0]">취준</span>
          <span className="bg-[#c8ff4d] text-[#0f0f0f] text-xs font-bold px-2 py-1 rounded-full">
            DASH
          </span>
        </div>
        <p className="text-center text-white/40 text-sm mb-8">
          취업 지원 현황을 한눈에 관리하세요
        </p>
        <SignIn
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full bg-[#1a1a1a] border border-white/[0.08] shadow-2xl",
              headerTitle: "text-[#f5f4f0]",
              headerSubtitle: "text-white/50",
              socialButtonsBlockButton:
                "bg-white/[0.06] border border-white/[0.1] text-[#f5f4f0] hover:bg-white/[0.1]",
              dividerLine: "bg-white/[0.08]",
              dividerText: "text-white/30",
              formFieldLabel: "text-white/60",
              formFieldInput:
                "bg-[#141414] border-white/[0.1] text-[#f5f4f0] focus:border-[#c8ff4d]",
              formButtonPrimary:
                "bg-[#c8ff4d] text-[#0f0f0f] font-bold hover:bg-[#d4ff66]",
              footerActionLink: "text-[#c8ff4d] hover:text-[#d4ff66]",
              identityPreviewEditButton: "text-[#c8ff4d]",
            },
          }}
        />
      </div>
    </div>
  );
}
