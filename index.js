const { execSync, exec } = require("child_process");
const path = require("path");
const http = require("http");

const resolvePost = (req) =>
  new Promise((resolve) => {
    let chunk = "";
    req.on("data", (data) => {
      chunk += data;
    });
    req.on("end", () => {
      resolve(JSON.parse(chunk));
    });
  });

const projectDir = path.resolve(__dirname, "./demo");

http
  .createServer(async (req, res) => {
    console.log("receive request");
    console.log(req.url);
    if (req.method === "POST" && req.url === "/") {
      const data = await resolvePost(req);
      exec("rm -f demo/*");
      // 拉取仓库最新代码
      execSync(
        `git clone git@github.com:shaodushu/code-life.git ${projectDir}`,
        {
          stdio: "inherit",
        }
      );

      // 创建 docker 镜像
      execSync(
        `docker build --rm -f "Dockerfile" -t ${data.repository.name}-image:latest .`,
        {
          stdio: "inherit",
          cwd: projectDir,
        }
      );

      // 创建 docker 容器
      execSync(
        `docker run --rm --name ${data.repository.name}-container -p 8080:80 ${data.repository.name}-image:latest`,
        {
          stdio: "inherit",
        }
      );

      console.log("deploy success");
    }
    res.end("ok");
  })
  .listen(3000, () => {
    console.log("server is ready");
  });
