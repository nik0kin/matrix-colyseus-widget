import configs from './_config-map';

export interface PlantConfig {
  type: string;

  cost: number;
  requirement?: {
    karma?: number;
  };

  growTime: number;

  feeds: number;
  seedsOnHarvest: [number, number];
}

export function getPlantConfig(plantType: string) {
  const config = (configs as { [key: string]: PlantConfig })[plantType];
  if (!config) {
    throw new Error('missing config for plantType: ' + plantType);
  }
  return config;
}

export function assertMixinExists<T>(
  x: T | undefined,
  mixinKey: string
): asserts x {
  if (!x) {
    throw new Error(`Missing ${mixinKey} mixin config`);
  }
}

export const getPlantConfigs = () => configs;

export type PlantTypes = keyof typeof configs;

const plantTypes = Object.keys(configs);
export const getPlantTypes = () => plantTypes;

export const isValidPlant = (plantType: string) => {
  return !!getPlantConfigs()[plantType as PlantTypes];
};
