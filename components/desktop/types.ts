export type AppType = "about" | "projects" | "skills" | "contact" | "tetris" | "algorithms";
export type WindowAppType = Exclude<AppType, "terminal">;

export type DockApp = {
    id: string;
    name: string;
    icon: string;
    appType: string;
};

export type WidgetType = "todo" | "now-listening" | "date-now" | "tetris";

export type DesktopItem = {
    id: string;
    type: "folder" | "widget" | "app";
    name: string;
    icon: string;
    x: number;
    y: number;
    appType?: WindowAppType; // desktop app shortcuts (no terminal here)
    widgetType?: WidgetType;
    // Optional for widgets: span in bento grid and computed pixel size
    span?: { cols: number; rows: number };
    widthPx?: number;
    heightPx?: number;
    scale?: number;
};
