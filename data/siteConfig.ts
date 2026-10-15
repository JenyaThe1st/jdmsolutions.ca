const businessName = "JDM Solutions";
const phoneDisplay = "(587) 215-1911";
const phoneTel = "5872151911";
const email = "jdmsolutionscalgary@gmail.com";
const location = {
  city: "Calgary",
  province: "Alberta",
  country: "CA",
} as const;
const availabilityLabel = "Open 7 Days a Week";
const hoursLabel = "8am - 8pm";

export const siteConfig = {
  businessName,
  phoneDisplay,
  phoneTel,
  email,
  location,
  serviceAreas: {
    primary: "Calgary",
    surrounding: [
      "Okotoks",
      "Airdrie",
      "Chestermere",
      "Cochrane",
      "De Winton",
      "Springbank",
      "Bearspaw",
      "Heritage Pointe",
    ] as const,
  },
  availabilityLabel,
  hoursLabel,
  coverageLabel: "Calgary and the surrounding areas",
  serviceLabel: "Property services",
  ctas: {
    primary: {
      label: "Call Now",
    },
  },
} as const;

export function getPhoneHref() {
  return `tel:+1${siteConfig.phoneTel}`;
}

export function getMailtoHref() {
  return `mailto:${siteConfig.email}`;
}

export function getLocationLabel() {
  return `${siteConfig.location.city}, ${siteConfig.location.province}`;
}

export type ContactInfoItem = {
  id: string;
  label: string;
  value: string;
  href?: string;
};

export function getContactInfoItems(): ContactInfoItem[] {
  return [
    {
      id: "phone",
      label: "Phone",
      value: siteConfig.phoneDisplay,
      href: getPhoneHref(),
    },
    {
      id: "email",
      label: "Email",
      value: siteConfig.email,
      href: getMailtoHref(),
    },
    {
      id: "availability",
      label: "Availability",
      value: siteConfig.availabilityLabel,
    },
    {
      id: "hours",
      label: "Business Hours",
      value: siteConfig.hoursLabel,
    },
    {
      id: "coverage",
      label: "Coverage",
      value: siteConfig.coverageLabel,
    },
  ];
}
