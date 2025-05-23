export const windowContentComponentNames = [
  "WelcomeWindowContent",
  "EarthWindowContent",
  "SocialLinksWindowContent",
  "RunWindowContent",
] as const;

export type WindowContentComponent =
  (typeof windowContentComponentNames)[number];
