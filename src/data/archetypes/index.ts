import { medicalProfiles } from './medical';
import { heavyBuilderProfiles } from './heavy-builders';
import { businessOwnerProfiles } from './business-owners';
import { creativeArtisanProfiles } from './creative-artisans';
import { operationalProfiles } from './operational';
import { digitalInstitutionalProfiles } from './digital-institutional';

import { Archetype } from '../archetypes';

export const mastermindArchetypes: Archetype[] = [
  ...medicalProfiles,
  ...heavyBuilderProfiles,
  ...businessOwnerProfiles,
  ...creativeArtisanProfiles,
  ...operationalProfiles,
  ...digitalInstitutionalProfiles
];
