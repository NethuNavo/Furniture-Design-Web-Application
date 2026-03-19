import aboutUsPageImage from "../../../image/about us page.png";
import scandinavianDiningSetImage from "../../../image/Scandinavian Dining Set.jpg";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-charcoal">
      <Navbar />
      <section className="w-full px-3 py-12 sm:px-5 sm:py-14 lg:px-6 lg:py-16">
        <div className="mx-auto grid w-full max-w-[1440px] gap-6">
          <div className="glass-card grid overflow-hidden rounded-[1.8rem] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-7 lg:py-7 lg:pr-7">
              <p className="text-xs uppercase tracking-[0.3em] text-charcoal/45 sm:text-sm">About Nord Living</p>
              <h1 className="mt-3 font-display text-[2.2rem] font-semibold tracking-tight sm:text-[2.6rem] lg:text-[2.85rem]">
                Scandinavian furniture, thoughtfully connected to modern living.
              </h1>
              <p className="mt-3.5 max-w-3xl text-sm leading-7 text-charcoal/68 sm:text-base sm:leading-7.5">
                Nord Living brings together furniture discovery, room inspiration, and planning tools in one calm, minimal experience. We focus on warm Scandinavian styling, practical design support, and premium pieces that help customers build beautiful everyday spaces.
              </p>

              <div className="mt-5 grid gap-3.5 sm:grid-cols-3">
                {[
                  { label: "Founded", value: "2024", note: "Built for intentional living" },
                  { label: "Showroom", value: "Colombo", note: "Warm studio experience" },
                  { label: "Focus", value: "Design + Shop", note: "Furniture and planning tools" },
                ].map((item) => (
                  <div key={item.label} className="glass-subcard rounded-[1.2rem] px-4 py-3.5">
                    <p className="text-xs uppercase tracking-[0.18em] text-charcoal/45">{item.label}</p>
                    <p className="mt-1.5 text-base font-semibold text-charcoal">{item.value}</p>
                    <p className="mt-1 text-sm leading-5.5 text-charcoal/62">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-300/70 bg-stone-50 p-3 lg:border-l lg:border-t-0">
              <div className="glass-card-strong h-full overflow-hidden rounded-[1.5rem]">
                <img
                  src={aboutUsPageImage.src}
                  alt="Nord Living showroom interior"
                  className="h-full min-h-[180px] w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
            <section className="glass-card rounded-[1.8rem] p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-charcoal/45 sm:text-sm">Our Story</p>
              <h2 className="mt-3 text-[1.65rem] font-semibold tracking-tight text-charcoal sm:text-[1.8rem]">
                Design guidance, furniture, and planning in one place.
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-charcoal/68 sm:text-[0.98rem] sm:leading-7">
                <p>
                  Nord Living was created to make furniture shopping feel more intentional. Instead of separating inspiration, products, and planning, we bring them together so customers can move from idea to room layout with confidence.
                </p>
                <p>
                  Our approach blends clean silhouettes, warm neutral materials, and practical tools like the room planner so every decision feels simpler and more connected.
                </p>
              </div>

              <div className="glass-subcard mt-5 overflow-hidden rounded-[1.35rem]">
                <img
                  src={scandinavianDiningSetImage.src}
                  alt="Nord Living dining space"
                  className="h-44 w-full object-cover"
                />
              </div>
            </section>

            <section
              id="contact"
              className="glass-card rounded-[1.8rem] p-6 sm:p-7"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-charcoal/45 sm:text-sm">Contact</p>
              <h2 className="mt-3 text-[1.65rem] font-semibold tracking-tight text-charcoal sm:text-[1.8rem]">
                Visit, call, or write to the Nord Living team.
              </h2>

              <div className="mt-5 grid gap-3">
                {[
                  { icon: MapPin, label: "Showroom", value: "128 Nordic Avenue, Colombo 03, Sri Lanka" },
                  { icon: Phone, label: "Phone", value: "+94 11 245 7788" },
                  { icon: Mail, label: "Email", value: "hello@nordliving.com" },
                  { icon: Clock3, label: "Hours", value: "Mon - Sat, 9:00 AM - 7:00 PM" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="glass-subcard rounded-[1.2rem] px-4 py-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-5 w-5 text-charcoal/65" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45 sm:text-sm">{item.label}</p>
                          <p className="mt-1 text-sm font-medium leading-5.5 text-charcoal sm:text-[0.98rem]">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="glass-card rounded-[1.8rem] p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-charcoal/45 sm:text-sm">Sample Shop Details</p>
            <h2 className="mt-4 text-[1.85rem] font-semibold tracking-tight text-charcoal sm:text-[2rem]">
              A warm showroom experience built around real spaces.
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="glass-subcard rounded-[1.35rem] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45 sm:text-sm">Flagship Store</p>
                <p className="mt-2 text-base font-semibold text-charcoal sm:text-lg">Colombo Studio</p>
                <p className="mt-2 text-sm leading-7 text-charcoal/66">
                  Curated living, dining, and bedroom spaces with in-store design consultations.
                </p>
              </div>
              <div className="glass-subcard rounded-[1.35rem] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45 sm:text-sm">Services</p>
                <p className="mt-2 text-base font-semibold text-charcoal sm:text-lg">Room Planning Support</p>
                <p className="mt-2 text-sm leading-7 text-charcoal/66">
                  Customers can browse furniture, test layouts, and receive styling guidance before purchasing.
                </p>
              </div>
              <div className="glass-subcard rounded-[1.35rem] px-5 py-5">
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45 sm:text-sm">Delivery</p>
                <p className="mt-2 text-base font-semibold text-charcoal sm:text-lg">Islandwide Coverage</p>
                <p className="mt-2 text-sm leading-7 text-charcoal/66">
                  White-glove delivery, assembly support, and setup coordination for selected orders.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
