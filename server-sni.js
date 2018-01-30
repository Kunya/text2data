var createServer = require("auto-sni");
var express = require("express");
var app = express();


var server = createServer({
    email: "A@K.com", // Emailed when certificates expire.
    agreeTos: true, // Required for letsencrypt.
    debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
    domains: [
        ["test.com", "www.test.com"]
    ], // List of accepted domain names. (You can use nested arrays to register bundles with LE).
    dir: "~/letsencrypt/etc", // Directory for storing certificates. Defaults to "~/letsencrypt/etc" if not present.
    ports: {
        http: 80, // Optionally override the default http port.
        https: 443 // // Optionally override the default https port.
    }
});

// Server is a "https.createServer" instance.
server.once("listening", () => {
    console.log("We are ready to go.");
});
