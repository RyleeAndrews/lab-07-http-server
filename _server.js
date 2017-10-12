'use strict';

const http = require('http');
const url = require('url');
const cowsay = require('cowsay');
const querystring = require('querystring');
let sendResponse = function(res,status,body){
  res.writeHead(status, {'Content-Type': 'text/html'});
  res.write(body);
  res.end();
};

const server = module.exports = http.createServer( (req,res) => {
  req.url = url.parse(req.url);
  if(req.method === 'GET' && req.url.pathname === '/'){
    sendResponse(res,200,'<a href="/cowsay">cowsay</a> <main> project description </main> ');
  }else if(req.method === 'GET' && req.url.pathname === '/cowsay'){
    req.url.query = querystring.parse(req.url.query);
    if(Object.keys(req.url.query).length === 0){
      sendResponse(res,200,cowsay.say({text: 'I need something good to say'}));
    }else{
      sendResponse(res,200,cowsay.say({text: `${req.url.query.text}`}));
    }
  }else if(req.method === 'POST' && req.url.pathname === '/api/cowsay'){
    let body = {"text": "<message>"};
    req.on('data', function(data){
      body += data.toString();
    });
    req.on('end', function(){
      let json;
      try {
        json = JSON.stringify(body);
      } catch(e) {
        return sendResponse(res,400,'{"error":"invalid request: body required"}');
      }
      console.log(json);
      sendResponse(res,200,'{ "content": "<cowsay cow text>"}');
    });
  }else{
    sendResponse(res,400,'{ "error": "invalid request: text query required"}');
  }
}
);


server.start = function(){


  return new Promise((resolve,reject) => {
    if(server.address === null){
      resolve(server.listen(3000));
    }
    if(err);
    reject(err);
  });
};

server.stop = function(){

  return new Promise((resolve,reject) => {
    if(server.address === 3000){
      resolve(server.on('end', function(){
        server.end();
      }));
      if(err)
        reject(err);
    }
  }
);
};
