import { AppShell } from "@/components/layout/AppShell";
import { NameListManager } from "@/components/ui/NameListManager";
import { categoryRows } from "@/lib/mock-main";

/** All Categories (design 42). */
export default function MainCategoriesPage() {
  return (
    <AppShell title="Services" role="main">
      <NameListManager
        addLabel="Add Category"
        placeholder="Enter category name"
        nameHeader="Category Name"
        initial={categoryRows}
        editPermission="services.categories"
      />
    </AppShell>
  );
}