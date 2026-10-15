import { getServiceAreaLocations } from "@/data/serviceAreas";
import { LocationIcon } from "@/components/ui/LocationIcon";
import { FooterPanel } from "@/components/layout/footer/FooterPanel";
import { MapAreasIcon } from "@/components/layout/footer/FooterIcons";

export function FooterServiceAreas() {
  const locations = getServiceAreaLocations();

  return (
    <FooterPanel title="Service Areas" icon={<MapAreasIcon />}>
      <ul className="footer-list">
        {locations.map((area) => (
          <li key={area.name}>
            <LocationIcon className="footer-row-icon h-4 w-4" />
            <span className={area.isPrimary ? "font-semibold text-white" : ""}>
              {area.name}
            </span>
          </li>
        ))}
      </ul>
    </FooterPanel>
  );
}
