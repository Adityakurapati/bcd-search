'use client';

import { useState, useCallback } from 'react';
import { searchVoterByPhone, VoterResult } from '@/lib/voterService';
import VoterSlipModal from './VoterSlipModal';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

export default function VoterSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VoterResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState<VoterResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await searchVoterByPhone(searchQuery.trim());
      setSearchResults(results);
    } catch (error) {
      console.error("[v0] Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleViewSlip = (voter: VoterResult) => {
    setSelectedVoter(voter);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVoter(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            BCD Electoral Roll
          </h1>
          <p className="text-lg text-blue-100">
            Verify your entry in the voter list
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Find Your Entry in the Electoral Roll
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Search by your contact number to view your voter information
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="+91 9810027994"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search Voter
                </>
              )}
            </Button>
          </form>

          {/* Filter Info */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
              <span className="text-xs font-semibold text-blue-700">📱 PHONE NUMBER</span>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mt-8">
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                <p className="text-gray-600">Searching voter records...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-white mb-4">
                  {searchResults.length} RESULT{searchResults.length !== 1 ? 'S' : ''} FOUND
                </div>
                {searchResults.map((voter) => (
                  <div
                    key={voter.id}
                    className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {voter.sr_no}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {voter.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {voter.voter_id}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleViewSlip(voter)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold whitespace-nowrap ml-4"
                    >
                      View Slip
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-600">
                  We couldn't find any voter with the phone number{' '}
                  <span className="font-semibold">{searchQuery}</span>
                </p>
                <p className="text-gray-500 text-sm mt-4">
                  Please check the phone number and try again
                </p>
              </div>
            )}
          </div>
        )}

        {/* Welcome Message */}
        {!hasSearched && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">🗳️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Voter Slip Search
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter your phone number to find your entry in the BCD Electoral Roll and view
              your complete voter information.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <VoterSlipModal
        voter={selectedVoter}
        onClose={handleCloseModal}
        isOpen={isModalOpen}
      />
    </div>
  );
}
