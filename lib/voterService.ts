import { database } from './firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';

export interface VoterData {
  sr_no: string;
  name: string;
  voter_id: string;
  mobile: string;
  address: string;
}

export interface VoterResult extends VoterData {
  id: string;
}

/**
 * Search voters by phone number in the BCD database
 */
export async function searchVoterByPhone(phoneNumber: string): Promise<VoterResult[]> {
  try {
    const dbRef = ref(database, 'BCD');
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      console.log("[v0] No data available");
      return [];
    }

    const data = snapshot.val();
    const results: VoterResult[] = [];

    // Iterate through all entries except the Contact template
    for (const [key, value] of Object.entries(data)) {
      if (key !== 'Contact' && typeof value === 'object' && value !== null) {
        const voterData = value as VoterData;
        if (voterData.mobile === phoneNumber) {
          results.push({
            ...voterData,
            id: key,
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error("[v0] Error searching voters:", error);
    return [];
  }
}

/**
 * Get a specific voter by phone number
 */
export async function getVoterByPhone(phoneNumber: string): Promise<VoterResult | null> {
  try {
    const results = await searchVoterByPhone(phoneNumber);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("[v0] Error getting voter:", error);
    return null;
  }
}

/**
 * Get all voters (for development/testing)
 */
export async function getAllVoters(): Promise<VoterResult[]> {
  try {
    const dbRef = ref(database, 'BCD');
    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    const results: VoterResult[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'Contact' && typeof value === 'object' && value !== null) {
        results.push({
          ...(value as VoterData),
          id: key,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("[v0] Error fetching all voters:", error);
    return [];
  }
}
