import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const serverEntry = join("dist", "server", "index.js");
const hostingTarget = join("dist", ".openai", "hosting.json");

mkdirSync(dirname(serverEntry), { recursive: true });
mkdirSync(dirname(hostingTarget), { recursive: true });

writeFileSync(serverEntry, `import { createServer } from "node:http";
import next from "next";

const port = Number(process.env.PORT ?? 3000);
const hostname = "0.0.0.0";
const app = next({
  dev: false,
  dir: process.cwd(),
  conf: {
    distDir: "dist",
  },
});
const handle = app.getRequestHandler();

await app.prepare();

createServer((request, response) => {
  handle(request, response);
}).listen(port, hostname, () => {
  console.log(\`Student AI OS listening on http://\${hostname}:\${port}\`);
});
`);

copyFileSync(join(".openai", "hosting.json"), hostingTarget);
