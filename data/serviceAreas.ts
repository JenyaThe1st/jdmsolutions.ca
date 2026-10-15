import { siteConfig } from "./siteConfig";

export type ServiceAreaLocation = {
  name: string;
  isPrimary: boolean;
};

export function getServiceAreaLocations(): ServiceAreaLocation[] {
  const { primary, surrounding } = siteConfig.serviceAreas;
  return [
    { name: primary, isPrimary: true },
    ...surrounding.map((name) => ({ name, isPrimary: false })),
  ];
}
