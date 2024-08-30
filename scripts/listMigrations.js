import fs from "fs";
import path from "path";

const publicDir = "public";

function listFiles(dir, onlySuffixes) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(listFiles(filePath, onlySuffixes));
    } else if (onlySuffixes && !onlySuffixes.includes(path.extname(file))) {
      return;
    } else {
      const filePathWithoutPublic = filePath.replace(publicDir, "");
      results.push(filePathWithoutPublic);
    }
  });
  return results;
}

const migrationsDir = path.join(publicDir, "migrations");
const files = listFiles(publicDir, [".sql"]);

console.log("Making migrations indexable:");
files.forEach((file) => {
  console.log("\x1b[32m%s\x1b[0m", file);
});
fs.writeFileSync(
  path.join(migrationsDir, "files.json"),
  JSON.stringify({ files }, null, 2)
);
