import { useEffect, useState, type ReactNode } from "react";
import AppBarAdmin from "./appBar";
import DrawerAdmin from "./drawer";
import Copyright from "../copyright";

type AdminTemplateProps = {
  title?: string;
  children?: ReactNode;
};

const AdminTemplate = ({ title, children }: AdminTemplateProps) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    document.title = title || "Title";
  }, [title]);

  return (
    <div className="flex min-h-screen">
      <AppBarAdmin
        openMobileDrawer={isMobileDrawerOpen}
        setOpenMobileDrawer={setIsMobileDrawerOpen}
      />
      <DrawerAdmin
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

export default AdminTemplate;
