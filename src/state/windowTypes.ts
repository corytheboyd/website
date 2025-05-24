export const windowContentComponentNames = [
  "WelcomeWindowContent",
  "EarthWindowContent",
  "SocialLinksWindowContent",
  "RunWindowContent",
  "MSDOSPromptWindowContent",
] as const;

export type WindowContentComponent =
  (typeof windowContentComponentNames)[number];
