const express = require("express");
const errorLogger = require("./index");

const app = express();

app.use(
  errorLogger(
    {
      logToConsole: true,
      sendResponse: true,
    },
    app
  )
);

app.get("/", (req, res) => {
  // throw new Error("Something went wrong!");
  res.send("Hello, world!");
});

app.listen(8000, () => console.log("Server running on port 8000"));
