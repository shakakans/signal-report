import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { getNews } from './news.js';
const files={'/':['index.html','text/html; charset=utf-8'],'/style.css':['style.css','text/css; charset=utf-8'],'/app.js':['app.js','text/javascript; charset=utf-8'],'/favicon.svg':['favicon.svg','image/svg+xml']};
const server=createServer(async(req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET'){res.writeHead(405);res.end();return;}
 if(path==='/api/news'){try{const data=await getNews();res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}catch{res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'News sources are temporarily unavailable. Please retry shortly.'}));}return;}
 if(path==='/health'){res.writeHead(200);res.end('ok');return;}
 const file=files[path];if(!file){res.writeHead(404);res.end('Not found');return;}
 try{const content=await readFile(new URL('./public/'+file[0],import.meta.url));res.writeHead(200,{'Content-Type':file[1]});res.end(content);}catch{res.writeHead(500);res.end('Unable to load page');}
});
server.listen(Number(process.env.PORT)||3000,process.env.HOST||'0.0.0.0',()=>console.log(`The Signal Report: http://127.0.0.1:${Number(process.env.PORT)||3000}/`));
