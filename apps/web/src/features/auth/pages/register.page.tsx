import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Actions from "../../../actions";
import type { RootState } from "../../../reducers";
import type { AppDispatch } from "../../../store";
import AuthField from "../components/auth-field";
import AuthLayout from "../components/auth-layout";

const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRegistered, setIsRegistered] = useState(false);
  const loading = useSelector((state: RootState) => state.Authentication.loading);
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Masukkan alamat email yang valid.";
    }
    if (!passwordPattern.test(password)) {
      nextErrors.password =
        "Gunakan minimal 8 karakter, huruf kapital, angka, dan simbol.";
    }
    if (repeatPassword !== password) {
      nextErrors.repeatPassword = "Konfirmasi kata sandi belum cocok.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const registered = await dispatch(
      Actions.Authentication.onRegister({
        email: email.trim(),
        password,
        repeatPassword,
      }),
    );
    if (!registered) return;

    setPassword("");
    setRepeatPassword("");
    setIsRegistered(true);
  };

  return (
    <AuthLayout
      title="Daftar"
      description="Buat akun customer Bukit Delight menggunakan email."
      size="wide"
    >
      {isRegistered ? (
        <div className="space-y-5 text-center" role="status" aria-live="polite">
          <p className="rounded-lg bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900">
            Akun customer berhasil dibuat. Login pada halaman berikutnya hanya
            tersedia untuk akun admin dan kasir.
          </p>
          <Link
            to="/login"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      ) : (
        <form className="space-y-5" noValidate onSubmit={onSubmit}>
          <AuthField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setErrors((current) => ({ ...current, email: "" }));
            }}
            placeholder="example@gmail.com"
            autoComplete="email"
            required
            error={errors.email}
          />
          <div className="space-y-1.5">
            <AuthField
              id="password"
              label="Kata sandi"
              type="password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setErrors((current) => ({ ...current, password: "" }));
              }}
              placeholder="Masukkan kata sandi"
              autoComplete="new-password"
              required
              minLength={8}
              error={errors.password}
            />
            <p className="px-1 text-xs leading-5 text-slate-600">
              Minimal 8 karakter, dengan kombinasi huruf kapital, angka dan
              simbol.
            </p>
          </div>
          <AuthField
            id="repeatPassword"
            label="Konfirmasi kata sandi"
            type="password"
            value={repeatPassword}
            onChange={(value) => {
              setRepeatPassword(value);
              setErrors((current) => ({ ...current, repeatPassword: "" }));
            }}
            placeholder="Masukkan ulang kata sandi"
            autoComplete="new-password"
            required
            minLength={8}
            error={errors.repeatPassword}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand-primary/20 transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses…" : "Daftar"}
          </button>
          <p className="text-center text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-brown underline-offset-4 hover:text-brand-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Masuk
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default RegisterPage;
