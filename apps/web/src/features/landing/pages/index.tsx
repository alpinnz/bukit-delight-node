import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../../../reducers";
import onboarding01 from "../onboarding-01.svg";
import onboarding02 from "../onboarding-02.svg";
import onboarding03 from "../onboarding-03.svg";
import onboarding04Blob1 from "../onboarding-04-blob-1.svg";
import onboarding04Blob2 from "../onboarding-04-blob-2.svg";
import onboarding04Group from "../onboarding-04.svg";
import onboarding04Group1 from "../onboarding-04-group-1.svg";
import onboarding04Group2 from "../onboarding-04-group-2.svg";
import onboardingArrow from "../onboarding-arrow.svg";
import onboardingDotActive from "../onboarding-dot-active.svg";
import onboardingDotInactive from "../onboarding-dot-inactive.svg";
import onboardingWaves from "../onboarding-waves.svg";

const slides = [
  {
    title: "Selamat Datang di Bukit Delight",
    description:
      "Kelola usaha jadi gampang dengan sistem digital yang aman, mudah, dan sederhana.",
    image: onboarding01,
    imageAlt: "Pemilik usaha mengelola penjualan",
  },
  {
    title: "Terintegrasi Dengan Pembayaran Digital",
    description:
      "Support berbagai metode pembayaran, baik melalui QRIS, debit dan tunai.",
    image: onboarding02,
    imageAlt: "Pelanggan melakukan pembayaran digital",
  },
  {
    title: "Kirim Nota Digital Otomatis",
    description:
      "Saatnya beralih ke nota digital, seluruh riwayat transaksi tersimpan dalam sistem.",
    image: onboarding03,
    imageAlt: "Nota digital dikirim otomatis",
  },
  {
    title: "Pantau Laporan Keuangan",
    description:
      "Pantau seluruh transaksi berupa omzet, pemasukan dan pengeluaran secara real time.",
    imageAlt: "Pemilik usaha melihat laporan keuangan",
  },
];

const OnboardingIllustration = ({ index }: { index: number }) => {
  if (index !== 3) {
    const slide = slides[index];
    return (
      <img
        src={slide.image}
        alt={slide.imageAlt}
        width={256}
        height={256}
      />
    );
  }

  return (
    <div
      className="relative size-64 shrink-0"
      role="img"
      aria-label={slides[3].imageAlt}
    >
      <img
        src={onboarding04Blob1}
        alt=""
        className="absolute left-[141.6px] top-[140px]"
      />
      <img
        src={onboarding04Blob2}
        alt=""
        className="absolute left-12 top-12"
      />
      <img
        src={onboarding04Group}
        alt=""
        className="absolute left-[34.4px] top-[47.2px]"
      />
      <img
        src={onboarding04Group1}
        alt=""
        className="absolute left-[134.8px] top-[146.7px]"
      />
      <img
        src={onboarding04Group2}
        alt=""
        className="absolute left-[130.2px] top-[67.8px]"
      />
    </div>
  );
};

const LandingPage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const account = useSelector((state: RootState) => state.Authentication.account);

  const roles = account?.roles ?? (account ? [account.role] : []);
  if (roles.some((role) => role.toLowerCase() === "owner")) {
    return <Navigate to="/owner/dashboard" replace />;
  }
  if (roles.some((role) => role.toLowerCase() === "cashier")) {
    return <Navigate to="/cashier/home" replace />;
  }
  if (roles.some((role) => role.toLowerCase() === "customer")) {
    return <Navigate to="/customer/home" replace />;
  }

  const slide = slides[activeSlide];
  const previousSlide = () =>
    setActiveSlide((index) => (index - 1 + slides.length) % slides.length);
  const nextSlide = () =>
    setActiveSlide((index) => (index + 1) % slides.length);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f5] px-4 py-10 text-slate-900">
      <img
        src={onboardingWaves}
        alt=""
        width={1440}
        height={176}
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 max-w-none -translate-x-1/2"
      />

      <section className="relative z-10 flex min-h-[560px] w-full max-w-[800px] flex-col items-center rounded-[20px] bg-white/95 px-6 pb-6 pt-8 shadow-[0_-1px_10px_2px_rgba(17,17,17,0.1)] sm:h-[600px] sm:px-10 sm:pb-[14px] sm:pt-9">
        <div
          className="flex w-full flex-1 flex-col items-center justify-center gap-6 sm:gap-10"
          aria-live="polite"
        >
          <OnboardingIllustration index={activeSlide} />
          <div className="w-full max-w-[480px] text-center">
            <h1 className="text-lg font-bold leading-7 text-slate-700">
              {slide.title}
            </h1>
            <p className="mt-1 text-sm leading-5 text-slate-600 sm:text-base">
              {slide.description}
            </p>
          </div>
          <div className="flex h-4 items-center gap-2" aria-label="Slide onboarding">
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Tampilkan slide ${index + 1}`}
                aria-current={index === activeSlide ? "step" : undefined}
                onClick={() => setActiveSlide(index)}
            className="flex size-4 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <img
                  src={index === activeSlide ? onboardingDotActive : onboardingDotInactive}
                  alt=""
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full max-w-[520px] flex-col items-center gap-4">
          <p className="text-center text-sm text-slate-700">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-bold text-brand-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              Daftar
            </Link>
          </p>
          <Link
            to="/login"
            className="inline-flex min-h-[50px] w-full items-center justify-center rounded-md bg-brand-primary px-6 py-3 text-base font-bold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Mulai Menggunakan
          </Link>
        </div>

        <button
          type="button"
          aria-label="Slide sebelumnya"
          onClick={previousSlide}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:-left-9"
        >
          <img
            src={onboardingArrow}
            alt=""
            width={72}
            height={72}
            className="max-w-none rotate-180"
          />
        </button>
        <button
          type="button"
          aria-label="Slide berikutnya"
          onClick={nextSlide}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:-right-9"
        >
          <img src={onboardingArrow} alt="" width={72} height={72} className="max-w-none" />
        </button>
      </section>
    </main>
  );
};

export default LandingPage;
