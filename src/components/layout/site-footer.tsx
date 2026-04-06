export function SiteFooter() {
  return (
    <footer className="border-t border-white/60 bg-white/50 py-10">
      <div className="page-shell flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-foreground">Shahi Vastram</p>
          <p>Crafted occasionwear for modern Indian celebrations.</p>
        </div>
        <div className="text-sm">
          <p>Support: care@shahivastram.com</p>
          <p>Payments via Razorpay test mode or cash on delivery.</p>
        </div>
      </div>
    </footer>
  );
}
