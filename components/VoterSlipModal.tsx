'use client';

import { useState } from 'react';
import { VoterResult } from '@/lib/voterService';
import {
  shareViaWhatsApp,
  shareViaContact,
  copyToClipboard,
  downloadVoterSlip,
  printVoterSlip,
} from '@/lib/shareUtils';
import { Button } from '@/components/ui/button';
import {
  X,
  MessageCircle,
  Phone,
  Copy,
  Download,
  Printer,
} from 'lucide-react';

interface VoterSlipModalProps {
  voter: VoterResult | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function VoterSlipModal({
  voter,
  onClose,
  isOpen,
}: VoterSlipModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen || !voter) return null;

  /* ================= CUSTOM WHATSAPP CONTENT ================= */
  const buildWhatsAppMessage = () => {
    return `🗳️ *BCD Election 2026 - Voting Slip*

👤 *Name:* ${voter.name}
🔢 *Serial No:* ${voter.sr_no}
🆔 *Voter ID:* ${voter.voter_id}
📱 *Mobile:* ${voter.mobile}
📍 *Address:* ${voter.address}

━━━━━━━━━━━━━━━━━━

🙏 Kindly cast your valuable vote in favour of:

⭐ *VAIBHAV JAIN*
📌 Ballot No: *136*
(Member - Bar Council of Delhi)

🗓️ Election Dates: 21 - 22 - 23 Feb 2026

Your support is highly appreciated.

Thank you.`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleCopy = async () => {
    const success = await navigator.clipboard.writeText(buildWhatsAppMessage());
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handlePrint = () => {
    printVoterSlip(voter);
  };

  const handleDownload = () => {
    downloadVoterSlip(voter);
  };

  const handleShareContact = () => {
    shareViaContact(voter);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white px-6 py-5 flex justify-between items-start">
          <div>
            <div className="text-sm text-yellow-400 font-semibold">
              BCD Election 2026
            </div>
            <h2 className="text-2xl font-bold">{voter.name}</h2>
            <div className="text-sm text-blue-200">
              Serial No: {voter.sr_no}
            </div>
          </div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-6 space-y-6">

          {/* Voter Details Card */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Voter Details
            </h3>

            <div className="space-y-3 text-gray-800">
              <p><span className="font-semibold">Voter ID:</span> {voter.voter_id}</p>
              <p><span className="font-semibold">Mobile:</span> {voter.mobile}</p>
              <p><span className="font-semibold">Address:</span> {voter.address}</p>
            </div>
          </div>

          {/* Candidate Appeal Card */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 rounded-xl p-5 shadow-md">
            <h3 className="text-xl font-bold mb-2">
              ⭐ Support Our Candidate
            </h3>

            <div className="text-lg font-semibold">
              VAIBHAV JAIN
            </div>
            <div className="text-sm mb-2">
              Contesting for Member – Bar Council of Delhi
            </div>

            <div className="text-3xl font-bold">
              Ballot No. 136
            </div>

            <p className="mt-3 text-sm">
              Kindly cast your valuable vote as your First / Best Preference.
            </p>

            <p className="mt-2 text-sm font-semibold">
              Election Dates: 21 - 22 - 23 Feb 2026
            </p>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="grid grid-cols-2 gap-4">

            <Button
              onClick={handleWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Share WhatsApp
            </Button>

            <Button
              onClick={handleShareContact}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Share Contact
            </Button>

            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copySuccess ? 'Copied!' : 'Copy Slip'}
            </Button>

            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>

          <Button
            onClick={handlePrint}
            className="w-full bg-gray-800 hover:bg-black text-white flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Voting Slip
          </Button>
        </div>
      </div>
    </div>
  );
}
