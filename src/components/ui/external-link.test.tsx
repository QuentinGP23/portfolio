import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExternalLink } from "./external-link";

describe("ExternalLink", () => {
  it("never shares the referrer or the window object", () => {
    render(
      <ExternalLink href="https://github.com/QuentinGP23">GitHub</ExternalLink>,
    );
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).not.toHaveAttribute("target");
  });

  it("announces a new tab to assistive technologies", () => {
    render(
      <ExternalLink href="https://github.com/QuentinGP23" newTab>
        GitHub
      </ExternalLink>,
    );
    // jsdom drops the space before the hidden text when it computes the name;
    // browsers keep it, which the text content check below guarantees.
    const link = screen.getByRole("link", {
      name: /^GitHub\s?\(nouvel onglet\)$/,
    });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveTextContent("GitHub (nouvel onglet)");
  });
});
