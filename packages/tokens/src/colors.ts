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
} as const;
