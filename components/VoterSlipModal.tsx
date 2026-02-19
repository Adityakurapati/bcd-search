'use client';

import { useState } from 'react';
import Image from 'next/image';
import { VoterResult } from '@/lib/voterService';
import {
  shareViaContact,
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


  /* ================= WHATSAPP MESSAGE ================= */

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

Thank you.`;

  };


  /* ================= ACTIONS ================= */

  const handleWhatsApp = () => {

    const message = encodeURIComponent(buildWhatsAppMessage());

    window.open(`https://wa.me/?text=${message}`, '_blank');

  };


  const handleCopy = async () => {

    await navigator.clipboard.writeText(buildWhatsAppMessage());

    setCopySuccess(true);

    setTimeout(() => setCopySuccess(false), 2000);

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


  /* ================= UI ================= */

  return (

    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">


      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">


        {/* ================= HEADER ================= */}

        <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white px-6 py-5">


          <div className="flex justify-between items-start">


            {/* LEFT SIDE */}

            <div className="flex gap-4 items-center">


              {/* IMAGE */}

              <div className="relative w-20 h-28 rounded-lg overflow-hidden border-2 border-yellow-400 shadow-lg">

                <Image
                  src="/vibhav_jain.jpeg"
                  alt="Vaibhav Jain"
                  fill
                  className="object-cover"
                />

              </div>


              {/* TEXT */}

              <div>

                <div className="text-sm text-yellow-400 font-semibold">
                  BCD Election 2026
                </div>

                <h2 className="text-xl font-bold">
                  {voter.name}
                </h2>

                <div className="text-sm text-blue-200">
                  Serial No: {voter.sr_no}
                </div>

              </div>

            </div>


            {/* CLOSE BUTTON */}

            <button onClick={onClose}>
              <X className="w-6 h-6 text-white" />
            </button>


          </div>


        </div>


        {/* ================= CONTENT ================= */}

        <div className="p-6 space-y-6">


          {/* VOTER DETAILS */}

          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">


            <h3 className="text-lg font-bold mb-4">
              Voter Details
            </h3>


            <div className="space-y-2">


              <p>
                <span className="font-semibold">Voter ID:</span>
                {" "}
                {voter.voter_id}
              </p>


              <p>
                <span className="font-semibold">Mobile:</span>
                {" "}
                {voter.mobile}
              </p>


              <p>
                <span className="font-semibold">Address:</span>
                {" "}
                {voter.address}
              </p>


            </div>


          </div>


          {/* CANDIDATE CARD */}


          <div className="bg-yellow-400 text-slate-900 rounded-xl p-5 shadow-md">


            <h3 className="text-xl font-bold">
              ⭐ Support Our Candidate
            </h3>


            <div className="text-lg font-bold mt-2">
              VAIBHAV JAIN
            </div>


            <div className="text-sm">
              Contesting for Member
            </div>


            <div className="text-3xl font-bold mt-2">
              Ballot No. 136
            </div>


            <p className="mt-2 text-sm">
              Kindly cast your valuable vote.
            </p>


          </div>


          {/* BUTTON GRID */}


          <div className="grid grid-cols-2 gap-4">


            <Button
              onClick={handleWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white"
            >

              <MessageCircle className="w-4 h-4 mr-2" />

              WhatsApp

            </Button>


            <Button
              onClick={handleShareContact}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >

              <Phone className="w-4 h-4 mr-2" />

              Contact

            </Button>


            <Button
              onClick={handleCopy}
              variant="outline"
            >

              <Copy className="w-4 h-4 mr-2" />

              {copySuccess ? "Copied!" : "Copy"}

            </Button>


            <Button
              onClick={handleDownload}
              variant="outline"
            >

              <Download className="w-4 h-4 mr-2" />

              Download

            </Button>


          </div>


          <Button
            onClick={handlePrint}
            className="w-full bg-gray-900 hover:bg-black text-white"
          >

            <Printer className="w-4 h-4 mr-2" />

            Print Slip

          </Button>


        </div>


      </div>


    </div>

  );

}
