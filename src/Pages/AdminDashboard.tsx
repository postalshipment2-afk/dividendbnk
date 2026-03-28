"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../hooks/supabase";
import {
  Edit3,
  Save,
  ShieldAlert,
  Lock,
  Unlock,
  UserPlus,
  Trash2,
  Globe,
  Hash,
  TrendingUp,
  Users,
  Loader2,
  X,
  Phone,
} from "lucide-react";

export default function AdminDashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [totalLiquidity, setTotalLiquidity] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const [newClient, setNewClient] = useState({
    full_name: "",
    email: "",
    mobile: "",
    country: "",
    balance: 0,
  });

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setClients(data);
      const total = data.reduce(
        (acc, curr) => acc + (Number(curr.balance) || 0),
        0,
      );
      setTotalLiquidity(total);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // --- DATABASE ACTIONS ---

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("adding");
    const accNumber = Math.floor(
      1000000000 + Math.random() * 9000000000,
    ).toString();

    const { error } = await supabase.from("profiles").insert([
      {
        full_name: newClient.full_name,
        email: newClient.email,
        mobile: newClient.mobile,
        country: newClient.country,
        balance: newClient.balance,
        account_number: accNumber,
        status: "active",
      },
    ]);

    if (!error) {
      setIsModalOpen(false);
      setNewClient({
        full_name: "",
        email: "",
        mobile: "",
        country: "",
        balance: 0,
      });
      fetchClients();
    } else {
      alert("Error adding client: " + error.message);
    }
    setActionLoading(null);
  };

  const patchBalance = async (id: string) => {
    setActionLoading(`balance-${id}`);
    const { error } = await supabase
      .from("profiles")
      .update({ balance: Number(editValue) })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      await fetchClients();
    } else {
      alert("Update failed: " + error.message);
    }
    setActionLoading(null);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    setActionLoading(`status-${id}`);
    const nextStatus = currentStatus === "locked" ? "active" : "locked";
    const { error } = await supabase
      .from("profiles")
      .update({ status: nextStatus })
      .eq("id", id);

    if (!error) await fetchClients();
    setActionLoading(null);
  };

  const deleteClient = async (id: string) => {
    if (window.confirm("Confirm deletion?")) {
      setActionLoading(`delete-${id}`);
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (!error) await fetchClients();
      setActionLoading(null);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="bg-blue-600 p-4 rounded-2xl text-white">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">
                Total Bank Assets
              </p>
              <h2 className="text-3xl font-black">
                ${totalLiquidity.toLocaleString()}
              </h2>
            </div>
          </div>
          <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="bg-emerald-500 p-4 rounded-2xl text-white">
              <Users size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">
                Verified Profiles
              </p>
              <h2 className="text-3xl font-black">{clients.length}</h2>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black italic tracking-tighter flex items-center gap-3 uppercase">
            <ShieldAlert className="text-red-600" /> Doksanlar Control
          </h1>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-xl outline-none focus:border-blue-600 shadow-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-6 py-2 rounded-xl font-bold flex gap-2 items-center hover:scale-105 transition-all"
            >
              <UserPlus size={18} /> New Client
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-4xl shadow-xl border border-slate-100 overflow-hidden relative min-h-100">
          {loading && !actionLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          )}

          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-white text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-6 py-5">Profile Name</th>
                <th className="px-6 py-5">Account & Region</th>
                <th className="px-6 py-5">Security</th>
                <th className="px-6 py-5">Balance (USD)</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">
                      {client.full_name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                      <span>{client.email}</span>
                      {client.mobile && (
                        <span className="flex items-center gap-1 text-blue-500">
                          <Phone size={8} /> {client.mobile}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-mono font-bold">
                      <Hash size={12} className="inline mr-1 text-slate-300" />
                      {client.account_number}
                    </div>
                    <div className="text-[9px] uppercase text-slate-400 font-bold">
                      <Globe size={10} className="inline mr-1" />
                      {client.country}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${client.status === "active" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === client.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          type="number"
                          defaultValue={client.balance}
                          className="w-24 p-1 border-2 border-blue-600 rounded font-bold"
                          onChange={(e) => setEditValue(Number(e.target.value))}
                        />
                        <button
                          onClick={() => patchBalance(client.id)}
                          className="text-emerald-600"
                        >
                          {actionLoading === `balance-${client.id}` ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Save size={18} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 font-black text-slate-800">
                        ${Number(client.balance).toLocaleString()}
                        <button
                          onClick={() => {
                            setEditingId(client.id);
                            setEditValue(client.balance);
                          }}
                          className="text-blue-500 hover:scale-125 transition-transform"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(client.id, client.status)}
                        className="p-2 border rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        {actionLoading === `status-${client.id}` ? (
                          <Loader2
                            size={16}
                            className="animate-spin text-blue-600"
                          />
                        ) : client.status === "locked" ? (
                          <Unlock size={16} />
                        ) : (
                          <Lock size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="p-2 border rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      >
                        {actionLoading === `delete-${client.id}` ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="bg-slate-950 p-6 flex justify-between text-white font-black uppercase italic tracking-tighter items-center">
              <span>Create Bank Profile</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:text-red-500"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleAddClient} className="p-8 space-y-4">
              <input
                required
                placeholder="Client Full Name"
                className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-600"
                onChange={(e) =>
                  setNewClient({ ...newClient, full_name: e.target.value })
                }
              />
              <input
                required
                placeholder="Email Address"
                className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-600"
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Phone Number"
                  className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
                  onChange={(e) =>
                    setNewClient({ ...newClient, mobile: e.target.value })
                  }
                />
                <input
                  placeholder="Region/Country"
                  className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
                  onChange={(e) =>
                    setNewClient({ ...newClient, country: e.target.value })
                  }
                />
              </div>
              <input
                required
                placeholder="Initial Liquidity ($)"
                type="number"
                className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-600"
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    balance: Number(e.target.value),
                  })
                }
              />
              <button
                disabled={actionLoading === "adding"}
                className="w-full bg-blue-600 py-4 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                {actionLoading === "adding" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Finalize Profile"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
