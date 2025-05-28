export const windowContentComponentNames = [
  "WelcomeWindowContent",
  "EarthWindowContent",
  "SocialLinksWindowContent",
  "RunWindowContent",
  "MSDOSPromptWindowContent",
  "VirusPopUpContent",
  "WindowsMediaPlayerWindowContent",
] as const;

export type WindowContentComponent =
  (typeof windowContentComponentNames)[number];
