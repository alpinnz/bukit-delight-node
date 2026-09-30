import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Actions from "../../../actions";
import type { RootState } from "../../../reducers";
import type { AppDispatch } from "../../../store";
import AuthField from "../components/auth-field";
import AuthLayout from "../components/auth-layout";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const loading = useSelector(
    (state: RootState) => state.Authentication.loading,
  );
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Masukkan alamat email yang valid.");
      return;
    }
    setEmailError("");
    const requestSent = await dispatch(
      Actions.Authentication.onForgotPassword(email.trim()),
    );
    setIsSubmitted(requestSent);
  };

  return (
    <AuthLayout
      title="Lupa kata sandi?"
      description="Masukkan email akun Anda. Jika terdaftar, kami akan mengirim tautan untuk mengatur ulang kata sandi."
    >
      {isSubmitted ? (
        <div className="space-y-5 text-center" role="status" aria-live="polite">
          <p className="rounded-lg bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900">
            Jika email tersebut terdaftar, instruksi pengaturan ulang kata sandi
            akan dikirim ke <strong>{email}</strong>.
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
              setEmailError("");
            }}
            placeholder="nama@email.com"
            autoComplete="email"
            required
            error={emailError}
          />
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand-primary/20 transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Mengirim…" : "Kirim tautan reset"}
          </button>
          <p className="text-center text-sm text-slate-600">
            Ingat kata sandi?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-brown underline-offset-4 hover:text-brand-primary hover:underline"
            >
              Masuk
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
