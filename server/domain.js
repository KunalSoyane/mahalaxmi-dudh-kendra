export const statuses=['Placed','Confirmed','Preparing','Out for delivery','Delivered','Cancelled'];
export function distanceKm(a,b){const r=n=>n*Math.PI/180;const h=Math.sin(r(a.lat-b.lat)/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(r(a.lng-b.lng)/2)**2;return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))}
export function validLocation(p){return p&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180}
export function validItems(items){return Array.isArray(items)&&items.length>0&&items.length<=100&&new Set(items.map(i=>i.id)).size===items.length&&items.every(i=>typeof i.id==='string'&&Number.isInteger(i.quantity)&&i.quantity>=1&&i.quantity<=1000)}
export function allowedTransition(from,to){return ({Placed:['Confirmed','Cancelled'],Confirmed:['Preparing','Cancelled'],Preparing:['Out for delivery','Cancelled'],'Out for delivery':['Delivered'],Delivered:[],Cancelled:[]})[from]?.includes(to)||false}
export function deliveryFee(subtotal){return subtotal>=299?0:25}
