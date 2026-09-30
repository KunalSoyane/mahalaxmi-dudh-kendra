import {MongoMemoryReplSet} from 'mongodb-memory-server';
import {spawn} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import newman from 'newman';
const nonce=randomBytes(6).toString('hex');let mongo,server;
function run(script,env){return new Promise((resolve,reject)=>{const p=spawn(process.execPath,[script],{env,stdio:'inherit'});p.on('exit',c=>c===0?resolve():reject(Error(script+' failed: '+c)))})}
try{
 mongo=await MongoMemoryReplSet.create({replSet:{count:1},binary:{version:'7.0.14'}});
 const env={...process.env,MONGODB_URI:mongo.getUri('mahalaxmi_test'),JWT_SECRET:randomBytes(48).toString('hex'),ADMIN_EMAIL:'admin@example.test',ADMIN_PASSWORD:'LabAdminPassword2026',STORE_LAT:'19.0085',STORE_LNG:'72.8467',PORT:'3099',APP_ORIGIN:'http://localhost:3099',NODE_ENV:'test'};
 await run('server/seed.js',env);server=spawn(process.execPath,['server/index.js'],{env,stdio:'inherit'});
 let ready=false;for(let i=0;i<100;i++){try{const r=await fetch('http://localhost:3099/api/health');if(r.ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}if(!ready)throw Error('API failed to start');
 const values={baseUrl:'http://localhost:3099',adminEmail:env.ADMIN_EMAIL,adminPassword:env.ADMIN_PASSWORD,customerEmail:nonce+'@example.test',customerPassword:'LabOnlyPassword2026',sku:'test-'+nonce};
 const collection=JSON.parse(await readFile('postman/Mahalaxmi.postman_collection.json','utf8'));
 const result=await new Promise((resolve,reject)=>newman.run({collection,environment:{values:Object.entries(values).map(([key,value])=>({key,value,enabled:true}))},reporters:['cli']},(err,s)=>err?reject(err):resolve(s)));
 // Save only aggregate results: never export cookies or credentials.
 const report={date:new Date().toISOString(),database:'Temporary MongoDB replica set',requests:result.run.stats.requests,assertions:result.run.stats.assertions,failures:result.run.failures.map(f=>({name:f.error.name,message:f.error.message,item:f.source?.name}))};
 await writeFile('docs/INTEGRATION_RESULTS.json',JSON.stringify(report,null,2));if(report.failures.length)throw Error('Integration checks failed');
 console.log('Database-backed Postman integration suite passed.');
}finally{if(server){server.kill();await new Promise(r=>server.once('exit',r))}if(mongo)await mongo.stop()}
