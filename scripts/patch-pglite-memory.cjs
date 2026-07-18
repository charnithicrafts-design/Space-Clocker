const fs = require("fs");
const path = require("path");
const distPath = path.join(__dirname, "../node_modules/@electric-sql/pglite/dist");
const files = fs.readdirSync(distPath);
files.forEach(file => {
  if (file.startsWith("chunk-") && file.endsWith(".js")) {
    const filePath = path.join(distPath, file);
    let content = fs.readFileSync(filePath, "utf-8");
    if (content.includes("maximum:32768")) {
      fs.writeFileSync(filePath, content.replace(/maximum:32768/g, "maximum:512"), "utf-8");
      console.log("Patched WebAssembly maximum memory in", file);
    }
  }
});
