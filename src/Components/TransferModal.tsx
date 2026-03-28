"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ShieldCheck } from "lucide-react";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onSuccess: (amount: number, recipient: string) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const handleComplete = () => {
    onSuccess(Number(amount), recipient);
    setStep(3);
  };

  const resetAndClose = () => {
    setStep(1);
    setAmount("");
    setRecipient("");
    onClose();
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
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg h-full bg-white shadow-2xl p-10 flex flex-col"
          >
            <button
              onClick={resetAndClose}
              className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mt-12 flex-1">
              {step < 3 && (
                <>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">
                    Wire Transfer
                  </h2>
                  <p className="text-slate-400 text-sm font-medium mb-10 border-b pb-4">
                    External institutional routing
                  </p>
                </>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Recipient Name
                    </label>
                    <input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full border-2 border-slate-100 p-4 rounded-xl focus:border-blue-600 outline-none transition-all font-bold"
                      placeholder="Beneficiary Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Amount (USD)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-blue-100 p-6 rounded-2xl text-3xl font-black text-slate-900 outline-none"
                      placeholder="0.00"
                    />
                    {Number(amount) > currentBalance && (
                      <p className="text-red-500 text-[10px] font-black uppercase mt-2 italic">
                        Insufficient Liquidity
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    disabled={
                      !amount || !recipient || Number(amount) > currentBalance
                    }
                    className="w-full py-5 bg-slate-950 text-white font-black rounded-2xl mt-10 hover:bg-blue-600 disabled:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                  >
                    Verify Details
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 text-center">
                  <div className="p-8 bg-slate-50 rounded-4xl text-left space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-400 text-xs font-bold uppercase">
                        To
                      </span>
                      <span className="font-black text-slate-900">
                        {recipient}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs font-bold uppercase">
                        Amount
                      </span>
                      <span className="font-black text-blue-700">
                        USD {Number(amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleComplete}
                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                  >
                    <ShieldCheck size={18} /> Confirm & Authorize
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="text-slate-400 text-[10px] font-black uppercase tracking-widest"
                  >
                    Back to Edit
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl"
                  >
                    <Send size={40} />
                  </motion.div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase italic">
                    Success
                  </h3>
                  <p className="text-slate-500 font-medium">
                    Funds of USD {Number(amount).toLocaleString()} sent to{" "}
                    {recipient}.
                  </p>
                  <button
                    onClick={resetAndClose}
                    className="px-10 py-4 bg-slate-100 text-slate-900 font-black rounded-xl uppercase text-[10px] tracking-widest"
                  >
                    Close Portal
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
