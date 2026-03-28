import { Lock, ShieldAlert } from "lucide-react";

const SecurityCommitment = () => (
  <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="lg:grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <p className="text-slate-400 mb-10 text-lg">
            We employ multi-layer biometric authentication and real-time AI
            fraud monitoring to ensure your assets remain untouchable.
          </p>
          <div className="space-y-8">
            {[
              {
                icon: <Lock />,
                title: "AES-256 Encryption",
                text: "Global standard for data protection used by governments.",
              },
              {
                icon: <ShieldAlert />,
                title: "Fraud Prevention",
                text: "Instant alerts and automatic freezing for suspicious activity.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="text-blue-500">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                  <p className="text-slate-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 lg:mt-0 relative">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070"
            className="rounded-[3rem] opacity-60 border border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300 relative z-10"
            alt="Data Security"
          />
          <div className="absolute inset-0 bg-blue-600/10 rounded-[3rem]"></div>
        </div>
      </div>
    </div>
  </section>
);

export default SecurityCommitment;
