// Experiment 7: filesystem, Buffer, streams and event-loop behaviour.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createReadStream,createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream/promises';
await mkdir('labs/output',{recursive:true});
const text='Mahalaxmi Dudh Kendra: fresh milk for our neighbourhood.\n';
const buffer=Buffer.from(text,'utf8');
console.log('Buffer byte length:',buffer.length);
console.log('Decoded buffer:',buffer.toString('utf8').trim());
await writeFile('labs/output/source.txt',buffer);
console.log('Filesystem read:',(await readFile('labs/output/source.txt','utf8')).trim());
await pipeline(createReadStream('labs/output/source.txt'),createWriteStream('labs/output/stream-copy.txt'));
console.log('Stream copied source.txt to stream-copy.txt');
console.log('Event loop: synchronous start');
setTimeout(()=>console.log('Event loop: timer callback'),0);
queueMicrotask(()=>console.log('Event loop: microtask callback'));
console.log('Event loop: synchronous end');
