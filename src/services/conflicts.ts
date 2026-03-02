import type { ConflictZone } from '../types/index.js';

// Static conflict zone data - ACLED data requires API key, so we maintain
// a curated list of known active conflict zones
const KNOWN_CONFLICTS: ConflictZone[] = [
  {
    name: 'Ukraine - Russia',
    lat: 48.5,
    lng: 37.5,
    intensity: 'high',
    description: 'Ongoing armed conflict since 2022',
    parties: ['Ukraine', 'Russia'],
  },
  {
    name: 'Gaza - Israel',
    lat: 31.35,
    lng: 34.3,
    intensity: 'high',
    description: 'Ongoing military operations',
    parties: ['Israel', 'Hamas'],
  },
  {
    name: 'Sudan Civil War',
    lat: 15.5,
    lng: 32.5,
    intensity: 'high',
    description: 'Civil war between SAF and RSF',
    parties: ['SAF', 'RSF'],
  },
  {
    name: 'Myanmar Civil War',
    lat: 19.7,
    lng: 96.1,
    intensity: 'high',
    description: 'Armed resistance against military junta',
    parties: ['Military Junta', 'Resistance Forces'],
  },
  {
    name: 'Ethiopia - Tigray',
    lat: 13.5,
    lng: 39.5,
    intensity: 'medium',
    description: 'Post-ceasefire tensions and reconstruction',
    parties: ['Ethiopian Government', 'TPLF'],
  },
  {
    name: 'Syria',
    lat: 35.0,
    lng: 38.0,
    intensity: 'medium',
    description: 'Post-Assad transition period',
    parties: ['HTS-led Government', 'SDF', 'Turkey'],
  },
  {
    name: 'DR Congo - Eastern',
    lat: -1.5,
    lng: 29.0,
    intensity: 'high',
    description: 'M23 and other armed groups',
    parties: ['DRC Government', 'M23', 'Various Militias'],
  },
  {
    name: 'Somalia - Al-Shabaab',
    lat: 5.0,
    lng: 46.0,
    intensity: 'medium',
    description: 'Counter-insurgency operations',
    parties: ['Somali Government', 'AMISOM', 'Al-Shabaab'],
  },
  {
    name: 'Sahel Region',
    lat: 14.0,
    lng: 1.0,
    intensity: 'medium',
    description: 'Jihadist insurgency across Mali, Burkina Faso, Niger',
    parties: ['JNIM', 'ISGS', 'National Forces'],
  },
  {
    name: 'Yemen',
    lat: 15.5,
    lng: 48.0,
    intensity: 'medium',
    description: 'Houthi-Saudi conflict and Red Sea tensions',
    parties: ['Houthis', 'Saudi Coalition', 'STC'],
  },
  {
    name: 'Haiti Gang Violence',
    lat: 18.5,
    lng: -72.3,
    intensity: 'medium',
    description: 'Widespread gang control and instability',
    parties: ['Gangs', 'Transitional Government'],
  },
  {
    name: 'Pakistan - Balochistan',
    lat: 29.0,
    lng: 66.0,
    intensity: 'low',
    description: 'Separatist insurgency',
    parties: ['Pakistan Military', 'BLA', 'TTP'],
  },
];

export async function fetchConflictZones(): Promise<ConflictZone[]> {
  // Return curated conflict data
  // In a full implementation, this would pull from ACLED API
  return KNOWN_CONFLICTS;
}
