import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import Actions from "../../../actions";
import type { RootState } from "../../../reducers";
import type { AppDispatch } from "../../../store";
import AuthField from "../components/auth-field";
import AuthLayout from "../components/auth-layout";

const ResetPasswordPage = () => {
  const { token = "" } = useParams();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);
  const loading = useSelector(
    (state: RootState) => state.Authentication.loading,
  );
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      setError("Kata sandi harus terdiri dari minimal 8 karakter.");
      return;
    }
    if (
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError("Gunakan kombinasi huruf kapital, angka, dan simbol.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Konfirmasi kata sandi tidak sesuai.");
      return;
    }

    setError("");
    const reset = await dispatch(
      Actions.Authentication.onResetPassword(token, password, repeatPassword),
    );
    setIsReset(reset);
  };

  return (
    <AuthLayout
      title="Ubah kata sandi"
      description="Buat kata sandi baru untuk akun Bukit Delight Anda."
    >
      {isReset ? (
        <div className="space-y-5 text-center" role="status" aria-live="polite">
          <p className="rounded-lg bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-900">
            Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru.
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
            id="password"
            label="Kata sandi baru"
            type="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setError("");
            }}
            placeholder="Masukkan kata sandi baru"
            autoComplete="new-password"
            required
            minLength={8}
          />
          <p className="-mt-3 text-xs leading-5 text-slate-500">
            Minimal 8 karakter, dengan huruf kapital, angka, dan simbol.
          </p>
          <AuthField
            id="repeat-password"
            label="Konfirmasi kata sandi"
            type="password"
            value={repeatPassword}
            onChange={(value) => {
              setRepeatPassword(value);
              setError("");
            }}
            placeholder="Masukkan ulang kata sandi"
            autoComplete="new-password"
            required
          />
          {error && (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !token}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand-primary/20 transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Menyimpan…" : "Simpan kata sandi"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
