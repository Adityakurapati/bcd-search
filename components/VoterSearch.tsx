'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { searchVoterByPhone, searchVoterByName, VoterResult } from '@/lib/voterService';
import VoterSlipModal from './VoterSlipModal';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Phone, User } from 'lucide-react';

type SearchType = 'phone' | 'name';

export default function VoterSearch() {
  const [searchType, setSearchType] = useState<SearchType>('phone');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VoterResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState<VoterResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      let results: VoterResult[] = [];

      if (searchType === 'phone') {
        results = await searchVoterByPhone(searchQuery.trim());
      } else {
        results = await searchVoterByName(searchQuery.trim());
      }

      setSearchResults(results);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchType]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">

      {/* ================= HERO CANDIDATE SECTION ================= */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white py-12 px-4 border-b-4 border-yellow-500">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          {/* Candidate Image */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-64 h-72 rounded-xl overflow-hidden border-4 border-yellow-500 shadow-2xl">
              <Image
                src="/vibhav_jain.jpeg"
                alt="Vaibhav Jain Advocate"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Candidate Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400">
              VAIBHAV JAIN
            </h1>

            <p className="text-xl mt-2 text-blue-100">
              Advocate | Contesting for Member
            </p>

            <div className="mt-6 bg-yellow-500 text-slate-900 px-6 py-4 rounded-xl shadow-lg inline-block">
              <p className="text-sm font-semibold tracking-wider">
                BALLOT NUMBER
              </p>
              <p className="text-4xl font-bold">136</p>
            </div>

            <div className="mt-6 space-y-2 text-blue-100">
              <p>🗳️ Election Dates: <span className="font-semibold text-white">21 - 22 - 23 Feb 2026</span></p>
              <p>📍 Bar Council of Delhi Election</p>
              <p>📞 Contact: <span className="font-semibold text-white">+91 9999647017</span></p>
            </div>

            <div className="mt-6 bg-slate-800 p-5 rounded-lg border border-yellow-400">
              <p className="text-blue-100 leading-relaxed">
                Dear Members of the Bar Council of Delhi,
                <br /><br />
                I humbly request your valuable support in the upcoming BCD Election.
                Kindly cast your vote in favour of <span className="text-yellow-400 font-semibold">Vaibhav Jain (Ballot No. 136)</span>
                as your <span className="font-semibold">First / Best Preference</span>.
                <br /><br />
                Together, let us build a stronger and more progressive Bar Council.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SEARCH SECTION ================= */}
      <div className="max-w-4xl mx-auto px-4 py-16">

        <div className="bg-white rounded-2xl shadow-2xl p-10">

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Find Your Entry in the Electoral Roll
          </h2>

          <p className="text-center text-gray-600 mb-8">
            Verify your details in the BCD Final Voter List 2026
          </p>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border bg-gray-100 p-1">
              <button
                onClick={() => setSearchType('phone')}
                className={`px-6 py-2 rounded-lg text-sm font-medium ${
                  searchType === 'phone'
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-600'
                }`}
              >
                <Phone className="inline w-4 h-4 mr-2" />
                Search by Phone
              </button>

              <button
                onClick={() => setSearchType('name')}
                className={`px-6 py-2 rounded-lg text-sm font-medium ${
                  searchType === 'name'
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-600'
                }`}
              >
                <User className="inline w-4 h-4 mr-2" />
                Search by Name
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch}>
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === 'phone'
                    ? 'Enter phone number'
                    : 'Enter full name'
                }
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:outline-none text-lg"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-xl text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Voter
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && searchResults.length > 0 && (
          <div className="mt-10 space-y-6">
            {searchResults.map((voter) => (
              <div
                key={voter.id}
                className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {voter.name}
                  </h3>
                  <p className="text-gray-600">
                    Voter ID: {voter.voter_id}
                  </p>
                  <p className="text-gray-600">
                    Mobile: {voter.mobile}
                  </p>
                </div>

                <Button
                  onClick={() => {
                    setSelectedVoter(voter);
                    setIsModalOpen(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg"
                >
                  Download Slip
                </Button>
              </div>
            ))}
          </div>
        )}

      </div>

      <VoterSlipModal
        voter={selectedVoter}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
