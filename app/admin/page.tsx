import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AdminConsole } from "./admin-console";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-page">
        <div className="container-bx">
          <AdminConsole />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
