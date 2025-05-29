import type { WindowContentComponent } from "./state/windowTypes";

export const PROGRAM_IDS = [
  "welcome",
  "media-player",
  "earth",
  "social-links",
  "virus",
  "run",
  "image-viewer",
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
    title?: string;
  };
  desktopIcon?: {
    icon: string;
  };
  showInToolbar: boolean;
  focusOnOpen: boolean;
  programArguments?: {
    src: string;
    title: string;
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
    showInToolbar: true,
    focusOnOpen: true,
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
      defaultPosition: { x: 0, y: 300 },
    },
    desktopIcon: {
      icon: "/win98icon/wm_file-2.png",
    },
    showInToolbar: true,
    focusOnOpen: true,
  },
  {
    id: "earth",
    name: "Earth Is The Best!",
    component: "EarthWindowContent",
    window: {
      icon: "/win98icon/world-0.png",
      width: 250,
      height: 250,
      resizable: true,
      defaultPosition: { x: 0, y: 250 },
    },
    desktopIcon: {
      icon: "/win98icon/world-0.png",
    },
    showInToolbar: true,
    focusOnOpen: true,
  },
  {
    id: "social-links",
    name: "Social Life",
    component: "SocialLinksWindowContent",
    window: {
      icon: "/win98icon/users-0.png",
      width: 325,
      height: 275,
      resizable: false,
      defaultPosition: { x: 35, y: 130 },
    },
    desktopIcon: {
      icon: "/win98icon/users-0.png",
    },
    showInToolbar: true,
    focusOnOpen: true,
  },
  {
    id: "run",
    name: "Run",
    component: "RunWindowContent",
    window: {
      icon: "/win98icon/application_hourglass-0.png",
      width: 370,
      height: 160,
      resizable: false,
      defaultPosition: { x: 40, y: 40 },
    },
    showInToolbar: true,
    focusOnOpen: true,
  },
  {
    id: "virus",
    name: "Has Science Gone Too Far?",
    component: "VirusPopUpContent",
    window: {
      icon: "/win98icon/application_hourglass-0.png",
      width: 400,
      height: 300,
      resizable: true,
    },
    showInToolbar: true,
    focusOnOpen: false,
  },
  {
    id: "image-viewer",
    name: "Image Viewer",
    component: "ImageViewerWindowContent",
    window: {
      icon: "/win98icon/image_old_gif-0.png",
      width: 400,
      height: 400,
      resizable: true,
      defaultPosition: { x: 60, y: 60 },
    },
    showInToolbar: true,
    focusOnOpen: true,
  },
];

export interface ImageViewerProgramArguments {
  src: string;
  title: string;
  width: number;
  height: number;
}

export type ProgramArgumentsMap = {
  "image-viewer": ImageViewerProgramArguments;
  // Add other program argument types here as needed
  [key: string]: any;
};

export interface ProgramShortcut<T extends ProgramId = ProgramId> {
  id: string;
  name: string;
  targetProgramId: T;
  programArguments: ProgramArgumentsMap[T];
  windowArguments?: Partial<NonNullable<ProgramConfig["window"]>>;
}

export const programShortcuts: ProgramShortcut<"image-viewer">[] = [
  {
    id: "four-byte-burger.png",
    name: "four-byte-burger.png",
    targetProgramId: "image-viewer",
    programArguments: {
      src: "/four-byte-burger.png",
      title: "four-byte-burger.png",
      width: 300,
      height: 400,
    },
    windowArguments: {
      title: "four-byte-burger.png",
      width: 350,
      height: 450,
    },
  },
];
