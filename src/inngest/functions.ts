import { anthropic, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },

  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("myvibe-nextjs-test-2");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      system: `You are an expert next.js developer.  You write readable, maintainable, code.
         You write simple next.js and react snippets`,
      model: anthropic({
        model: "claude-3-5-haiku-latest",
        defaultParameters: { max_tokens: 1024 },
      }),
    });

    const { output } = await codeAgent.run(
      "Write the following snippet: " + event.data.value
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandboxUrl };
  }
);
