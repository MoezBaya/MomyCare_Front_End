import { Button } from "@/components/ui/button";
import { AuthPage, AuthCard, AuthCardHeader, AuthCardContent } from "@/components/shared/AuthCard";
import { AuthHeader } from "@/components/shared/AuthHeader";
import { RoleSelector } from "@/components/register/RoleSelector";
import { RegisterForm } from "@/components/register/RegisterForm";
import { useRegisterForm } from "@/hooks/useRegisterForm";

// ── Register ──────────────────────────────────────────────────

export default function Register({ onShowLogin, onRegisterSuccess }) {
  const {
    formData,
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    handleRoleChange,
    handleSubmit,
  } = useRegisterForm(onRegisterSuccess);

  return (
    <AuthPage>
      <AuthCard>
        <AuthCardHeader>
          <AuthHeader
            title="Inscrivez-vous"
            subtitle="Creez votre compte MomyCare"
          />
        </AuthCardHeader>

        <AuthCardContent>
          <RoleSelector
            currentRole={formData.role}
            onRoleChange={handleRoleChange}
          />

          <RegisterForm
            formData={formData}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            successMessage={successMessage}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          <div className="mt-5 text-center">
            <Button
              type="button"
              variant="link"
              className="text-rose-600 hover:text-rose-700"
              onClick={onShowLogin}
            >
              Deja un compte ? Se connecter
            </Button>
          </div>
        </AuthCardContent>
      </AuthCard>
    </AuthPage>
  );
}
