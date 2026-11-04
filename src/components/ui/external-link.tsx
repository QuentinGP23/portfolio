import type { ComponentProps } from "react";

type ExternalLinkProps = Omit<ComponentProps<"a">, "rel" | "target"> & {
  /** Opens the link in a new tab and says so to assistive technologies. */
  newTab?: boolean;
};

/**
 * Link to another site. Never shares the referrer or the window object with the
 * target page (rel="noopener noreferrer").
 */
export function ExternalLink({
  newTab = false,
  children,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      {...props}
      rel="noopener noreferrer"
      target={newTab ? "_blank" : undefined}
    >
      {children}
      {newTab ? <span className="sr-only"> (nouvel onglet)</span> : null}
    </a>
  );
}
