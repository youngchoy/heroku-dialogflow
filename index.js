var http = require('http');
var fs = require('fs');
var app = http.createServer(function(request, response){
    var url = request.url;
    if(request.url == '/'){
        url = '/index.html';
    }
    if(request.url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));
})
console.log("실행 포트번호는 :" + process.env.PORT);
app.listen(process.env.PORT || 3000)