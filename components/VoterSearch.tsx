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
        // Auto-open modal when phone search returns exactly 1 result
        if (results.length === 1) {
          setSelectedVoter(results[0]);
          setSearchResults(results);
          setIsModalOpen(true);
          return;
        }
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex flex-col">

      {/* ===== HERO SECTION ===== */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white py-3 px-4 border-b-4 border-yellow-500">
        <div className="max-w-5xl mx-auto">

          {/* Always flex-row: photo left, info right */}
          <div className="flex flex-row gap-3 items-center pt-4">

            {/* Photo */}
            <div className="flex-shrink-0-">
              <div className="relative w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 rounded-lg overflow-hidden border-2 border-yellow-500 shadow-xl">
                <Image
                  src="/vibhav_jain.jpeg"
                  alt="Vaibhav Jain Advocate"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

              {/* Name + details */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-yellow-400 leading-tight">VAIBHAV JAIN</h1>
                <p className="text-xs sm:text-sm text-blue-100">Advocate | Contesting for Member</p>
                <p className="text-xs text-blue-200 mt-0.5">🗳️ 21–23 Feb 2026 · Bar Council of Delhi</p>
                <p className="text-xs text-blue-200">📞 +91 9650843200</p>
              </div>




            </div>
            <div className='flex flex-col items-center'>
              {/* Ballot badge */}
            <div className="bg-yellow-500 text-slate-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-md text-center flex-shrink-0 self-start sm:self-center">
              <p className="text-xs font-semibold tracking-wider uppercase leading-none">Ballot No.</p>
              <p className="text-2xl sm:text-3xl font-bold leading-tight">136</p>
            </div>
            </div>


          </div>
          {/* Appeal text — md+ only */}
          <div className="flex-1 mt-4 bg-slate-800 px-3 py-2 rounded-lg border border-yellow-400 text-xs text-blue-100 leading-relaxed  md:block">
            Dear Members of the Bar Council of Delhi, I humbly request your valuable support.
            Kindly cast your vote for{' '}
            <span className="text-yellow-400 font-semibold">Vaibhav Jain (Ballot No. 136)</span>{' '}
            as your <span className="font-semibold">First / Best Preference</span>.
            Together, let us build a stronger Bar Council.
          </div>
        </div>
      </div>

      {/* ===== SEARCH SECTION ===== */}
      <div className="flex-1 flex items-start justify-center px-4 py-5">
        <div className="w-full max-w-lg">

          {/* Form card — dark blue themed */}
          <div className="bg-blue-950 border border-blue-800 rounded-xl shadow-2xl p-5">

            <h2 className="text-lg font-bold text-center text-yellow-400 mb-0.5">
              Find Your Entry in the Electoral Roll
            </h2>
            <p className="text-center text-blue-300 text-xs mb-4">
              Verify your details in the BCD Final Voter List 2026
            </p>

            {/* Tabs */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex rounded-lg border border-blue-700 bg-blue-900/60 p-1">
                <button
                  onClick={() => { setSearchType('phone'); setHasSearched(false); setSearchResults([]); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${searchType === 'phone'
                      ? 'bg-yellow-500 text-slate-900'
                      : 'text-blue-200 hover:text-white'
                    }`}
                >
                  <Phone className="inline w-3.5 h-3.5 mr-1.5" />
                  Phone
                </button>
                <button
                  onClick={() => { setSearchType('name'); setHasSearched(false); setSearchResults([]); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${searchType === 'name'
                      ? 'bg-yellow-500 text-slate-900'
                      : 'text-blue-200 hover:text-white'
                    }`}
                >
                  <User className="inline w-3.5 h-3.5 mr-1.5" />
                  Name
                </button>
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === 'phone' ? 'Enter phone number' : 'Enter full name'
                }
                className="w-full px-4 py-3 bg-slate-800 border-2 border-blue-700 text-white placeholder-blue-400 rounded-lg focus:border-yellow-500 focus:outline-none text-sm"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 py-3 rounded-lg text-sm font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Voter
                  </>
                )}
              </Button>
            </form>

            {/* No results */}
            {hasSearched && searchResults.length === 0 && !isLoading && (
              <p className="text-center text-blue-300 text-sm mt-4">
                No voter found. Please check your details and try again.
              </p>
            )}
          </div>

          {/* Results list — for name search or multiple phone matches */}
          {hasSearched && (searchResults.length > 1 || (searchType === 'name' && searchResults.length === 1)) && (
            <div className="mt-4 space-y-3">
              {searchResults.map((voter) => (
                <div
                  key={voter.id}
                  className="bg-blue-950 border border-blue-800 rounded-lg shadow-md p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white">{voter.name}</h3>
                    <p className="text-xs text-blue-300">Voter ID: {voter.voter_id}</p>
                    <p className="text-xs text-blue-300">Mobile: {voter.mobile}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedVoter(voter);
                      setIsModalOpen(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold px-4 py-1.5 text-xs rounded-lg"
                  >
                    Download Slip
                  </Button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <VoterSlipModal
        voter={selectedVoter}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}