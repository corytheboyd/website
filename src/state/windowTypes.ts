export const windowContentComponentNames = [
  "WelcomeWindowContent",
  "EarthWindowContent",
  "SocialLinksWindowContent",
  "RunWindowContent",
  "VirusPopUpContent",
  "WindowsMediaPlayerWindowContent",
  "ImageViewerWindowContent",
] as const;

export type WindowContentComponent =
  (typeof windowContentComponentNames)[number];
