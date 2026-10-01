require('dotenv').config();
const express=require('express'),cors=require('cors'),axios=require('axios');
const app=express();app.use(cors());app.use(express.json());
const {CONSUMER_KEY,CONSUMER_SECRET,SHORTCODE,PASSKEY,CALLBACK_URL,ENV}=process.env;
const BASE=ENV==='production'?'https://api.safaricom.co.ke':'https://sandbox.safaricom.co.ke';
const fmt=p=>{p=String(p).replace(/\D/g,'');return p.startsWith('0')?'254'+p.slice(1):p};
async function token(){const a=Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
 return (await axios.get(`${BASE}/oauth/v1/generate?grant_type=client_credentials`,{headers:{Authorization:`Basic ${a}`}})).data.access_token}
app.post('/api/stkpush',async(req,res)=>{try{
 const {phone,amount}=req.body;if(!phone||!(amount>0))return res.status(400).json({error:'Invalid phone or amount'});
 const ts=new Date().toISOString().replace(/\D/g,'').slice(0,14);
 const pw=Buffer.from(SHORTCODE+PASSKEY+ts).toString('base64');
 const r=await axios.post(`${BASE}/mpesa/stkpush/v1/processrequest`,{BusinessShortCode:SHORTCODE,Password:pw,Timestamp:ts,
  TransactionType:'CustomerPayBillOnline',Amount:Math.round(amount),PartyA:fmt(phone),PartyB:SHORTCODE,PhoneNumber:fmt(phone),
  CallBackURL:CALLBACK_URL,AccountReference:'WideCityPlug',TransactionDesc:'Wide City Plug order'},
  {headers:{Authorization:`Bearer ${await token()}`}});
 res.json(r.data)}catch(e){console.error(e.response?.data||e.message);res.status(500).json({error:'M-Pesa request failed'})}});
app.post('/api/callback',(req,res)=>{console.log('M-Pesa callback:',JSON.stringify(req.body));res.json({ResultCode:0,ResultDesc:'Accepted'})});
app.listen(process.env.PORT||3000,()=>console.log('Server running'));
