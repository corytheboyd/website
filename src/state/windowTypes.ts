export const windowContentComponentNames = [
  "WelcomeWindowContent",
  "EarthWindowContent",
  "SocialLinksWindowContent",
  "RunWindowContent",
  "VirusPopUpContent",
  "WindowsMediaPlayerWindowContent",
] as const;

export type WindowContentComponent =
  (typeof windowContentComponentNames)[number];
