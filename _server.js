'use strict';

const http = require('http');
const url = require('url');


let sendResponse = function(res,status,body){
  res.writeHead(status, {'Content-Type': 'text/html'});
  res.write(body);
  res.end();
};
const server = module.exports = http.createServer( (req,res) => {
  req.url = url.parse(req.url);
  if(req.method === 'GET' && req.url.pathname === '/'){
    sendResponse(res,200,'<a href="/cowsay">cowsay</a> <main> project description </main> ');
  }else if(req.method === 'GET' && req.url.pathname === '/cowsay?text={message}'){
    sendResponse(res,200, '<pre> cowsay.say({text: req.query.text}) </pre> ');
  }else if(req.method === 'POST' && req.url.pathname === '/api/cowsay'){
    let body = '';
    res.on('data', function(data){
      body += data.toString();
    });
    res.on('end', function(){
      let json;
      try {
        json = JSON.parse(body);
      } catch(e) {
        return sendResponse(res,400,{'Content-Type': 'application/json'},{"error":"invalid request: text query required"});
      }
      console.log(json);
      sendResponse(res,200,{'Content-Type': 'application/json'},{ "content": "<cowsay cow text>"});
    });
  }else{
    sendResponse(res,400,{'Content-Type': 'application/json'},{ "error": "invalid request: text query required"});
  }
}
);
