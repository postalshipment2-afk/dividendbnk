"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  MapPin,
  Camera,
  Wallet,
  Eye,
  EyeOff,
  Menu,
  Search,
} from "lucide-react";

type ViewType = "dashboard" | "pin-dashboard";

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* MOBILE HEADER */}
      <div className="lg:hidden bg-slate-950 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl">
            <ShieldAlert size={20} />
          </div>
          <span className="text-lg font-black uppercase italic tracking-tighter">
            Admin Control
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-slate-950 w-80 h-full p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 p-2 rounded-xl">
                  <ShieldAlert size={24} />
                </div>
                <span className="text-xl font-black uppercase italic tracking-tighter">
                  Admin Control
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 space-y-3">
              <NavItem
                icon={<Users size={20} />}
                label="Dashboard"
                active={currentView === "dashboard"}
                onClick={() => {
                  setCurrentView("dashboard");
                  setIsMobileMenuOpen(false);
                }}
              />
              <NavItem
                icon={<Key size={20} />}
                label="Pin Dashboard"
                active={currentView === "pin-dashboard"}
                onClick={() => {
                  setCurrentView("pin-dashboard");
                  setIsMobileMenuOpen(false);
                }}
              />
            </nav>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-4 p-4 text-slate-400 hover:text-red-400 transition-colors font-bold text-sm"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-72 bg-slate-950 flex-col p-8 text-white fixed h-full z-40">
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

        <main className="flex-1 lg:ml-72 min-h-screen p-4 sm:p-6 lg:p-10">
          {currentView === "dashboard" && <ClientManagementView />}
          {currentView === "pin-dashboard" && <TransferPinsView />}
        </main>
      </div>
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newClient, setNewClient] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    country: "",
    address: "",
    balance: 0,
    image: null as File | null,
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

    if (newClient.password !== newClient.confirmPassword) {
      toast.error("Passwords do not match.");
      setActionLoading(null);
      return;
    }

    // Generate 10-digit account number (same as Signup)
    const generatedAccountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000,
    ).toString();

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newClient.email,
        password: newClient.password,
        options: {
          data: {
            full_name: newClient.full_name,
            country: newClient.country,
            address: newClient.address,
            mobile: newClient.mobile,
            balance: newClient.balance || 0,
            account_number: generatedAccountNumber,
            account_status: "pending", // Admin-created accounts are active by default
          },
        },
      });

      if (authError) throw authError;

      // Upload profile image if provided
      if (newClient.image && authData.user) {
        const fileExt = newClient.image.name.split(".").pop();
        const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`;
        await supabase.storage
          .from("avatars")
          .upload(fileName, newClient.image);
        await supabase.auth.updateUser({ data: { avatar_url: fileName } });
      }

      setIsModalOpen(false);
      setNewClient({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        country: "",
        address: "",
        balance: 0,
        image: null,
      });
      setImagePreview(null);
      fetchClients();
      toast.success(
        "Client account created successfully! The client can now log in with their credentials.",
      );
    } catch (error: any) {
      toast.error("Error creating client: " + error.message);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-4xl border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-5">
          <div className="bg-blue-600 p-3 sm:p-4 rounded-xl lg:rounded-2xl text-white shrink-0">
            <TrendingUp size={24} className="sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 truncate">
              Total Bank Assets
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black truncate">
              ${totalLiquidity.toLocaleString()}
            </h2>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-4xl border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-5">
          <div className="bg-emerald-500 p-3 sm:p-4 rounded-xl lg:rounded-2xl text-white shrink-0">
            <Users size={24} className="sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 truncate">
              Verified Profiles
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black truncate">
              {clients.length}
            </h2>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black italic tracking-tighter flex items-center gap-2 sm:gap-3 uppercase">
          <ShieldAlert className="text-red-600 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          <span className="truncate">Client Management</span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 shadow-sm text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-4 sm:px-6 py-2 rounded-xl font-bold flex gap-2 items-center hover:scale-105 transition-all text-sm whitespace-nowrap"
          >
            <UserPlus size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">New Client</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl lg:rounded-4xl shadow-xl border border-slate-100 overflow-hidden relative min-h-100">
        {loading && !actionLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <Loader2
              className="animate-spin text-blue-600 sm:w-8 sm:h-8 lg:w-12 lg:h-12 text-center "
              size={32}
            />
          </div>
        )}

        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {filteredClients.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              {loading ? "Loading clients..." : "No clients found"}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-lg truncate">
                        {client.full_name}
                      </div>
                      <div className="text-sm text-slate-600 truncate">
                        {client.email}
                      </div>
                      {client.mobile && (
                        <div className="flex items-center gap-1 text-blue-500 text-sm mt-1">
                          <Phone size={12} /> {client.mobile}
                        </div>
                      )}
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${
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
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase">
                        Account
                      </div>
                      <div className="font-mono font-bold flex items-center gap-1">
                        <Hash size={12} className="text-slate-300" />
                        {client.account_number}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase">
                        Country
                      </div>
                      <div className="uppercase font-bold flex items-center gap-1">
                        <Globe size={12} className="text-slate-300" />
                        {client.country}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase">
                        Balance
                      </div>
                      {editingId === client.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) =>
                              setEditValue(Number(e.target.value))
                            }
                            className="w-20 px-2 py-1 border rounded text-sm"
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
                        <div className="font-bold text-lg text-green-600">
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
                    </div>

                    <div className="flex gap-2">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left min-w-200">
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

        {filteredClients.length === 0 && !loading && (
          <div className="p-8 text-center text-slate-500">
            No clients found matching your search.
          </div>
        )}
      </div>

      {/* ADD CLIENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                Create Client Account
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-blue-500 transition-colors shadow-inner"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <Camera className="text-slate-400" size={32} />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewClient({ ...newClient, image: file });
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                  accept="image/*"
                />
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">
                  Upload Profile Photo (Optional)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserPlus
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type="text"
                      required
                      value={newClient.full_name}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          full_name: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-xl text-sm focus:border-blue-600 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Globe
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type="email"
                      required
                      value={newClient.email}
                      onChange={(e) =>
                        setNewClient({ ...newClient, email: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-xl text-sm focus:border-blue-600 outline-none transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newClient.password}
                      onChange={(e) =>
                        setNewClient({ ...newClient, password: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 pr-12 rounded-xl text-sm focus:border-blue-600 outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={newClient.confirmPassword}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 pr-12 rounded-xl text-sm focus:border-blue-600 outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Mobile Contact
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type="tel"
                      required
                      value={newClient.mobile}
                      onChange={(e) =>
                        setNewClient({ ...newClient, mobile: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-xl text-sm focus:border-blue-600 outline-none transition-all"
                      placeholder="+44..."
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Country
                  </label>
                  <div className="relative">
                    <Globe
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type="text"
                      required
                      value={newClient.country}
                      onChange={(e) =>
                        setNewClient({ ...newClient, country: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-xl text-sm focus:border-blue-600 outline-none transition-all"
                      placeholder="UK"
                    />
                  </div>
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Residential Address
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type="text"
                      required
                      value={newClient.address}
                      onChange={(e) =>
                        setNewClient({ ...newClient, address: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-xl text-sm focus:border-blue-600 outline-none transition-all"
                      placeholder="123 Luxury Lane, City"
                    />
                  </div>
                </div>

                {/* Initial Balance - Full Width */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">
                    Opening Deposit (USD)
                  </label>
                  <div className="relative">
                    <Wallet
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                      size={24}
                    />
                    <span className="absolute left-12 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xl">
                      $
                    </span>
                    <input
                      type="number"
                      required
                      min="100"
                      value={newClient.balance}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          balance: Number(e.target.value),
                        })
                      }
                      className="w-full bg-blue-50/30 border-2 border-blue-100 p-5 pl-16 rounded-2xl text-2xl font-black focus:border-blue-600 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewClient({
                      full_name: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      mobile: "",
                      country: "",
                      address: "",
                      balance: 0,
                      image: null,
                    });
                    setImagePreview(null);
                    setShowPassword(false);
                    setShowConfirmPassword(false);
                  }}
                  className="flex-1 py-4 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "adding"}
                  className="flex-1 py-4 bg-slate-950 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === "adding" ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Create Client Account"
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
    { threshold: 65, label: "COT Code", code: "7026" },
    { threshold: 85, label: "Clearance/Tax Key", code: "2789" },
    { threshold: 95, label: "Auth Token", code: "6795" },
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
