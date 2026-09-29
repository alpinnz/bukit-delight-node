const steps = ["Pending", "Processing", "Done"] as const;

const CashierTransactionTimeline = ({ status }: { status: string }) => {
  const activeStep = status === "done" ? 2 : status === "processing" ? 1 : 0;

  return (
    <ol
      aria-label="Transaction progress"
      className="mx-auto flex max-w-md items-start"
    >
      {steps.map((step, index) => {
        const isComplete = index < activeStep;
        const isCurrent = index === activeStep;
        return (
          <li
            key={step}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-3 h-0.5 w-full ${isComplete ? "bg-brand-primary" : "bg-slate-300"}`}
              />
            )}
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={`relative z-10 size-6 rounded-full border-2 ${isCurrent || isComplete ? "border-brand-primary bg-brand-primary" : "border-slate-400 bg-white"}`}
            />
            <span
              className={`mt-2 text-sm ${isCurrent ? "font-semibold text-brand-primary" : "text-slate-600"}`}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default CashierTransactionTimeline;
