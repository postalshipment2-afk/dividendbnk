import { useState } from "react";
import DashboardComponent from "../Components/dashboardcomponent";
import TransferPinsView from "../Components/pincode";
// Import icons for the sidebar
import { LayoutDashboard, Send, LogOut, Menu, X } from "lucide-react";

export const AdminDashboard = () => {
  // 1. Dynamic State for Navigation
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. Navigation Configuration
  const navItems = [
    {
      id: "dashboard",
      label: "Overview",
      icon: <LayoutDashboard size={20} />,
      component: <DashboardComponent />,
    },
    {
      id: "transfer",
      label: "Transfers Pins",
      icon: <Send size={20} />,
      component: (
        <TransferPinsView
          isOpen={false}
          onClose={() => {
            console.log("Closed");
          }}
          currentBalance={0}
          onSuccess={(amount: number, recipient: string) => {
            console.log(amount, recipient);
          }}
        />
      ),
    },
  ];

  // 3. Helper to render the selected component
  const renderContent = () => {
    const activeItem = navItems.find((item) => item.id === activeTab);
    return activeItem ? activeItem.component : <DashboardComponent />;
  };

  return (
    <div className="flex min-h-screen bg-slate-900 relative text-amber-500">
      {/* Mobile Overlay - Closes sidebar when clicking outside on small screens */}
      {!isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed h-full z-40 bg-slate-800 border-r border-slate-200 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? "-left-64 w-64 lg:left-0 lg:w-64" : "left-0 w-64 lg:w-20"}
        `}
      >
        <div className="p-6 flex items-center justify-between">
          {(isSidebarOpen || !isSidebarOpen) && (
            <span
              className={`font-bold text-xl text-blue-600 ${!isSidebarOpen && "lg:hidden"}`}
            >
              AdminPanel
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            {/* Logic: On mobile, X closes. On Desktop, Menu/X toggles width */}
            <span className="lg:block hidden">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </span>
            <span className="lg:hidden block">
              <X size={20} />
            </span>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                // Auto-close sidebar on mobile after selection
                if (window.innerWidth < 1024) setIsSidebarOpen(true);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {item.icon}
              <span
                className={`font-medium ${!isSidebarOpen ? "lg:hidden" : "block"}`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
            <LogOut size={20} />
            <span
              className={`font-medium ${!isSidebarOpen ? "lg:hidden" : "block"}`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 p-4 md:p-8 
          ${isSidebarOpen ? "ml-0 lg:ml-64" : "ml-0 lg:ml-20"}
        `}
      >
        <header className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle - Only visible when sidebar is hidden on small screens */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 bg-white border border-slate-200 rounded-lg"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 capitalize">
                {activeTab}
              </h1>
              <p className="text-slate-500 text-xs md:text-sm hidden sm:block">
                Welcome back, Administrator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Component Rendering */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
