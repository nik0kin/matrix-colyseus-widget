import { PlantConfig } from '../plant-config';

const Potato: PlantConfig = {
  type: 'Potato',
  growTime: 30 * 60 * 1000,
  cost: 1,
  feeds: 1,
  seedsOnHarvest: [1, 2],
};

export default Potato;
