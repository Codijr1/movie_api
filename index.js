const express= require('express');
const app= express();
const http= require('http');
const morgan= require('morgan');
const port= 8080;

http.createServer((request, response)=> {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Welcome to my server!\n');
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');

