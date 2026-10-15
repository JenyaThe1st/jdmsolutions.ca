import { footerServices } from "@/data/footerServices";
import { FooterPanel } from "@/components/layout/footer/FooterPanel";
import {
  ServicesIcon,
  ChevronRightIcon,
} from "@/components/layout/footer/FooterIcons";

export function FooterOurServices() {
  return (
    <FooterPanel title="Our Services" icon={<ServicesIcon />}>
      <ul className="footer-list">
        {footerServices.map((service) => (
          <li key={service.href}>
            <ChevronRightIcon className="footer-row-icon" />
            <a href={service.href}>{service.name}</a>
          </li>
        ))}
      </ul>
    </FooterPanel>
  );
}
