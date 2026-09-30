import mongoose from 'mongoose';
const {Schema,model}=mongoose;
export const User=model('User',new Schema({name:{type:String,required:true},email:{type:String,required:true,unique:true},passwordHash:{type:String,required:true},role:{type:String,enum:['admin','customer'],default:'customer'}},{timestamps:true}));
export const Product=model('Product',new Schema({id:{type:String,unique:true},name:String,detail:String,category:String,price:{type:Number,min:1},stock:{type:Number,min:0},badge:String,color:String,image:String}));
export const Order=model('Order',new Schema({number:{type:String,unique:true},user:{type:Schema.Types.ObjectId,ref:'User'},items:[{id:String,name:String,quantity:Number,price:Number}],subtotal:Number,delivery:Number,total:Number,status:{type:String,default:'Placed'},address:{name:String,phone:String,street:String},location:{lat:Number,lng:Number},distance:Number},{timestamps:true}));
export const Request=model('Request',new Schema({user:{type:Schema.Types.ObjectId,ref:'User'},type:{type:String,enum:['subscription','wholesale']},details:Schema.Types.Mixed,status:{type:String,enum:['New','Contacted','Active','Paused','Closed'],default:'New'}},{timestamps:true}));
