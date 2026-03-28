const StatsStrip = () => (
  <section className="py-20 bg-blue-700">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-white">
      {[
        { label: "Founded", val: "1990" },
        { label: "Assets", val: "$62B+" },
        { label: "Locations", val: "450+" },
        { label: "Global Rating", val: "AAA+" },
      ].map((s, i) => (
        <div key={i} className="text-center">
          <p className="text-4xl font-black mb-2">{s.val}</p>
          <p className="text-blue-200 uppercase tracking-widest text-xs font-bold">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default StatsStrip;
