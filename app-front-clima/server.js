function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get("x-forwarded-proto") !== "https") {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}

const express = require("express");
const app = express();

app.set("port", process.env.PORT || 8080);
app.use(requireHTTPS);
app.use(express.static("./dist/client-web-socket"));

app.get("/*", (req, res) =>
  res.sendFile("index.html", { root: "dist/client-web-socket/" })
);

app.listen(app.get("port"));
console.log(app.get("port"));
