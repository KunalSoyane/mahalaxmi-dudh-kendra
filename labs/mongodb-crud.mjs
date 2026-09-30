// Isolated lab collection: never deletes shop products or orders.
import 'dotenv/config';import mongoose from 'mongoose';
if(!process.env.MONGODB_URI)throw Error('Configure MONGODB_URI in .env first');
await mongoose.connect(process.env.MONGODB_URI);
const Item=mongoose.model('LabItem',new mongoose.Schema({name:String,quantity:Number}));
const item=await Item.create({name:'Lab demonstration only',quantity:1});
console.log('CREATE:',item.toObject());
console.log('READ:',await Item.findById(item.id).lean());
console.log('UPDATE:',await Item.findByIdAndUpdate(item.id,{$inc:{quantity:4}},{new:true}).lean());
console.log('DELETE:',await Item.deleteOne({_id:item.id}));
await mongoose.disconnect();
