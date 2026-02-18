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
import { X, MessageCircle, Phone, Copy, Download, Printer } from 'lucide-react';

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

  const handleCopy = async () => {
    const success = await copyToClipboard(voter);
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

  const handleShareWhatsApp = () => {
    shareViaWhatsApp(voter);
  };

  const handleShareContact = () => {
    shareViaContact(voter);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Serial #{voter.sr_no}</div>
            <h2 className="text-2xl font-bold text-gray-900">{voter.name}</h2>
            <div className="text-sm text-gray-600 mt-1">{voter.voter_id}</div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Voting Slip Tab Content */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-3 mb-4">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact Number
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {voter.mobile}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Address
                  </div>
                  <div className="text-base text-gray-900 mt-1">{voter.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Voter ID
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {voter.voter_id}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShareWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Share WhatsApp
              </Button>
              <Button
                onClick={handleShareContact}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Share Contact
              </Button>
              <Button
                onClick={handleCopy}
                variant={copySuccess ? 'default' : 'outline'}
                className="w-full flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copySuccess ? 'Copied!' : 'Copy Details'}
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>

            {/* Print Button */}
            <Button
              onClick={handlePrint}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Voter Slip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
