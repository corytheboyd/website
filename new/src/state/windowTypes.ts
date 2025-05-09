export const desktopWindowComponentNames = [
  "WelcomeWindow",
  "EarthWindow",
  "SocialLinksWindow",
] as const;

export type DesktopWindowComponent = typeof desktopWindowComponentNames[number]; 
