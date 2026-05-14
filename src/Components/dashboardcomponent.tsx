// import React, { useEffect, useState } from "react";
// import { supabase } from "../hooks/supabase";
// import {
//   Search,
//   Edit2,
//   Trash2,
//   History,
//   Lock,
//   Unlock,
//   X,
//   Globe,
//   Loader2,
//   CheckCircle2,
// } from "lucide-react";

// const supabaseurl = supabase;

// interface Profile {
//   id: string;
//   full_name: string;
//   email: string;
//   account_number: string;
//   balance: number;
//   status: "active" | "locked" | "pending" | "suspended";
//   history_date: string;
//   history_from: string;
//   history_to: string;
//   history_amount: number;
//   transfer_origin_country: string;
//   history_status: "credit" | "debit";
// }

// const dashboardComponent: React.FC = () => {
//   const [profiles, setProfiles] = useState<Profile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [historyPanelProfile, setHistoryPanelProfile] =
//     useState<Profile | null>(null);

//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   const fetchProfiles = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabaseurl
//         .from("profiles")
//         .select("*")
//         .order("full_name", { ascending: true });
//       if (error) throw error;
//       setProfiles(data || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleStatus = async (id: string, currentStatus: string) => {
//     // Cycles through statuses or toggles between locked/active
//     const newStatus = currentStatus === "active" ? "locked" : "active";

//     try {
//       const { error } = await supabaseurl
//         .from("profiles")
//         .update({ status: newStatus })
//         .eq("id", id);

//       if (error) throw error;
//       await fetchProfiles();
//     } catch (err: any) {
//       alert(
//         `Status Update Failed: ${err.message}. Check SQL Triggers for 'history_country' typo.`,
//       );
//     }
//   };

//   const handleDelete = async (id: string, name: string) => {
//     if (!window.confirm(`Permanently delete ${name}?`)) return;
//     try {
//       const { error } = await supabaseurl
//         .from("profiles")
//         .delete()
//         .eq("id", id);
//       if (error) throw error;
//       setProfiles((prev) => prev.filter((p) => p.id !== id));
//     } catch (err: any) {
//       alert("Delete failed: " + err.message);
//     }
//   };

//   const handleHistorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!historyPanelProfile) return;
//     setIsSubmitting(true);

//     try {
//       const amountChange = Number(historyPanelProfile.history_amount || 0);
//       const updatedBalance =
//         historyPanelProfile.history_status === "credit"
//           ? Number(historyPanelProfile.balance) + amountChange
//           : Number(historyPanelProfile.balance) - amountChange;

//       const { error } = await supabaseurl
//         .from("profiles")
//         .update({
//           history_date: historyPanelProfile.history_date,
//           history_from: historyPanelProfile.history_from,
//           history_to: historyPanelProfile.history_to,
//           history_amount: amountChange,
//           history_status: historyPanelProfile.history_status,
//           transfer_origin_country: historyPanelProfile.transfer_origin_country,
//           balance: updatedBalance,
//         })
//         .eq("id", historyPanelProfile.id);

//       if (error) throw error;
//       setHistoryPanelProfile(null);
//       await fetchProfiles();
//     } catch (err: any) {
//       alert("Update failed: " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredProfiles = profiles.filter(
//     (p) =>
//       p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.email?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
//       <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-30">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
//           <div>
//             <h1 className="text-xl font-bold text-slate-800">
//               Admin Dashboard
//             </h1>
//             <p className="text-xs text-slate-400 font-medium uppercase">
//               Client Control Panel
//             </p>
//           </div>
//           <div className="relative w-full md:w-64">
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               size={16}
//             />
//             <input
//               type="text"
//               placeholder="Search clients..."
//               className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto p-4 md:p-8">
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-200">
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
//                     Client
//                   </th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
//                     Account
//                   </th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
//                     Balance
//                   </th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {loading ? (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="text-center py-10 text-slate-400"
//                     >
//                       Fetching records...
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredProfiles.map((p) => (
//                     <tr
//                       key={p.id}
//                       className="hover:bg-slate-50/50 transition-colors"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="font-semibold text-slate-700">
//                           {p.full_name}
//                         </div>
//                         <div className="text-xs text-slate-400">{p.email}</div>
//                       </td>
//                       <td className="px-6 py-4 font-mono text-sm text-slate-500">
//                         {p.account_number || "N/A"}
//                       </td>
//                       <td className="px-6 py-4 font-bold text-slate-900">
//                         ${Number(p.balance).toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => handleToggleStatus(p.id, p.status)}
//                           className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase border transition-all ${
//                             p.status === "active"
//                               ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                               : p.status === "locked"
//                                 ? "bg-rose-50 text-rose-600 border-rose-100"
//                                 : "bg-amber-50 text-amber-600 border-amber-100"
//                           }`}
//                         >
//                           {p.status === "active" ? (
//                             <Unlock size={12} />
//                           ) : (
//                             <Lock size={12} />
//                           )}
//                           {p.status}
//                         </button>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <div className="flex justify-end gap-2">
//                           <button
//                             onClick={() => setHistoryPanelProfile({ ...p })}
//                             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
//                           >
//                             <History size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleToggleStatus(p.id, p.status)}
//                             className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
//                           >
//                             <Edit2 size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(p.id, p.full_name)}
//                             className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       {historyPanelProfile && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           <div
//             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
//             onClick={() => !isSubmitting && setHistoryPanelProfile(null)}
//           />
//           <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div>
//                 <h2 className="text-lg font-bold">Transaction History</h2>
//                 <p className="text-sm text-slate-500">
//                   {historyPanelProfile.full_name}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setHistoryPanelProfile(null)}
//                 className="p-2 hover:bg-slate-100 rounded-full"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form
//               onSubmit={handleHistorySubmit}
//               className="p-6 space-y-6 flex-1 overflow-y-auto"
//             >
//               <div className="bg-slate-900 rounded-2xl p-5 text-white">
//                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
//                   Current Balance
//                 </p>
//                 <p className="text-3xl font-mono font-bold">
//                   ${Number(historyPanelProfile.balance).toLocaleString()}
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
//                     Amount
//                   </label>
//                   <input
//                     type="number"
//                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold outline-none focus:ring-2 focus:ring-blue-500"
//                     value={historyPanelProfile.history_amount || ""}
//                     onChange={(e) =>
//                       setHistoryPanelProfile({
//                         ...historyPanelProfile,
//                         history_amount: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
//                     Type
//                   </label>
//                   <select
//                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold outline-none"
//                     value={historyPanelProfile.history_status}
//                     onChange={(e) =>
//                       setHistoryPanelProfile({
//                         ...historyPanelProfile,
//                         history_status: e.target.value as any,
//                       })
//                     }
//                   >
//                     <option value="credit">Credit (+)</option>
//                     <option value="debit">Debit (-)</option>
//                   </select>
//                 </div>
//               </div>

//               {/* // Additional fields for history details */}

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
//                     From where :
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold outline-none focus:ring-2 focus:ring-blue-500"
//                     value={historyPanelProfile.history_from || ""}
//                     onChange={(e) =>
//                       setHistoryPanelProfile({
//                         ...historyPanelProfile,
//                         history_from: e.target.value,
//                       })
//                     }
//                     placeholder="from which bank "
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
//                     To where :
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold outline-none focus:ring-2 focus:ring-blue-500"
//                     value={historyPanelProfile.history_to || ""}
//                     onChange={(e) =>
//                       setHistoryPanelProfile({
//                         ...historyPanelProfile,
//                         history_to: e.target.value,
//                       })
//                     }
//                     placeholder="to which bank "
//                   />
//                 </div>
//               </div>

//               {/* date of the history record */}

//               <div>
//                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
//                   Date of Transaction:
//                 </label>
//                 <input
//                   type="datetime-local"
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold outline-none focus:ring-2 focus:ring-blue-500"
//                   value={historyPanelProfile.history_date || ""}
//                   onChange={(e) =>
//                     setHistoryPanelProfile({
//                       ...historyPanelProfile,
//                       history_date: e.target.value,
//                     })
//                   }
//                   placeholder="to which bank "
//                 />
//               </div>

//               <div>
//                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
//                   Transfer Origin Country
//                 </label>
//                 <div className="relative">
//                   <Globe
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     size={16}
//                   />
//                   <input
//                     className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none"
//                     value={historyPanelProfile.transfer_origin_country || ""}
//                     onChange={(e) =>
//                       setHistoryPanelProfile({
//                         ...historyPanelProfile,
//                         transfer_origin_country: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
//               >
//                 {isSubmitting ? (
//                   <Loader2 className="animate-spin" />
//                 ) : (
//                   <CheckCircle2 size={20} />
//                 )}
//                 Confirm & Update
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default dashboardComponent;

import React, { useEffect, useState } from "react";
import { supabase } from "../hooks/supabase";
import {
  Search,
  Trash2,
  History,
  Lock,
  Unlock,
  X,
  Globe,
  Loader2,
  CheckCircle2,
  User,
  CreditCard,
  Plus,
} from "lucide-react";

// Types
interface Profile {
  id: string;
  full_name: string;
  email: string;
  account_number: string;
  balance: number;
  status: "active" | "locked" | "pending" | "suspended";
  history_date: string;
  history_from: string;
  history_to: string;
  history_amount: number;
  transfer_origin_country: string;
  history_status: "credit" | "debit";
}

const DashboardComponent: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [historyPanelProfile, setHistoryPanelProfile] =
    useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name", { ascending: true });
      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "locked" : "active";
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      await fetchProfiles();
    } catch (err: any) {
      alert(`Update Failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete ${name}?`)) return;
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleHistorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!historyPanelProfile) return;
    setIsSubmitting(true);

    try {
      const amountChange = Number(historyPanelProfile.history_amount || 0);
      const updatedBalance =
        historyPanelProfile.history_status === "credit"
          ? Number(historyPanelProfile.balance) + amountChange
          : Number(historyPanelProfile.balance) - amountChange;

      const { error } = await supabase
        .from("profiles")
        .update({
          history_date: historyPanelProfile.history_date,
          history_from: historyPanelProfile.history_from,
          history_to: historyPanelProfile.history_to,
          history_amount: amountChange,
          history_status: historyPanelProfile.history_status,
          transfer_origin_country: historyPanelProfile.transfer_origin_country,
          balance: updatedBalance,
        })
        .eq("id", historyPanelProfile.id);

      if (error) throw error;
      setHistoryPanelProfile(null);
      await fetchProfiles();
    } catch (err: any) {
      alert("Update failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased rounded-2xl">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <CreditCard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">
                Admin Portal
              </h1>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                Financial Operations
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl text-sm transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Stats Summary (Optional Visual Flair) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">Total Clients</p>
            <p className="text-2xl font-bold text-slate-800">
              {profiles.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Active Accounts
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {profiles.filter((p) => p.status === "active").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-right flex justify-end items-center">
            <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-800 transition-colors">
              <Plus size={18} /> New Profile
            </button>
          </div>
        </div>

        {/* Table/List Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Client Details
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Account No.
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-6 py-8">
                          <div className="h-4 bg-slate-100 rounded w-full"></div>
                        </td>
                      </tr>
                    ))
                ) : filteredProfiles.length > 0 ? (
                  filteredProfiles.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-700">
                              {p.full_name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {p.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-500 italic">
                        {p.account_number || "---"}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${Number(p.balance).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            p.status === "active"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : p.status === "locked"
                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton
                            onClick={() => setHistoryPanelProfile({ ...p })}
                            icon={<History size={16} />}
                            label="History"
                            color="hover:text-blue-600 hover:bg-blue-50"
                          />
                          <ActionButton
                            onClick={() => handleToggleStatus(p.id, p.status)}
                            icon={
                              p.status === "active" ? (
                                <Lock size={16} />
                              ) : (
                                <Unlock size={16} />
                              )
                            }
                            label="Toggle"
                            color="hover:text-amber-600 hover:bg-amber-50"
                          />
                          <ActionButton
                            onClick={() => handleDelete(p.id, p.full_name)}
                            icon={<Trash2 size={16} />}
                            label="Delete"
                            color="hover:text-rose-600 hover:bg-rose-50"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-20 text-slate-400"
                    >
                      No matching clients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredProfiles.map((p) => (
              <div key={p.id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">
                        {p.full_name}
                      </div>
                      <div className="text-xs text-slate-400 italic">
                        {p.account_number}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                      p.status === "active"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Balance
                  </span>
                  <span className="font-bold text-slate-900">
                    ${Number(p.balance).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setHistoryPanelProfile({ ...p })}
                    className="flex-1 flex justify-center items-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold"
                  >
                    <History size={14} /> History
                  </button>
                  <button
                    onClick={() => handleToggleStatus(p.id, p.status)}
                    className="flex-1 flex justify-center items-center gap-2 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold"
                  >
                    {p.status === "active" ? (
                      <Lock size={14} />
                    ) : (
                      <Unlock size={14} />
                    )}{" "}
                    Status
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.full_name)}
                    className="p-2 bg-rose-50 text-rose-600 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Side Panel Overlay */}
      {historyPanelProfile && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isSubmitting && setHistoryPanelProfile(null)}
          />
          <div className="relative w-full max-w-lg bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <History size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 leading-none">
                    Record Transaction
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {historyPanelProfile.full_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryPanelProfile(null)}
                className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleHistorySubmit}
              className="p-6 space-y-6 flex-1 overflow-y-auto"
            >
              {/* Balance Card */}
              <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Current Account Balance
                  </p>
                  <p className="text-4xl font-mono font-bold">
                    ${Number(historyPanelProfile.balance).toLocaleString()}
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CreditCard size={80} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Transaction Amount">
                  <input
                    type="number"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={historyPanelProfile.history_amount || ""}
                    onChange={(e) =>
                      setHistoryPanelProfile({
                        ...historyPanelProfile,
                        history_amount: Number(e.target.value),
                      })
                    }
                  />
                </InputGroup>
                <InputGroup label="Transaction Type">
                  <select
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all"
                    value={historyPanelProfile.history_status}
                    onChange={(e) =>
                      setHistoryPanelProfile({
                        ...historyPanelProfile,
                        history_status: e.target.value as any,
                      })
                    }
                  >
                    <option value="credit">Credit (+)</option>
                    <option value="debit">Debit (-)</option>
                  </select>
                </InputGroup>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Source Bank">
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    value={historyPanelProfile.history_from || ""}
                    onChange={(e) =>
                      setHistoryPanelProfile({
                        ...historyPanelProfile,
                        history_from: e.target.value,
                      })
                    }
                    placeholder="e.g. JPMorgan Chase"
                  />
                </InputGroup>
                <InputGroup label="Destination Bank">
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                    value={historyPanelProfile.history_to || ""}
                    onChange={(e) =>
                      setHistoryPanelProfile({
                        ...historyPanelProfile,
                        history_to: e.target.value,
                      })
                    }
                    placeholder="e.g. Local Wallet"
                  />
                </InputGroup>
              </div>

              <InputGroup label="Transaction Timestamp">
                <input
                  type="datetime-local"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  value={historyPanelProfile.history_date || ""}
                  onChange={(e) =>
                    setHistoryPanelProfile({
                      ...historyPanelProfile,
                      history_date: e.target.value,
                    })
                  }
                />
              </InputGroup>

              <InputGroup label="Origin Country">
                <div className="relative">
                  <Globe
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={historyPanelProfile.transfer_origin_country || ""}
                    onChange={(e) =>
                      setHistoryPanelProfile({
                        ...historyPanelProfile,
                        transfer_origin_country: e.target.value,
                      })
                    }
                    placeholder="e.g. United States"
                  />
                </div>
              </InputGroup>

              <div className="pt-4 sticky bottom-0 bg-white">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                  Confirm & Update Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components to clean up JSX
const ActionButton = ({ onClick, icon, label, color }: any) => (
  <button
    onClick={onClick}
    title={label}
    className={`p-2 transition-all rounded-lg flex items-center gap-2 ${color} text-slate-400`}
  >
    {icon}
  </button>
);

const InputGroup = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
      {label}
    </label>
    {children}
  </div>
);

export default DashboardComponent;
