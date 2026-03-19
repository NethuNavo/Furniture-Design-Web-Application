import { Palette, Sparkles, TabletSmartphone } from "lucide-react";

type Step = {
  number: string;
  title: string;
  description: string;
  icon: "style" | "design" | "home";
};

type HowItWorksSectionProps = {
  steps: Step[];
};

const iconMap = {
  style: Palette,
  design: TabletSmartphone,
  home: Sparkles,
};

export function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  return (
    <section id="room-designer" className="shell py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-title">How Room Designer Works</h2>
        <p className="mt-5 text-lg leading-8 text-charcoal/66 sm:text-[1.2rem]">
          Transform your space in three simple steps with our innovative room design tool
        </p>
      </div>

      <div className="mt-14 grid gap-7 lg:grid-cols-3 lg:gap-8">
        {steps.map((step) => {
          const Icon = iconMap[step.icon];

          return (
            <article
              key={step.number}
              className="glass-card rounded-[1.85rem] px-6 py-9 text-center sm:px-7"
            >
              <div className="glass-card-strong relative mx-auto flex h-24 w-24 items-center justify-center rounded-full">
                <span className="absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-sm font-semibold text-white">
                  {step.number}
                </span>
                <Icon className="h-10 w-10 text-charcoal" strokeWidth={1.8} />
              </div>
              <h3 className="mt-7 text-[1.75rem] font-semibold tracking-tight text-charcoal">
                {step.title}
              </h3>
              <p className="mt-4 text-[1.05rem] leading-8 text-charcoal/65">{step.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
