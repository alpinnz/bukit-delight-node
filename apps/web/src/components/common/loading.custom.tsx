type LoadingCustomProps = {
  className?: string;
  size?: string | number;
};

const LoadingCustom = (props: LoadingCustomProps) => {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent text-indigo-600 ${props.className ?? ""}`}
      style={{ width: props.size ?? "1.4rem", height: props.size ?? "1.4rem" }}
    />
  );
};

export default LoadingCustom;
