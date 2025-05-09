export const windowContentComponentNames = [
  "WelcomeWindowContent",
  "EarthWindowContent",
  "SocialLinksWindowContent",
] as const;

export type WindowContentComponent = typeof windowContentComponentNames[number]; 
