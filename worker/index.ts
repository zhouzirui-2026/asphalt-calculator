/** Cloudflare Worker entry point for the static-first calculator site. */
import handler from "vinext/server/app-router-entry";

type Env = Record<string, never>;

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handler.fetch(request, env, ctx);
  },
};

export default worker;
