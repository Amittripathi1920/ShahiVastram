import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-3">
      <Badge variant="secondary">{eyebrow}</Badge>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
          {title}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
      </div>
    </div>
  );
}
