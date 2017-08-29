var
    url = require('url'),
    http = require('http'),
    server = http.createServer();
var acceptor = server.listen(7777, function () {
    console.log('gitlab webhook relay is running http://0.0.0.0:7777')
});

acceptor.on('request', function (request, response) {
    request.pause();
    var urlPath = ''
    var paths = request.url.split('/')
    if(paths[2]=='node'){
        urlPath = 'http://'+paths[1]+'-node:7777/webhook?mode=node'
    }else if(paths[2]=='java1'){
        urlPath = 'http://'+paths[1]+'-consumer:7777/webhook?mode=java'
    }else if(paths[2]=='java2'){
        urlPath = 'http://'+paths[1]+'-provider:7777/webhook?mode=java'
    }
    var options = url.parse(urlPath);
    options.headers = request.headers;
    options.method = request.method;
    options.agent = false;
    var connector = http.request(options, function (serverResponse, a) {
        serverResponse.pause();
        response.writeHeader(serverResponse.statusCode, serverResponse.headers);
        serverResponse.pipe(response);
        serverResponse.resume();
    });
    connector.on('error', function (e) {
        response.writeHead(200, {'content-type': 'application/json'})
        response.end('{"code":1,"msg":"'+e.toString()+'"}')
        console.log(e.toString())
        return;
    });
    request.pipe(connector);
    request.resume();
});