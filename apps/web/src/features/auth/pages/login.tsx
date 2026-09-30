import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Actions from "../../../actions";
import type { AppDispatch } from "../../../store";
import AuthField from "../components/auth-field";
import AuthLayout from "../components/auth-layout";
import type { LoginCredentials } from "../authentication.action";
import Validate from "../../../hooks/use-validate";

type LoginFormState = {
  fields: LoginCredentials;
  errors: Record<string, string>;
};

type LoginReduxState = {
  Authentication: {
    account: { role: string; roles?: string[] } | null;
    loading: boolean;
  };
};

const LoginPage = () => {
  const [state, setState] = useState<LoginFormState>({
    fields: { username: "", password: "" },
    errors: {},
  });
  const account = useSelector(
    (state: LoginReduxState) => state.Authentication.account,
  );
  const loading = useSelector(
    (state: LoginReduxState) => state.Authentication.loading,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [showActiveSessionDialog, setShowActiveSessionDialog] = useState(false);

  if (account) {
    const roles = (account.roles ?? [account.role]).map((role) =>
      role.toLowerCase(),
    );
    if (roles.includes("owner"))
      return <Navigate to="/owner/dashboard" replace />;
    if (roles.includes("cashier"))
      return <Navigate to="/cashier/home" replace />;
    if (roles.includes("customer"))
      return <Navigate to="/customer/home" replace />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formSet = [
      { key: "username", validate: ["required"] },
      { key: "password", validate: ["required"] },
    ];
    if (!(await Validate(state, setState, formSet))) return;
    const result = await dispatch(Actions.Authentication.onLogin(state.fields));
    setShowActiveSessionDialog(result === "active-session");
  };

  const replaceActiveSession = async () => {
    const result = await dispatch(
      Actions.Authentication.onLogin(state.fields, true),
    );
    if (result !== "active-session") setShowActiveSessionDialog(false);
  };

  return (
    <AuthLayout
      title="Masuk"
      description="Masuk sebagai pemilik, kasir, atau customer Bukit Delight."
    >
      <form className="space-y-5" noValidate onSubmit={onSubmit}>
        <AuthField
          id="username"
          label="Email atau username"
          value={state.fields.username}
          onChange={(username) =>
            setState((current) => ({
              ...current,
              fields: { ...current.fields, username },
              errors: { ...current.errors, username: "" },
            }))
          }
          placeholder="Masukkan email atau username"
          autoComplete="username"
          required
          error={state.errors.username}
        />

        <div className="space-y-2">
          <AuthField
            id="password"
            label="Kata sandi"
            type="password"
            value={state.fields.password}
            onChange={(password) =>
              setState((current) => ({
                ...current,
                fields: { ...current.fields, password },
                errors: { ...current.errors, password: "" },
              }))
            }
            placeholder="Masukkan kata sandi"
            autoComplete="current-password"
            required
            error={state.errors.password}
          />
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-brand-brown underline-offset-4 hover:text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Lupa kata sandi?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand-primary/20 transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Memproses…" : "Masuk"}
        </button>
        <p className="text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-brown underline-offset-4 hover:text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Daftar
          </Link>
        </p>
      </form>

      <Dialog
        open={showActiveSessionDialog}
        onClose={() => {
          if (!loading) setShowActiveSessionDialog(false);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-slate-950/45" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <DialogTitle className="text-base font-bold text-slate-900">
                Login Perangkat
              </DialogTitle>
              <button
                type="button"
                aria-label="Tutup dialog"
                onClick={() => setShowActiveSessionDialog(false)}
                disabled={loading}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary disabled:opacity-50"
              >
                <XMarkIcon className="size-5" aria-hidden="true" />
              </button>
            </div>
            <p className="px-5 py-5 text-sm leading-6 text-slate-600">
              Akun Anda sedang digunakan di perangkat lain. Apakah Anda ingin
              mengakhiri sesi tersebut dan menggunakan akun di perangkat ini?
            </p>
            <div className="flex gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowActiveSessionDialog(false)}
                disabled={loading}
                className="min-h-10 flex-1 rounded-lg border border-brand-primary px-3 py-2 text-sm font-semibold text-brand-brown hover:bg-brand-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-50"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={replaceActiveSession}
                disabled={loading}
                className="min-h-10 flex-1 rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Memproses…" : "Iya"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </AuthLayout>
  );
};

export default LoginPage;
