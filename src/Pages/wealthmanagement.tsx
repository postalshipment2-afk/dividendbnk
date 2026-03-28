"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, PieChart, ArrowRight, Gem, Landmark } from "lucide-react";

const services = [
  {
    title: "Portfolio Optimization",
    desc: "Bespoke asset allocation using institutional-grade quantitative models and global market insights.",
    icon: <PieChart className="w-6 h-6" />,
    stats: "Top 1% Alpha Generation",
  },
  {
    title: "Legacy & Trust Planning",
    desc: "Sophisticated estate structures and multi-generational wealth transfer strategies across 140+ jurisdictions.",
    icon: <Landmark className="w-6 h-6" />,
    stats: "Tax-Efficient Structuring",
  },
  {
    title: "Global Alternative Assets",
    desc: "Exclusive access to private equity, venture capital, and rare commodity markets globally.",
    icon: <Gem className="w-6 h-6" />,
    stats: "Private Market Access",
  },
];

export default function WealthManagement() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION: Institutional Grandeur */}
      <section className="relative h-[70vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2070"
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Doksanlar Wealth Management"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 backdrop-blur-xl mb-8">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.4em]">
                Fiduciary Excellence
              </span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] mb-8 tracking-tighter italic">
              Wealth <br />
              <span className="text-blue-500 not-italic font-light tracking-normal">
                Redefined.
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium">
              We provide the sophisticated financial engineering required to
              protect, grow, and transition institutional-scale capital.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES GRID: The "Vault" Cards */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="group p-10 bg-slate-50 rounded-[3rem] border border-slate-100 transition-all hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-4 tracking-tight">
                {service.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                {service.desc}
              </p>
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  {service.stats}
                </span>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. CTA: THE PRIVATE CONSULTATION */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto relative rounded-[4rem] overflow-hidden bg-slate-950 p-16 md:p-32 text-center">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070"
              className="w-full h-full object-cover"
              alt="Advisor"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter">
              Consult with a <br /> Principal Advisor.
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link
                to="/contact"
                className="px-12 py-6 bg-white text-slate-950 font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-xs uppercase tracking-widest"
              >
                Request Private Meeting
              </Link>
              <Link
                to="/login"
                className="px-12 py-6 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
              >
                View Digital Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
