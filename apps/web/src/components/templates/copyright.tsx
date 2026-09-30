const Copyright = () => (
  <p className="text-center text-sm text-slate-500">
    {"Copyright © Bukit Delight By "}
    <a
      className="text-inherit underline-offset-2 hover:underline"
      href="https://www.facebook.com/Alpinnz"
    >
      Alpinnz
    </a>{" "}
    {new Date().getFullYear()}
    {"."}
  </p>
);

export default Copyright;
