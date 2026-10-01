const API = location.hostname==="localhost" ? "http://localhost:3000" : "https://YOUR-BACKEND-URL"; // set after deploying /server
const P=[
{id:1,n:'Smart LED TV 43"',p:32500,c:'Televisions',i:'tv'},{id:2,n:'Smart LED TV 55" 4K',p:58900,c:'Televisions',i:'tv'},
{id:3,n:'Steam Iron Box',p:2800,c:'Iron Boxes',i:'iron'},{id:4,n:'Dry Iron Box',p:1500,c:'Iron Boxes',i:'iron'},
{id:5,n:'Blender 1.5L',p:4200,c:'Kitchen',i:'blender'},{id:6,n:'Electric Kettle 2L',p:1900,c:'Kitchen',i:'kettle'},
{id:7,n:'Microwave 25L',p:11500,c:'Kitchen',i:'microwave'},{id:8,n:'Fridge 200L',p:28900,c:'Kitchen',i:'fridge'},
{id:9,n:'Air Fryer 4L',p:9800,c:'Kitchen',i:'airfryer'},{id:10,n:'Bluetooth Speaker',p:3500,c:'Audio',i:'speaker'},
{id:11,n:'Appliance Installation (service)',p:1500,c:'Services',i:'tv'},{id:12,n:'Home Delivery (service)',p:500,c:'Services',i:'speaker'}];
let cart=JSON.parse(localStorage.getItem('wcp')||'{}'),cat='All';
const $=id=>document.getElementById(id),kes=n=>n.toLocaleString('en-KE');
function render(){const q=$('search').value.toLowerCase();
 const l=P.filter(x=>(cat==='All'||x.c===cat)&&x.n.toLowerCase().includes(q));
 $('empty').hidden=l.length>0;
 $('grid').innerHTML=l.map(x=>`<div class="card"><img src="images/${x.i}.svg" alt="${x.n}"><div><h3>${x.n}</h3><div class="price">KES ${kes(x.p)}</div><button onclick="add(${x.id})">Add to cart</button></div></div>`).join('');
 $('cats').innerHTML=['All',...new Set(P.map(x=>x.c))].map(c=>`<button class="${c===cat?'on':''}" onclick="cat='${c}';render()">${c}</button>`).join('');}
function add(id){cart[id]=(cart[id]||0)+1;save();$('cart').hidden=false}
function chg(id,d){cart[id]+=d;if(cart[id]<1)delete cart[id];save()}
function save(){localStorage.setItem('wcp',JSON.stringify(cart));drawCart()}
function drawCart(){let t=0,n=0;$('items').innerHTML=Object.keys(cart).map(id=>{const x=P.find(p=>p.id==id);t+=x.p*cart[id];n+=cart[id];
 return `<div class="row"><img src="images/${x.i}.svg" alt=""><span>${x.n}<br>KES ${kes(x.p)}</span><button onclick="chg(${id},-1)" aria-label="Less">−</button>${cart[id]}<button onclick="chg(${id},1)" aria-label="More">+</button></div>`}).join('')||'<p>Your cart is empty.</p>';
 $('total').textContent=kes(t);$('count').textContent=n;return t}
$('search').oninput=render;$('cartBtn').onclick=()=>$('cart').hidden=false;$('close').onclick=()=>$('cart').hidden=true;
$('pay').onclick=async()=>{const t=drawCart(),ph=$('phone').value.trim(),m=$('msg');
 if(!t)return m.textContent='Add something to your cart first.';
 if(!/^(07|01|2547|2541)\d{7,8}$/.test(ph))return m.textContent='Enter a valid number e.g. 0712345678.';
 m.textContent='Sending M-Pesa prompt... check your phone and enter your PIN.';
 try{const r=await fetch(API+'/api/stkpush',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:ph,amount:t})});
 const d=await r.json();m.textContent=d.ResponseCode==='0'?'Prompt sent! Complete payment on your phone.':(d.error||'Payment request failed. Try again.')}
 catch(e){m.textContent='Could not reach payment server. Try again.'}};
render();drawCart();
