import { Button } from "@/components/ui/button";
import { AuthPage, AuthCard, AuthCardHeader, AuthCardContent } from "@/components/shared/AuthCard";
import { AuthHeader } from "@/components/shared/AuthHeader";
import { LoginForm } from "@/components/login/LoginForm";
import { useLoginForm } from "@/hooks/useLoginForm";

// ── Login ─────────────────────────────────────────────────────

export default function Login({ initialMessage = "", onShowRegister, onLoginSuccess }) {
  const {
    formData,
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
  } = useLoginForm(initialMessage, onLoginSuccess);

  return (
    <AuthPage>
      <AuthCard className="max-w-[420px]">
        <AuthCardHeader>
          <AuthHeader
            title="Mon espace"
            subtitle="Connectez-vous a votre compte"
          />
        </AuthCardHeader>

        <AuthCardContent>
          <LoginForm
            formData={formData}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            successMessage={successMessage}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl"
            onClick={onShowRegister}
          >
            Creer un compte
          </Button>
        </AuthCardContent>
      </AuthCard>
    </AuthPage>
  );
}
