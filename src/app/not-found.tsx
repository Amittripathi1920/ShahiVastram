import { CategoryGrid } from "@/components/store/category-grid";

export default function NotFound() {
  return (
    <div className="page-shell py-20">
      <div className="card-surface p-10 text-center">
        <h1 className="text-4xl font-semibold text-foreground">Page Not Found</h1>
        <p className="mt-3 text-muted-foreground">The page you requested could not be found.</p>
        <div className="mt-8">
          <CategoryGrid />
        </div>
      </div>
    </div>
  );
}
