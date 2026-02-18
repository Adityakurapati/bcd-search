// lib/voterService.ts
import { ref, get } from 'firebase/database';
import { database } from './firebase';

export interface VoterResult {
  id: string;
  sr_no: string;
  name: string;
  voter_id: string;
  mobile: string;
  address: string;
}

// Search by phone number (using BCD node directly)
export async function searchVoterByPhone(phone: string): Promise<VoterResult[]> {
  try {
    // Clean the search phone (remove non-digits)
    const searchPhone = phone.replace(/\D/g, '');
    
    // Direct access by phone number key
    const voterRef = ref(database, `BCD/${searchPhone}`);
    const snapshot = await get(voterRef);
    
    if (snapshot.exists()) {
      const value = snapshot.val();
      return [{
        id: searchPhone,
        sr_no: value.sr_no?.toString() || '',
        name: value.name || '',
        voter_id: value.voter_id || '',
        mobile: value.mobile || '',
        address: value.address || ''
      }];
    }
    
    // If exact match not found, try partial search (less efficient but thorough)
    const bcdRef = ref(database, 'BCD');
    const allSnapshot = await get(bcdRef);
    
    if (allSnapshot.exists()) {
      const data = allSnapshot.val();
      const results: VoterResult[] = [];
      
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        const voterPhone = value.mobile?.replace(/\D/g, '') || '';
        
        if (voterPhone.includes(searchPhone) || searchPhone.includes(voterPhone)) {
          results.push({
            id: key,
            sr_no: value.sr_no?.toString() || '',
            name: value.name || '',
            voter_id: value.voter_id || '',
            mobile: value.mobile || '',
            address: value.address || ''
          });
        }
      });
      
      return results;
    }
    
    return [];
  } catch (error) {
    console.error('Error searching by phone:', error);
    throw error;
  }
}

// Search by name using BCD_INDEX (case insensitive, partial match)
// Names in BCD_INDEX are already stored in lowercase
export async function searchVoterByName(name: string): Promise<VoterResult[]> {
  try {
    // Convert search term to lowercase to match index format
    const searchTerm = name.toLowerCase().trim();
    
    // Get the name index
    const indexRef = ref(database, 'BCD_INDEX');
    const indexSnapshot = await get(indexRef);
    
    if (!indexSnapshot.exists()) {
      return [];
    }
    
    const indexData = indexSnapshot.val();
    const results: VoterResult[] = [];
    
    // Search through the index for matching names
    // Since index names are already lowercase, we can directly compare
    const matchingNames = Object.keys(indexData).filter(indexName => 
      indexName.includes(searchTerm)
    );
    
    // Fetch voter details for each matching name
    for (const matchingName of matchingNames) {
      const phoneNumbers = Object.keys(indexData[matchingName]);
      
      for (const phone of phoneNumbers) {
        const voterRef = ref(database, `BCD/${phone}`);
        const voterSnapshot = await get(voterRef);
        
        if (voterSnapshot.exists()) {
          const value = voterSnapshot.val();
          results.push({
            id: phone,
            sr_no: value.sr_no?.toString() || '',
            name: value.name || '', // Original name with proper case from BCD
            voter_id: value.voter_id || '',
            mobile: value.mobile || '',
            address: value.address || ''
          });
        }
      }
    }
    
    // Sort results alphabetically by name
    return results.sort((a, b) => a.name.localeCompare(b.name));
    
  } catch (error) {
    console.error('Error searching by name:', error);
    throw error;
  }
}

// Enhanced search function that combines both methods
export async function searchVoters(searchTerm: string): Promise<VoterResult[]> {
  try {
    // Trim the search term
    const trimmedTerm = searchTerm.trim();
    
    // If empty, return empty array
    if (!trimmedTerm) {
      return [];
    }
    
    // Check if search term looks like a phone number (contains digits)
    const hasDigits = /\d/.test(trimmedTerm);
    
    if (hasDigits) {
      // If it contains digits, prioritize phone search
      const phoneResults = await searchVoterByPhone(trimmedTerm);
      
      // If phone search yields results, return them
      if (phoneResults.length > 0) {
        return phoneResults;
      }
    }
    
    // Fallback to name search
    return await searchVoterByName(trimmedTerm);
    
  } catch (error) {
    console.error('Error searching voters:', error);
    throw error;
  }
}

// Get voter by exact phone number (most efficient)
export async function getVoterByPhone(phone: string): Promise<VoterResult | null> {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    const voterRef = ref(database, `BCD/${cleanPhone}`);
    const snapshot = await get(voterRef);
    
    if (snapshot.exists()) {
      const value = snapshot.val();
      return {
        id: cleanPhone,
        sr_no: value.sr_no?.toString() || '',
        name: value.name || '',
        voter_id: value.voter_id || '',
        mobile: value.mobile || '',
        address: value.address || ''
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting voter by phone:', error);
    throw error;
  }
}

// Get all voters with pagination (optional)
export async function getAllVoters(limit?: number, startAfter?: string): Promise<VoterResult[]> {
  try {
    const bcdRef = ref(database, 'BCD');
    const snapshot = await get(bcdRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const results: VoterResult[] = [];
      
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        results.push({
          id: key,
          sr_no: value.sr_no?.toString() || '',
          name: value.name || '',
          voter_id: value.voter_id || '',
          mobile: value.mobile || '',
          address: value.address || ''
        });
      });
      
      // Sort by name
      const sorted = results.sort((a, b) => a.name.localeCompare(b.name));
      
      // Apply pagination if limit is specified
      if (limit) {
        const startIndex = startAfter ? sorted.findIndex(v => v.id === startAfter) + 1 : 0;
        return sorted.slice(startIndex, startIndex + limit);
      }
      
      return sorted;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting all voters:', error);
    throw error;
  }
}

// Optional: Add a function to get voter by name from index (exact match)
export async function getVoterByExactName(name: string): Promise<VoterResult[]> {
  try {
    const searchName = name.toLowerCase().trim();
    const indexRef = ref(database, `BCD_INDEX/${searchName}`);
    const indexSnapshot = await get(indexRef);
    
    if (!indexSnapshot.exists()) {
      return [];
    }
    
    const phoneNumbers = Object.keys(indexSnapshot.val());
    const results: VoterResult[] = [];
    
    for (const phone of phoneNumbers) {
      const voterRef = ref(database, `BCD/${phone}`);
      const voterSnapshot = await get(voterRef);
      
      if (voterSnapshot.exists()) {
        const value = voterSnapshot.val();
        results.push({
          id: phone,
          sr_no: value.sr_no?.toString() || '',
          name: value.name || '',
          voter_id: value.voter_id || '',
          mobile: value.mobile || '',
          address: value.address || ''
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error getting voter by exact name:', error);
    throw error;
  }
}