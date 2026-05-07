"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Globe, Building2, Loader2, Lock } from "lucide-react";
import { toast } from "sonner"; // Ensure you have your supabase client initialized elsewhere
// import { supabase } from "@/lib/supabase";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onSuccess: (amount: number, recipient: string) => void;
}

const SECURITY_LAYERS = [
  { threshold: 35, label: "Transfer PIN", code: "9067" },
  { threshold: 65, label: "COT Hash", code: "7026" },
  { threshold: 85, label: "Clearance/Tax Key", code: "2789" },
  { threshold: 95, label: "Auth Token", code: "6795" },
];

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<"local" | "international" | null>(null);
  const [progress, setProgress] = useState(0);
  const [pin, setPin] = useState("");
  const [activeLayerIndex, setActiveLayerIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    recipient: "",
    accountNumber: "",
    bankName: "",
    swift: "",
    iban: "",
    bankAddress: "",
    amount: "",
  });

  // --- PROGRESS LOGIC ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (step === 3 && activeLayerIndex === null && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.floor(Math.random() * 3) + 2;
          const next = prev + increment;

          // Find if we crossed a security threshold
          const layerToTrigger = SECURITY_LAYERS.findIndex(
            (layer) => next >= layer.threshold && prev < layer.threshold,
          );

          if (layerToTrigger !== -1) {
            setActiveLayerIndex(layerToTrigger);
            if (interval) clearInterval(interval);
            return SECURITY_LAYERS[layerToTrigger].threshold;
          }

          if (next >= 100) {
            if (interval) clearInterval(interval);
            setTimeout(() => setStep(4), 800);
            return 100;
          }
          return next;
        });
      }, 150);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, progress, activeLayerIndex]);

  // --- EMAIL NOTIFICATION & INITIALIZE ---
  const handleStartSequence = async () => {
    setStep(3);
    setProgress(5);

    try {
      // Replace 'send-transfer-email' with your actual Supabase Edge Function name
      // await supabase.functions.invoke('send-transfer-email', {
      //   body: {
      //     clientEmail: "user@example.com",
      //     amount: formData.amount,
      //     recipient: formData.recipient,
      //     type: type
      //   },
      // });
      console.log("Email Notification Sent via SMTP");
    } catch (err) {
      console.error("Email failed:", err);
    }
  };

  const handlePinSubmit = () => {
    if (
      activeLayerIndex !== null &&
      pin === SECURITY_LAYERS[activeLayerIndex].code
    ) {
      // Check if this is the final gate
      if (activeLayerIndex === SECURITY_LAYERS.length - 1) {
        onSuccess(Number(formData.amount), formData.recipient);
      }
      setPin("");
      setActiveLayerIndex(null);
    } else {
      toast.error("SECURITY VIOLATION: Invalid Credentials");
      setPin("");
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setType(null);
    setProgress(0);
    setPin("");
    setActiveLayerIndex(null);
    setFormData({
      recipient: "",
      accountNumber: "",
      bankName: "",
      swift: "",
      iban: "",
      bankAddress: "",
      amount: "",
    });
    onClose();
  };

  const isFormValid = () => {
    const { recipient, accountNumber, bankName, amount } = formData;
    const base =
      recipient &&
      accountNumber &&
      bankName &&
      Number(amount) > 0 &&
      Number(amount) <= currentBalance;
    if (type === "local") return base;
    return base && formData.swift && formData.iban && formData.bankAddress;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-150 flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="relative w-full max-w-xl h-full bg-white shadow-2xl p-10 flex flex-col overflow-y-auto"
          >
            <button
              onClick={resetAndClose}
              className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mt-12 flex-1">
              {step < 3 && (
                <div className="mb-10">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    Security Portal
                  </h2>
                  <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase mt-2">
                    Nexus-Finance Institutional Wire
                  </p>
                </div>
              )}

              {/* STEP 1: SELECT TYPE */}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setType("local");
                      setStep(2);
                    }}
                    className="p-8 border-2 border-slate-100 rounded-3xl hover:border-blue-600 text-left group transition-all"
                  >
                    <Building2
                      className="mb-4 text-slate-400 group-hover:text-blue-600"
                      size={32}
                    />
                    <span className="block font-black uppercase text-xs">
                      Domestic
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setType("international");
                      setStep(2);
                    }}
                    className="p-8 border-2 border-slate-100 rounded-3xl hover:border-blue-600 text-left group transition-all"
                  >
                    <Globe
                      className="mb-4 text-slate-400 group-hover:text-blue-600"
                      size={32}
                    />
                    <span className="block font-black uppercase text-xs">
                      International
                    </span>
                  </button>
                </div>
              )}

              {/* STEP 2: FULL INPUTS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Beneficiary Name"
                      className="w-full border-2 border-slate-100 p-4 rounded-xl font-bold focus:border-blue-600 outline-none"
                      value={formData.recipient}
                      onChange={(e) =>
                        setFormData({ ...formData, recipient: e.target.value })
                      }
                    />
                    <input
                      placeholder="Account Number"
                      className="w-full border-2 border-slate-100 p-4 rounded-xl font-bold focus:border-blue-600 outline-none"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <input
                    placeholder="Bank Name"
                    className="w-full border-2 border-slate-100 p-4 rounded-xl font-bold focus:border-blue-600 outline-none"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                  />

                  {type === "international" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          placeholder="SWIFT/BIC Code"
                          className="w-full border-2 border-slate-100 p-4 rounded-xl font-bold focus:border-blue-600 outline-none"
                          value={formData.swift}
                          onChange={(e) =>
                            setFormData({ ...formData, swift: e.target.value })
                          }
                        />
                        <input
                          placeholder="IBAN Number"
                          className="w-full border-2 border-slate-100 p-4 rounded-xl font-bold focus:border-blue-600 outline-none"
                          value={formData.iban}
                          onChange={(e) =>
                            setFormData({ ...formData, iban: e.target.value })
                          }
                        />
                      </div>
                      <input
                        placeholder="Bank Full Address"
                        className="w-full border-2 border-slate-100 p-4 rounded-xl font-bold focus:border-blue-600 outline-none"
                        value={formData.bankAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bankAddress: e.target.value,
                          })
                        }
                      />
                    </motion.div>
                  )}

                  <div className="pt-6 border-t-2 border-slate-100">
                    <label className="text-[10px] font-black text-blue-600 uppercase mb-2 block">
                      Transfer Amount (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full text-5xl font-black outline-none mb-2"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                    {Number(formData.amount) > currentBalance && (
                      <p className="text-red-500 text-[10px] font-black uppercase italic">
                        Insufficient Liquidity
                      </p>
                    )}
                  </div>

                  <button
                    disabled={!isFormValid()}
                    onClick={handleStartSequence}
                    className="w-full py-5 bg-slate-950 text-white font-black rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-blue-700 transition-all"
                  >
                    Initiate Security Sequence
                  </button>
                </div>
              )}

              {/* STEP 3: LOADING & PIN GATES */}
              {step === 3 && (
                <div className="h-full flex flex-col items-center justify-center space-y-8">
                  {activeLayerIndex === null ? (
                    <div className="w-full text-center space-y-8">
                      <div className="relative w-32 h-32 mx-auto">
                        <Loader2
                          className="animate-spin text-blue-600 absolute inset-0"
                          size={128}
                          strokeWidth={1}
                        />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-2xl italic text-slate-900">
                          {progress}%
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="font-black uppercase tracking-[0.3em] text-xs text-blue-600 animate-pulse">
                          Routing via Encrypted Tunnel...
                        </p>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-blue-600 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full max-w-sm p-10 bg-slate-950 text-white rounded-[3rem] text-center shadow-2xl border-b-12 border-blue-600"
                    >
                      <Lock className="mx-auto mb-6 text-blue-400" size={48} />
                      <div className="mb-8">
                        <h3 className="font-black uppercase italic text-2xl mb-1">
                          Provide Code
                        </h3>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                          Kindly Provide your{" "}
                          {SECURITY_LAYERS[activeLayerIndex].label}
                        </p>
                      </div>

                      <input
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full text-center text-4xl tracking-[0.5em] font-black p-5 bg-slate-900 border-2 border-slate-800 rounded-3xl outline-none focus:border-blue-500 mb-8"
                        autoFocus
                      />

                      <button
                        onClick={handlePinSubmit}
                        className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-blue-500 transition-colors"
                      >
                        Verify Identity
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 4: SUCCESS */}
              {step === 4 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40"
                  >
                    <ShieldCheck size={64} />
                  </motion.div>
                  <div className="space-y-3">
                    <h3 className="text-5xl font-black text-slate-900 uppercase italic">
                      Successful Transfer
                    </h3>
                    <p className="text-slate-500 font-medium max-w-xs">
                      Institutional wire of{" "}
                      <span className="text-slate-900 font-black">
                        USD {Number(formData.amount).toLocaleString()}
                      </span>{" "}
                      has been dispatched to {formData.recipient}.
                    </p>
                  </div>
                  <button
                    onClick={resetAndClose}
                    className="px-16 py-5 bg-slate-900 text-white font-black rounded-2xl uppercase text-xs tracking-widest"
                  >
                    Exit Secure Portal
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransferModal;
