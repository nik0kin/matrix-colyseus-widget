import { DAY_IN_MS } from 'utils';
import { PlantConfig } from '../plant-config';

const AppleTree: PlantConfig = {
  type: 'AppleTree',
  subtype: 'Tree',
  growTime: DAY_IN_MS / 4,
  harvestTime: DAY_IN_MS * (3 / 4),
  cost: 50,
  requirement: {
    karma: 250,
  },
  feeds: 20,
  seedsOnHarvest: [0, 0],
};

export default AppleTree;
