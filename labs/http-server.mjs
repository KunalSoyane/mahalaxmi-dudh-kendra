// Experiment 7: an HTTP server using Node's built-in module, without Express.
import {createServer} from 'node:http';
createServer((req,res)=>{res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({shop:'Mahalaxmi Dudh Kendra',method:req.method,path:req.url}))}).listen(3100,'127.0.0.1',()=>console.log('Open http://localhost:3100 ; Ctrl+C stops this lab server.'));
