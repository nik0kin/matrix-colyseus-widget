import { HOUR_IN_MS } from 'utils';
import { PlantConfig } from '../plant-config';

const Sunflower: PlantConfig = {
  type: 'Sunflower',
  growTime: 1.2 * HOUR_IN_MS,
  cost: 2,
  requirement: {
    karma: 50,
  },
  feeds: 3,
  seedsOnHarvest: [3, 6],
};

export default Sunflower;
