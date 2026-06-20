import type { FileSystemTree } from "@webcontainer/api";

export const initialProjectTree: FileSystemTree = {
  "package.json": {
    file: {
      contents: JSON.stringify(
        {
          name: "coder-workspace",
          private: true,
          type: "module",
          scripts: {
            dev: "vite",
            build: "vite build",
            preview: "vite preview",
          },
          devDependencies: {
            vite: "^6.0.0",
          },
        },
        null,
        2,
      ),
    },
  },
  "index.html": {
    file: {
      contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Coder Preview</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div id="app">
      <h1>Hello from Coder!</h1>
      <p>Edit <code>main.js</code> and watch the preview update.</p>
    </div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
`,
    },
  },
  "main.js": {
    file: {
      contents: `const app = document.querySelector("#app");

if (app) {
  const note = document.createElement("p");
  note.textContent = "Preview is live.";
  app.appendChild(note);
}
`,
    },
  },
  "style.css": {
    file: {
      contents: `:root {
  color-scheme: light dark;
  font-family: system-ui, sans-serif;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0f172a;
  color: #e2e8f0;
}

#app {
  text-align: center;
}

code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}
`,
    },
  },
  "README.md": {
    file: {
      contents:
        "# Coder Workspace\n\nA minimal Vite project. The dev server starts automatically; edit files and use the preview panel.\n",
    },
  },
};
