import { LoginPanel } from "@/components/auth/login-panel";

export default function LoginPage() {
  return (
    <div className="page-grid">
      <header className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Project Claudio</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-normal text-ink">Welcome back</h1>
      </header>
      <LoginPanel />
    </div>
  );
}
