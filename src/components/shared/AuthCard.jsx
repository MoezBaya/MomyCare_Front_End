import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ── AuthCard ──────────────────────────────────────────────────
// Wrapper commun : fond gradient + Card centré
// Utilisé par Login et Register

function AuthPage({ children, className }) {
  return (
    <main
      className={cn(
        "flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 px-4 py-8",
        className
      )}
    >
      {children}
    </main>
  );
}

function AuthCard({ children, className }) {
  return (
    <Card
      className={cn(
        "w-full max-w-[520px] rounded-3xl border-0 bg-white/85 shadow-2xl backdrop-blur-sm",
        className
      )}
    >
      {children}
    </Card>
  );
}

function AuthCardHeader({ children }) {
  return <CardHeader className="pb-0">{children}</CardHeader>;
}

function AuthCardContent({ children }) {
  return <CardContent className="pt-6">{children}</CardContent>;
}

export { AuthPage, AuthCard, AuthCardHeader, AuthCardContent };
