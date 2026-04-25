"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../hooks/supabase";
import { toast } from "sonner";
import {
  Edit3,
  Save,
  ShieldAlert,
  Lock,
  Unlock,
  UserPlus,
  Hash,
  TrendingUp,
  Users,
  Loader2,
  X,
  Phone,
  Key,
  LogOut,
  Globe,
} from "lucide-react";

type ViewType = "dashboard" | "pin-dashboard";

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-950 flex flex-col p-8 text-white fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-red-600 p-2 rounded-xl">
            <ShieldAlert size={24} />
          </div>
          <span className="text-xl font-black uppercase italic tracking-tighter">
            Admin Control
          </span>
        </div>
        <nav className="flex-1 space-y-3">
          <NavItem
            icon={<Users size={20} />}
            label="Dashboard"
            active={currentView === "dashboard"}
            onClick={() => setCurrentView("dashboard")}
          />
          <NavItem
            icon={<Key size={20} />}
            label="Pin Dashboard"
            active={currentView === "pin-dashboard"}
            onClick={() => setCurrentView("pin-dashboard")}
          />
        </nav>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-4 p-4 text-slate-400 hover:text-red-400 transition-colors font-bold text-sm"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      <main className="ml-72 flex-1 min-h-screen p-6 lg:p-10">
        {currentView === "dashboard" && <ClientManagementView />}
        {currentView === "pin-dashboard" && <TransferPinsView />}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active = false, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm ${
      active
        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
        : "text-slate-400 hover:text-white hover:bg-slate-900"
    }`}
  >
    {icon} {label}
  </button>
);

const ClientManagementView = () => {
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
      toast.success("Client added successfully!");
    } else {
      toast.error("Error adding client: " + error.message);
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
      toast.success("Balance updated successfully!");
    } else {
      toast.error("Update failed: " + error.message);
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

    if (!error) {
      await fetchClients();
      toast.success(`Account status changed to ${nextStatus}!`);
    }
    setActionLoading(null);
  };

  const deleteClient = async (id: string) => {
    if (window.confirm("Confirm deletion?")) {
      setActionLoading(`delete-${id}`);
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (!error) {
        await fetchClients();
        toast.success("Client deleted successfully!");
      }
      setActionLoading(null);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="text-slate-900">
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
          <ShieldAlert className="text-red-600" /> Client Management
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
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      client.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : client.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {client.status === "active" ? (
                      <Unlock size={10} />
                    ) : (
                      <Lock size={10} />
                    )}
                    {client.status}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {editingId === client.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="w-24 px-2 py-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => patchBalance(client.id)}
                        disabled={actionLoading === `balance-${client.id}`}
                        className="p-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading === `balance-${client.id}` ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Save size={12} />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="font-bold text-lg">
                      ${Number(client.balance).toLocaleString()}
                      <button
                        onClick={() => {
                          setEditingId(client.id);
                          setEditValue(Number(client.balance));
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
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
                      disabled={actionLoading === `status-${client.id}`}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                        client.status === "active"
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      } disabled:opacity-50`}
                    >
                      {actionLoading === `status-${client.id}` ? (
                        <Loader2 size={12} className="animate-spin mx-auto" />
                      ) : client.status === "active" ? (
                        "Lock"
                      ) : (
                        "Unlock"
                      )}
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
                      disabled={actionLoading === `delete-${client.id}`}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-red-700 disabled:opacity-50 transition-all"
                    >
                      {actionLoading === `delete-${client.id}` ? (
                        <Loader2 size={12} className="animate-spin mx-auto" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD CLIENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">
              Add New Client
            </h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newClient.full_name}
                onChange={(e) =>
                  setNewClient({ ...newClient, full_name: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                required
              />
              <input
                type="tel"
                placeholder="Mobile"
                value={newClient.mobile}
                onChange={(e) =>
                  setNewClient({ ...newClient, mobile: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              />
              <input
                type="text"
                placeholder="Country"
                value={newClient.country}
                onChange={(e) =>
                  setNewClient({ ...newClient, country: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                required
              />
              <input
                type="number"
                placeholder="Initial Balance"
                value={newClient.balance}
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    balance: Number(e.target.value),
                  })
                }
                className="w-full p-3 border rounded-xl"
                min="0"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "adding"}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {actionLoading === "adding" ? (
                    <Loader2 className="animate-spin mx-auto" size={20} />
                  ) : (
                    "Add Client"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TransferPinsView = () => {
  const SECURITY_LAYERS = [
    { threshold: 35, label: "Transfer PIN", code: "9067" },
    { threshold: 65, label: "Institutional Hash", code: "70268898" },
    { threshold: 85, label: "Clearance Key", code: "27890700" },
    { threshold: 95, label: "Final Auth Token", code: "2567955" },
  ];

  return (
    <div className="text-slate-900">
      <h1 className="text-3xl font-black italic tracking-tighter mb-8 flex items-center gap-3 uppercase">
        <Key className="text-red-600" /> Transfer Security Pins
      </h1>

      <div className="bg-white rounded-4xl p-8 shadow-xl border border-slate-100">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            Security Layer Configuration
          </h2>
          <p className="text-slate-600 text-sm">
            These are the hardcoded security pins used in the transfer modal for
            multi-layer authentication.
          </p>
        </div>

        <div className="space-y-4">
          {SECURITY_LAYERS.map((layer, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Key size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{layer.label}</h3>
                  <p className="text-xs text-slate-500">
                    Threshold: {layer.threshold}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-lg text-slate-900">
                  {layer.code}
                </div>
                <p className="text-xs text-slate-500">Security Code</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800">Security Notice</h3>
              <p className="text-sm text-amber-700 mt-1">
                These pins are hardcoded for remembrance purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
