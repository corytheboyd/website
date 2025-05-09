declare global {
  interface Window {
    __desktopArea?: import('vue').Ref<HTMLElement | null>;
  }
}
export {}; 
