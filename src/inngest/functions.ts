import { anthropic, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },

  async ({ event }) => {
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

    return { output };
  }
);
