export const colors = {
  background: {
    primary: "var(--color-background-primary)",
    secondary: "var(--color-background-secondary)",
  },
  text: {
    primary: "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
    muted: "var(--color-text-muted)",
  },
  border: {
    default: "var(--color-border-default)",
    focus: "var(--color-border-focus)",
  },
  brand: {
    primary: "var(--color-brand-primary)",
    secondary: "var(--color-brand-secondary)",
    accent: {
      cyan: "var(--color-brand-accent-cyan)",
      violetDeep: "var(--color-brand-accent-violet-deep)",
      blueDeep: "var(--color-brand-accent-blue-deep)",
      violetBright: "var(--color-brand-accent-violet-bright)",
    },
  },
  status: {
    success: "var(--lx-success)",
    successSurface: "var(--lx-success-surface)",
    warning: "var(--lx-warning)",
    warningSurface: "var(--lx-warning-surface)",
    destructive: "var(--lx-destructive)",
    destructiveHover: "var(--lx-destructive-hover)",
    destructiveSurface: "var(--lx-destructive-surface)",
    info: "var(--lx-info)",
    infoSurface: "var(--lx-info-surface)",
  },
} as const;
