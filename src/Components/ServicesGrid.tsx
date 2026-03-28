import { Users, TrendingUp, ShieldCheck, Smartphone } from "lucide-react";

const ServicesGrid = () => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: <Users />,
            title: "Personal Banking",
            desc: "Tailored checking and savings accounts designed for your daily needs.",
          },
          {
            icon: <TrendingUp />,
            title: "Investment Plans",
            desc: "Strategic asset allocation to ensure long-term capital appreciation.",
          },
          {
            icon: <ShieldCheck />,
            title: "Insurance Services",
            desc: "Comprehensive coverage to protect what matters most to you.",
          },
          {
            icon: <Smartphone />,
            title: "Mobile Banking",
            desc: "Award-winning app to manage your wealth from anywhere on earth.",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="group p-10 rounded-4xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl transition-all duration-500"
          >
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{s.title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesGrid;
