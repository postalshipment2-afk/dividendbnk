import { ArrowRight, CheckCircle } from "lucide-react";

const SectionHeading = ({
  subtitle,
  title,
  light = false,
}: {
  subtitle: string;
  title: string;
  light?: boolean;
}) => (
  <div className="mb-16">
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`h-px w-12 ${light ? "bg-blue-400" : "bg-blue-600"}`}
      ></div>
      <span
        className={`font-bold uppercase tracking-[0.2em] text-xs ${light ? "text-blue-300" : "text-blue-600"}`}
      >
        {subtitle}
      </span>
    </div>
    <h2
      className={`text-4xl md:text-5xl font-black leading-tight ${light ? "text-white" : "text-slate-900"}`}
    >
      {title}
    </h2>
  </div>
);

const Mission = () => {
  return (
    <>
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="lg:grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1556740734-7f958945582b?q=80&w=2070"
                className="rounded-[3rem] shadow-2xl"
                alt="Client Meeting"
              />
            </div>
            <div className="order-1 lg:order-2 mb-16 lg:mb-0">
              <SectionHeading
                subtitle="Our Legacy"
                title="Over 30 Years of Banking Excellence"
              />
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                Since 1990, Nexus-Finance has been a cornerstone of financial
                stability. We've navigated market cycles with a focus on
                conservative risk management and aggressive technological
                growth.
              </p>
              <ul className="space-y-4">
                {[
                  "Dedicated Relationship Managers",
                  "Global Asset Access",
                  "Zero Hidden Fee Policy",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 font-bold text-slate-800"
                  >
                    <CheckCircle className="text-blue-600" size={18} /> {item}
                  </li>
                ))}
              </ul>
              <button className="mt-12 group flex items-center gap-3 text-blue-700 font-bold uppercase tracking-widest text-sm">
                Read our history{" "}
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
      ;
    </>
  );
};

export default Mission;
