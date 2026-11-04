import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { server } from "../mocks/server";

describe("GitHub API mock", () => {
  it("answers GraphQL queries without touching the network", async () => {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      body: JSON.stringify({ query: "{ viewer { login } }" }),
    });
    await expect(response.json()).resolves.toEqual({
      data: { viewer: { login: "QuentinGP23" } },
    });
  });

  it("lets a test override the default answer", async () => {
    server.use(
      http.post("https://api.github.com/graphql", () =>
        HttpResponse.json({ message: "Bad credentials" }, { status: 401 }),
      ),
    );
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
    });
    expect(response.status).toBe(401);
  });

  it("fails any request that has no mock handler", async () => {
    // MSW logs the unhandled request to the console: capture it instead.
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    // The cause proves that MSW refused the request, not a network failure.
    await expect(fetch("https://example.com/not-mocked")).rejects.toMatchObject(
      {
        cause: { message: expect.stringContaining("[MSW]") },
      },
    );
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining("without a matching request handler"),
    );
    consoleError.mockRestore();
  });
});
