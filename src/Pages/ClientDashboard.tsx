"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Centralized Supabase Client
import { supabase } from "../hooks/supabase";
import {
  LayoutDashboard,
  Send,
  ShieldCheck,
  LogOut,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Plus,
  Fingerprint,
  PieChart,
} from "lucide-react";
import TransferModal from "../Components/TransferModal";

const ClientDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState(0.0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const setupDashboard = async () => {
      try {
        setIsLoading(true);

        // 1. Verify Authentication
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          navigate("/Login");
          return;
        }

        // 2. Fetch Profile from 'profiles' table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError || !profileData) {
          console.error("Profile sync error:", profileError);
          return;
        }

        // DEBUG: Check your console to see the exact column names
        console.log("DEBUG PROFILE DATA:", profileData);

        setProfile(profileData);
        setBalance(Number(profileData.balance) || 0.0);

        // 3. Set Initial Ledger Item
        setTransactions([
          {
            id: "init",
            name: "Verified Ledger Balance",
            date: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            amount: `+${Number(profileData.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            type: "deposit",
          },
        ]);

        // 4. Real-time Listener (Auto-updates and Security Kick)
        const channel = supabase
          .channel(`db-sync-${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "profiles",
              filter: `id=eq.${user.id}`,
            },
            (payload) => {
              // Kick if account is no longer active
              if (payload.new.status !== "active") {
                supabase.auth.signOut().then(() => navigate("/Login"));
                return;
              }
              setProfile(payload.new);
              setBalance(Number(payload.new.balance));
            },
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.error("Dashboard Setup Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    setupDashboard();
  }, [navigate]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
            Securing Connection...
          </p>
        </div>
      </div>
    );
  }

  const onTransferSuccess = async (amount: number, recipient: string) => {
    if (!profile?.id) return;

    const newBalance = balance - amount;
    const { error } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", profile.id);

    if (!error) {
      setBalance(newBalance);
      setTransactions([
        {
          id: Date.now(),
          name: `Transfer to ${recipient}`,
          date: "Just Now",
          amount: `-${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          type: "withdrawal",
        },
        ...transactions,
      ]);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/Login");
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-24 lg:pb-0 font-sans text-slate-900">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-slate-950 flex-col p-8 text-white fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-black uppercase italic tracking-tighter">
            Doksanlar
          </span>
        </div>
        <nav className="flex-1 space-y-3">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active
          />
          <NavItem
            icon={<Send size={20} />}
            label="Transfers"
            onClick={() => setIsModalOpen(true)}
          />
          <NavItem icon={<PieChart size={20} />} label="Analytics" />
          <NavItem icon={<CreditCard size={20} />} label="My Cards" />
        </nav>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 p-4 text-slate-400 hover:text-red-400 transition-colors font-bold text-sm"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      <main className="lg:ml-72 min-h-screen">
        {/* HEADER WITH CLIENT NAME LOGIC */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 lg:px-10 flex justify-between items-center">
          <div className="hidden lg:block">
            <h1 className="text-xl font-black text-slate-950 uppercase italic tracking-tight">
              {/* Fallback chain for different database naming conventions */}
              Welcome back,{" "}
              {profile?.full_name ||
                profile?.name ||
                profile?.username ||
                "Executive"}
            </h1>
            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
              Institutional A/C: {profile?.account_number || "-----------"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold uppercase text-xs">
              {/* Dynamic Initials Fallback */}
              {(profile?.full_name || profile?.name || "AD")
                .split(" ")
                .map((n: any) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
          {/* BALANCE CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
                  Total Managed Balance
                </p>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">
                  <span className="text-blue-600 text-2xl mr-2">USD</span>
                  {balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </h2>
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                  >
                    <Send size={16} /> Transfer
                  </button>
                  <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-600/20">
                    <Plus size={16} /> Deposit
                  </button>
                </div>
              </div>
            </div>

            {/* ATM CARD DISPLAY */}
            <div className="lg:col-span-5">
              <ATMCard
                type="Platinum"
                number={`**** ${profile?.account_number?.slice(-4) || "0000"}`}
                expiry="12/28"
                color="bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* TRANSACTION LIST */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-slate-100">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">
                Ledger Activity
              </h4>
              <div className="space-y-2">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))
                ) : (
                  <p className="text-xs text-slate-400 font-bold uppercase py-10 text-center">
                    No recent activity
                  </p>
                )}
              </div>
            </div>

            {/* SECURITY CARD */}
            <div className="bg-blue-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-blue-700/20 flex flex-col justify-between">
              <div>
                <Fingerprint size={32} className="mb-4 text-blue-200" />
                <h5 className="font-black uppercase text-xs tracking-widest mb-1">
                  Security Status
                </h5>
                <p className="text-blue-100 text-[11px] leading-relaxed">
                  Encryption active. Status:{" "}
                  <span className="text-white font-bold uppercase">
                    {profile?.status || "Active"}
                  </span>
                </p>
              </div>
              <div className="mt-6 h-1 w-full bg-blue-900/30 rounded-full">
                <div className="h-full w-[95%] bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      <TransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentBalance={balance}
        onSuccess={onTransferSuccess}
      />
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active = false, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
        : "text-slate-400 hover:text-white hover:bg-slate-900"
    }`}
  >
    {icon} {label}
  </button>
);

const ATMCard = ({ type, number, expiry, color }: any) => (
  <div
    className={`${color} p-6 rounded-3xl text-white shadow-lg flex flex-col justify-between h-44 transition-transform hover:scale-[1.02] cursor-pointer relative overflow-hidden`}
  >
    <div className="flex justify-between items-start relative z-10">
      <div className="flex flex-col">
        <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">
          {type}
        </span>
        <span className="text-lg font-bold italic tracking-tighter">
          Doksanlar
        </span>
      </div>
      <div className="w-10 h-8 bg-amber-400/20 rounded-md border border-amber-400/30"></div>
    </div>
    <div className="space-y-1 relative z-10">
      <p className="text-lg font-black tracking-[0.2em]">{number}</p>
      <div className="flex justify-between items-center opacity-60 text-[10px] font-bold">
        <span>EXPIRES: {expiry}</span>
        <span className="uppercase italic">Visa Platinum</span>
      </div>
    </div>
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
  </div>
);

const TransactionRow = ({ tx }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          tx.type === "deposit"
            ? "bg-green-100 text-green-600"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {tx.type === "deposit" ? (
          <ArrowDownLeft size={18} />
        ) : (
          <ArrowUpRight size={18} />
        )}
      </div>
      <div className="flex flex-col">
        <h5 className="text-xs font-black text-slate-900">{tx.name}</h5>
        <p className="text-[9px] font-black text-slate-400 uppercase">
          {tx.date}
        </p>
      </div>
    </div>
    <span
      className={`text-sm font-black tracking-tight ${
        tx.type === "deposit" ? "text-green-600" : "text-slate-900"
      }`}
    >
      {tx.amount}
    </span>
  </div>
);

export default ClientDashboard;
