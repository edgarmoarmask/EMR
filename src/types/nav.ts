// types/nav.ts
export type PageId = "dashboard" | "queue" | "clinical" | "rx" | "analytics";

export interface PageProps {
  navigate: (page: PageId) => void;
}
