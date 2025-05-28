import type { WindowContentComponent } from "./state/windowTypes";

export const PROGRAM_IDS = [
  "welcome",
  "media-player",
  "earth",
  "social-links",
  "virus",
] as const;

export type ProgramId = (typeof PROGRAM_IDS)[number];

export interface ProgramConfig {
  id: ProgramId;
  name: string;
  component: WindowContentComponent;
  window?: {
    icon: string;
    width: number;
    height: number;
    resizable: boolean;
    defaultPosition?: { x: number; y: number };
  };
  desktopIcon?: {
    icon: string;
  };
}

export const programs: ProgramConfig[] = [
  {
    id: "welcome",
    name: "Hello World",
    component: "WelcomeWindowContent",
    window: {
      icon: "/win98icon/file_windows-1.png",
      width: 300,
      height: 115,
      resizable: false,
      defaultPosition: { x: 10, y: 10 },
    },
  },
  {
    id: "media-player",
    name: "nickleback.mp3",
    component: "WindowsMediaPlayerWindowContent",
    window: {
      icon: "/win98icon/wm_file-2.png",
      width: 400,
      height: 300,
      resizable: true,
    },
    desktopIcon: {
      icon: "/win98icon/wm_file-2.png",
    },
  },
  {
    id: "earth",
    name: "Earth Is The Best!",
    component: "EarthWindowContent",
    window: {
      icon: "/win98icon/world-0.png",
      width: 400,
      height: 300,
      resizable: true,
    },
    desktopIcon: {
      icon: "/win98icon/world-0.png",
    },
  },
  {
    id: "social-links",
    name: "Social Life",
    component: "SocialLinksWindowContent",
    window: {
      icon: "/win98icon/users-0.png",
      width: 400,
      height: 300,
      resizable: false,
    },
    desktopIcon: {
      icon: "/win98icon/users-0.png",
    },
  },
];
