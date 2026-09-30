import 'dotenv/config';import mongoose from 'mongoose';import bcrypt from 'bcryptjs';import {products} from '../src/catalog.js';import {Product,User} from './models.js';
if(!process.env.MONGODB_URI||!process.env.ADMIN_EMAIL||!process.env.ADMIN_PASSWORD||process.env.ADMIN_PASSWORD.length<12)throw Error('Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters).');
await mongoose.connect(process.env.MONGODB_URI);
for(const p of products)await Product.updateOne({id:p.id},{$setOnInsert:p},{upsert:true});
const email=process.env.ADMIN_EMAIL.trim().toLowerCase();const existing=await User.findOne({email});if(existing&&existing.role!=='admin')throw Error('Email belongs to a customer. Choose a separate admin email.');if(!existing)await User.create({name:'Store admin',email,passwordHash:await bcrypt.hash(process.env.ADMIN_PASSWORD,12),role:'admin'});
console.log('Catalogue and admin initialized. Existing inventory and accounts were preserved.');await mongoose.disconnect();
