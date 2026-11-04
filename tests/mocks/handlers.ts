import { http, HttpResponse } from "msw";

/** Default mock handlers: tests never call the real GitHub API. */
export const handlers = [
  http.post("https://api.github.com/graphql", () =>
    HttpResponse.json({ data: { viewer: { login: "QuentinGP23" } } }),
  ),
];
