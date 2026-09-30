import React from 'react';
import {Plus,Minus,Package} from 'lucide-react';
export default function ProductCard({product:p,image,quantity,onAdjust}){
return <article className="product"><div className="product-image" style={{background:p.color||'#f0f5f8'}}>{p.badge&&<span className="badge">{p.badge}</span>}{image?<img src={image} alt={p.name} loading="lazy"/>:<Package size={64}/>}</div><div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><p>{p.detail}</p><div className="product-bottom"><strong>₹{p.price}</strong>{quantity>0?<div className="stepper"><button aria-label={'Remove '+p.name} onClick={()=>onAdjust(p.id,-1)}><Minus size={16}/></button><b>{quantity}</b><button aria-label={'Add '+p.name} onClick={()=>onAdjust(p.id,1)}><Plus size={16}/></button></div>:<button className="add" disabled={!p.stock} onClick={()=>onAdjust(p.id,1)}>{p.stock?'Add':'Sold out'}{p.stock>0&&<Plus size={16}/>}</button>}</div></div></article>
}
