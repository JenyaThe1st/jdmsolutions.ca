import { FooterPanel } from "@/components/layout/footer/FooterPanel";
import { ContactPanelIcon } from "@/components/layout/footer/FooterIcons";
import { ContactInfoList } from "@/components/shared/ContactInfoList";

export function FooterContactInfo() {
  return (
    <FooterPanel
      id="contact-information"
      title="Contact Information"
      icon={<ContactPanelIcon />}
    >
      <ContactInfoList />
    </FooterPanel>
  );
}
