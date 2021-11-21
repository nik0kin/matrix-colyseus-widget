import { PlantConfig } from '../plant-config';

const Sunflower: PlantConfig = {
  type: 'Sunflower',
  growTime: 60 * 60 * 1000,
  cost: 2,
  requirement: {
    karma: 50,
  },
  feeds: 3,
  seedsOnHarvest: [4, 8],
};

export default Sunflower;
