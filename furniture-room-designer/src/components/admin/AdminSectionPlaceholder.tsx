import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminPanel } from "@/components/admin/AdminProvider";

type AdminSectionPlaceholderProps = {
  title: string;
  subtitle: string;
  sectionTitle: string;
  description: string;
};

export function AdminSectionPlaceholder({
  title,
  subtitle,
  sectionTitle,
  description,
}: AdminSectionPlaceholderProps) {
  const { theme } = useAdminPanel();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      <AdminHeader title={title} subtitle={subtitle} />

      <section className={[
        "rounded-[2rem] border p-8 shadow-soft",
        isDark
          ? "border-blue-700/70 bg-[rgba(30,24,21,0.74)]"
          : "border-blue-300/80 bg-gradient-to-br from-blue-50/20 to-white/95",
      ].join(" ")}>
        <div className="max-w-3xl">
          <h2 className={["text-3xl font-semibold tracking-tight", isDark ? "text-blue-100" : "text-blue-900"].join(" ")}>{sectionTitle}</h2>
          <p className={["mt-4 text-lg leading-8", isDark ? "text-blue-200/72" : "text-stone-500"].join(" ")}>{description}</p>
        </div>
      </section>
    </div>
  );
}
