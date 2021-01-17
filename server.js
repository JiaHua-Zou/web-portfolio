const path = require("path");
const express = require("express");
const http = require('http');
//const socketio = require('socket.io');
const crawler = require("./js/main");

var HTTP_PORT = process.env.PORT || 8080;
var app = express();
const server = http.createServer(app);
//var io = socketio(server);

// Set static folder
app.use(express.static(__dirname, +'/public'));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/index.html"));

});
app.get("/cryto.html", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/cryto.html"));
});
app.get("/cryptoCurrency", async function (req, res) {
    crawler.getPrices()
        .then((data) => {
            //The first row.
            let table = '<table border="1">';
            table += ("<tr><th>Rank: &nbsp</th>"
                + "<th>Name:&nbsp</th>"
                + "<th>Price: &nbsp</th>"
                + "<th>24h: &nbsp</th>"
                + "<th>7d: &nbsp</th>"
                + "<th>Market Cap: &nbsp</th>"
                + "<th>Volume: &nbsp</th>"
                + "<th>Circulating Supply: &nbsp</th></tr>");

                //All the data will append.
            for (let i in data) {
                table += ("<tr><th>"+ data[i].rank +"</th>"
                    + "<th>&nbsp"+ data[i].name +"&nbsp</th>"
                    + "<th>&nbsp"+ data[i].price +"&nbsp</th>"
                    + "<th>&nbsp"+ data[i].day +"&nbsp</th>"
                    + "<th>&nbsp"+ data[i].week +"&nbsp</th>"
                    + "<th>&nbsp"+ data[i].marketCap +"&nbsp</th>"
                    + "<th>&nbsp"+ data[i].volume +"&nbsp</th>"
                    + "<th>&nbsp"+ data[i].circulatingSupply +"&nbsp</th></tr>");
            }
            table += '</table>';
            table += '<a href="/">Back Home</a><br><a href="/cryptoCurrency">Refresh</a>'
            res.send(table);
        })
});

app.listen(HTTP_PORT, () => {
    console.log("Server running on port 8080");
});