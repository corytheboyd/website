export const windowContentComponentNames = [
  "WelcomeWindowContent",
  "EarthWindowContent",
  "SocialLinksWindowContent",
  "RunWindowContent",
  "MSDOSPromptWindowContent",
  "VirusPopUpContent",
] as const;

export type WindowContentComponent =
  (typeof windowContentComponentNames)[number];
