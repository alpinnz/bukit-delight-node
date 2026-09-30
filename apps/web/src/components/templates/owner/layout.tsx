import { useEffect, useState, type ReactNode } from "react";
import OwnerAppBar from "./app-bar";
import OwnerNavigation from "./navigation";
import Copyright from "../copyright";

type OwnerTemplateProps = {
  title?: string;
  children?: ReactNode;
};

const OwnerTemplate = ({ title, children }: OwnerTemplateProps) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    document.title = title || "Title";
  }, [title]);

  return (
    <div className="flex min-h-screen">
      <OwnerAppBar
        openMobileDrawer={isMobileDrawerOpen}
        setOpenMobileDrawer={setIsMobileDrawerOpen}
      />
      <OwnerNavigation
        openMobileDrawer={isMobileDrawerOpen}
        setOpenMobileDrawer={setIsMobileDrawerOpen}
      />
      <main className="min-w-0 flex-1 p-4 pt-20 sm:ml-48 sm:p-6 sm:pt-20">
        <section className="min-h-[80vh]">{children}</section>
        <footer className="pt-4">
          <Copyright />
        </footer>
      </main>
    </div>
  );
};

export default OwnerTemplate;
