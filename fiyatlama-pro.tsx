import { useState, useRef, useCallback, useEffect } from "react";

const fmtN = (n, d = 2) => isNaN(n)||n===null ? "—" : new Intl.NumberFormat("tr-TR",{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);
const fmtTL = (n) => isNaN(n)||n===null ? "—" : new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",minimumFractionDigits:2}).format(n);

const DEFAULT_SETTINGS = {
  stopajTL_0_180:17.5, stopajTL_181_365:15, stopajTL_365plus:10, stopajYP_tum:25,
  bireyselKKDF:15, bireyselBSMV:15, ticariKKDF:0, ticariBSMV:5,
  zkTL_vadesiz:17, zkTL_6ay:10, zkYP_vadesiz:30, zkYP_diger:26,
  fonlamaMaliyeti:24.0,
  referansOran:3.11,
  bkmTakas:1.20,
};

const C = {
  bg:"#F5F6F8", card:"#FFFFFF",
  blue:"#2C5F8A", blueLight:"#EBF3FB",        // Soft koyu mavi - kurumsal
  green:"#3A7D5C", greenLight:"#EBF5F0",      // Soft yeşil
  orange:"#B07D2E", orangeLight:"#FBF5E8",    // Altın/soft sarı
  purple:"#5B4A8A", purpleLight:"#F0EDF8",
  red:"#B83232", pink:"#9C3060", pinkLight:"#F9ECF2",
  teal:"#2A7A72", tealLight:"#E8F5F4",
  label:"#1C2B3A", sub:"#6B7B8D", border:"#DDE3EA", sep:"#B8C4CE",
};

function Card({children,style}){return <div style={{background:C.card,borderRadius:16,padding:"14px 16px",marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,0.07)",...style}}>{children}</div>;}
function SecTitle({children}){return <p style={{fontSize:12,fontWeight:700,color:C.sub,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10,marginTop:2}}>{children}</p>;}

function formatWithDots(val){
  // val is a string possibly with dots already
  const clean = val.replace(/\./g,'').replace(/[^0-9,]/g,'');
  const parts = clean.split(',');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  return parts.join(',');
}

function parseVal(val){
  // remove dots (thousands sep), keep comma as decimal
  if(!val) return '';
  return val.replace(/\./g,'').replace(',','.');
}

function TutarField({label,value,onChange,suffix,hint}){
  const [display,setDisplay] = useState(value?formatWithDots(String(value)):'');
  const handleChange = (e)=>{
    const raw = e.target.value;
    // Allow only digits, dots (sep), comma (decimal)
    const cleaned = raw.replace(/[^0-9,]/g,'');
    const formatted = formatWithDots(cleaned);
    setDisplay(formatted);
    // send raw numeric string to parent
    onChange(parseVal(formatted));
  };
  // sync if value cleared externally
  useEffect(()=>{ if(!value) setDisplay(''); },[value]);
  return(
    <div style={{marginBottom:13}}>
      <label style={{display:"block",fontSize:12,fontWeight:600,color:C.sub,marginBottom:4}}>{label}</label>
      <div style={{position:"relative"}}>
        <input inputMode="decimal" value={display} onChange={handleChange}
          style={{width:"100%",boxSizing:"border-box",padding:suffix?"11px 40px 11px 13px":"11px 13px",
            fontSize:15,fontWeight:600,fontFamily:"monospace",background:"#F9F9FB",
            border:`1.5px solid ${C.border}`,borderRadius:10,color:"#1C1C1E",outline:"none",WebkitAppearance:"none"}}/>
        {suffix&&<span style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:C.blue,fontWeight:700,fontSize:13}}>{suffix}</span>}
      </div>
      {hint&&<p style={{margin:"3px 0 0 2px",fontSize:11,color:C.sub}}>{hint}</p>}
    </div>
  );
}

function Field({label,value,onChange,suffix,hint,type="number"}){
  // For ₺ fields use TutarField
  if(suffix==="₺" || suffix==="$"){
    return <TutarField label={label} value={value} onChange={onChange} suffix={suffix} hint={hint}/>;
  }
  return(
    <div style={{marginBottom:13}}>
      <label style={{display:"block",fontSize:12,fontWeight:600,color:C.sub,marginBottom:4}}>{label}</label>
      <div style={{position:"relative"}}>
        <input type={type} inputMode="decimal" value={value} onChange={e=>onChange(e.target.value)}
          style={{width:"100%",boxSizing:"border-box",padding:suffix?"11px 40px 11px 13px":"11px 13px",
            fontSize:15,fontWeight:600,fontFamily:"monospace",background:"#F9F9FB",
            border:`1.5px solid ${C.border}`,borderRadius:10,color:"#1C1C1E",outline:"none",WebkitAppearance:"none"}}/>
        {suffix&&<span style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:C.blue,fontWeight:700,fontSize:13}}>{suffix}</span>}
      </div>
      {hint&&<p style={{margin:"3px 0 0 2px",fontSize:11,color:C.sub}}>{hint}</p>}
    </div>
  );
}

function Seg({options,value,onChange}){
  return(
    <div style={{display:"flex",background:"#E5E5EA",borderRadius:9,padding:2,marginBottom:14}}>
      {options.map(o=>(
        <button key={o.v} onClick={()=>onChange(o.v)} style={{
          flex:1,padding:"7px 2px",borderRadius:7,border:"none",cursor:"pointer",
          background:value===o.v?C.card:"transparent",
          color:value===o.v?"#1C1C1E":C.sub,
          fontWeight:value===o.v?700:500,fontSize:12,
          boxShadow:value===o.v?"0 1px 3px rgba(0,0,0,0.12)":"none",transition:"all 0.15s",
        }}>{o.l}</button>
      ))}
    </div>
  );
}

function RRow({label,value,accent,sub,big}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
      padding:sub?"7px 0":"10px 0",borderBottom:`1px solid ${C.border}`}}>
      <span style={{fontSize:sub?12:14,color:sub?C.sub:C.label}}>{label}</span>
      <span style={{fontSize:big?19:sub?13:15,fontWeight:big?800:700,fontFamily:"monospace",color:accent||"#1C1C1E"}}>{value}</span>
    </div>
  );
}

// ─── KATILIM FONU ARAÇLARI ───────────────────────────────────────────────────

function VadeliKatilim({s}){
  const [tutar,setTutar]=useState("");
  const [gun,setGun]=useState("");
  const [oran,setOran]=useState("");
  const [doviz,setDoviz]=useState("TL");
  const [bilesik,setBilesik]=useState(false);

  const r=useCallback(()=>{
    const T=parseFloat(tutar),G=parseInt(gun),rt=parseFloat(oran);
    if(!T||!G||!rt)return null;
    const gunlukOran=rt/100/360;
    const bf=bilesik?T*(Math.pow(1+gunlukOran,G)-1):T*gunlukOran*G;
    const sOran=doviz==="TL"?(G<=180?s.stopajTL_0_180:G<=365?s.stopajTL_181_365:s.stopajTL_365plus):s.stopajYP_tum;
    const stop=bf*(sOran/100);
    const nf=bf-stop;
    const nv=T+nf;
    const ey=(nf/T)/G*360*100;
    return{bf,stop,nf,nv,ey,sOran};
  },[tutar,gun,oran,doviz,bilesik,s])();

  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Seg options={[{v:"TL",l:"TL Katılım"},{v:"YP",l:"Döviz Katılım"}]} value={doviz} onChange={setDoviz}/>
        <Field label="Katılım Tutarı" value={tutar} onChange={setTutar} suffix={doviz==="TL"?"₺":"$"}/>
        <Field label="Vade (Gün)" value={gun} onChange={setGun} suffix="Gün" hint="Örn: 32 gün, 91 gün, 182 gün, 365 gün"/>
        <Field label="Kâr Payı Oranı (Yıllık)" value={oran} onChange={setOran} suffix="%"/>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:4}}>
          <div onClick={()=>setBilesik(!bilesik)} style={{width:44,height:26,borderRadius:13,background:bilesik?C.green:"#D1D1D6",position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:bilesik?21:3,width:20,height:20,borderRadius:10,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",transition:"left 0.2s"}}/>
          </div>
          <span style={{fontSize:14,color:C.label}}>Bileşik Hesapla</span>
        </div>
      </Card>
      {r&&<Card>
        <SecTitle>Sonuçlar</SecTitle>
        <RRow label="Brüt Kâr Payı" value={fmtTL(r.bf)}/>
        <RRow label={`Stopaj (%${fmtN(r.sOran)})`} value={`- ${fmtTL(r.stop)}`} sub accent={C.red}/>
        <RRow label="Net Kâr Payı" value={fmtTL(r.nf)} accent={C.green} big/>
        <RRow label="Vade Sonu Tutar" value={fmtTL(r.nv)} accent={C.blue} big/>
        <RRow label="Efektif Net Yıllık Kâr Payı %" value={`% ${fmtN(r.ey)}`} sub/>
        <RaporButon baslik="Katılım Hesabı Getiri Analizi" satirlar={[
          {label:"Brüt Kâr Payı", value:fmtTL(r.bf)},
          {label:`Stopaj (%${fmtN(r.sOran)})`, value:`- ${fmtTL(r.stop)}`},
          {label:"Net Kâr Payı", value:fmtTL(r.nf)},
          {label:"Vade Sonu Tutar", value:fmtTL(r.nv)},
          {label:"Efektif Net Yıllık %", value:`% ${fmtN(r.ey)}`},
        ]}/>
      </Card>}
    </div>
  );
}

function GetiridenAnapara({s}){
  const [hedefGetiri,setHedefGetiri]=useState("");
  const [gun,setGun]=useState("");
  const [oran,setOran]=useState("");
  const [tip,setTip]=useState("yillik");

  const r=useCallback(()=>{
    const G2=parseFloat(hedefGetiri),GUN=parseInt(gun),rt=parseFloat(oran);
    if(!G2||!GUN||!rt)return null;
    const go=tip==="yillik"?rt/100/360:rt/100;
    const sOran=GUN<=180?s.stopajTL_0_180:GUN<=365?s.stopajTL_181_365:s.stopajTL_365plus;
    const netOran=go*GUN*(1-sOran/100);
    const anapara=G2/netOran;
    const bf=anapara*go*GUN;
    const stop=bf*(sOran/100);
    return{anapara,bf,stop,netKarPayi:G2,sOran};
  },[hedefGetiri,gun,oran,tip,s])();

  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Seg options={[{v:"aylik",l:"Günlük %"},{v:"yillik",l:"Yıllık %"}]} value={tip} onChange={setTip}/>
        <Field label="Hedef Net Kâr Payı (₺)" value={hedefGetiri} onChange={setHedefGetiri} suffix="₺"/>
        <Field label="Vade (Gün)" value={gun} onChange={setGun} suffix="Gün"/>
        <Field label="Kâr Payı Oranı (Yıllık)" value={oran} onChange={setOran} suffix="%"/>
      </Card>
      {r&&<Card>
        <SecTitle>Gerekli Anapara</SecTitle>
        <RRow label="Gerekli Anapara" value={fmtTL(r.anapara)} accent={C.blue} big/>
        <RRow label="Brüt Kâr Payı" value={fmtTL(r.bf)}/>
        <RRow label={`Stopaj (%${fmtN(r.sOran)})`} value={`- ${fmtTL(r.stop)}`} sub accent={C.red}/>
        <RRow label="Net Kâr Payı" value={fmtTL(r.netKarPayi)} accent={C.green} big/>
      </Card>}
    </div>
  );
}

function OranAnalizi({s}){
  const [tutar,setTutar]=useState("");
  const [gun,setGun]=useState("");
  const [netGetiri,setNetGetiri]=useState("");

  const r=useCallback(()=>{
    const T=parseFloat(tutar),G=parseInt(gun),KP=parseFloat(netGetiri);
    if(!T||!G||!KP)return null;
    const sOran=G<=180?s.stopajTL_0_180:G<=365?s.stopajTL_181_365:s.stopajTL_365plus;
    const netGunluk=(KP/T)/G*100;
    const brutGunluk=netGunluk/(1-sOran/100);
    return{netGunluk,brutGunluk,brutYillik:brutGunluk*365,netYillik:netGunluk*365,sOran};
  },[tutar,gun,netGetiri,s])();

  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Field label="Anapara" value={tutar} onChange={setTutar} suffix="₺"/>
        <Field label="Vade (Gün)" value={gun} onChange={setGun} suffix="Gün"/>
        <Field label="Net Kâr Payı (₺)" value={netGetiri} onChange={setNetGetiri} suffix="₺" hint="Aldığınız net kâr payı tutarı"/>
      </Card>
      {r&&<Card>
        <SecTitle>Oran Analizi</SecTitle>
        <RRow label="Brüt Günlük Oran" value={`% ${fmtN(r.brutGunluk,4)}`} sub/>
        <RRow label="Brüt Yıllık Oran" value={`% ${fmtN(r.brutYillik)}`} big/>
        <RRow label="Net Günlük Oran" value={`% ${fmtN(r.netGunluk,4)}`} sub/>
        <RRow label="Net Yıllık Oran" value={`% ${fmtN(r.netYillik)}`} accent={C.green}/>
        <RRow label={`Stopaj Oranı`} value={`% ${fmtN(r.sOran)}`} sub/>
      </Card>}
    </div>
  );
}

function BirikimHesapla({s}){
  const [hedef,setHedef]=useState("");
  const [sure,setSure]=useState("");
  const [oran,setOran]=useState("");
  const [baslangic,setBaslangic]=useState("");

  const r=useCallback(()=>{
    const H=parseFloat(hedef),GUN=parseInt(sure),rt=parseFloat(oran)/100/365,B=parseFloat(baslangic)||0;
    if(!H||!GUN||!rt)return null;
    const fvB=B*Math.pow(1+rt,GUN);
    const kalan=H-fvB;
    const gunlukKatki=kalan>0?kalan*(rt*Math.pow(1+rt,GUN))/(Math.pow(1+rt,GUN)-1):0;
    const toplamKatki=gunlukKatki*GUN+B;
    const toplamGetiri=H-toplamKatki;
    const sOran=GUN<=180?s.stopajTL_0_180:GUN<=365?s.stopajTL_181_365:s.stopajTL_365plus;
    const netGetiri=toplamGetiri*(1-sOran/100);
    return{gunlukKatki,toplamKatki,toplamGetiri,netGetiri,sOran};
  },[hedef,sure,oran,baslangic,s])();

  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Field label="Hedef Tutar" value={hedef} onChange={setHedef} suffix="₺"/>
        <Field label="Süre (Gün)" value={sure} onChange={setSure} suffix="Gün"/>
        <Field label="Yıllık Kâr Payı Oranı" value={oran} onChange={setOran} suffix="%"/>
        <Field label="Başlangıç Birikimi (Opsiyonel)" value={baslangic} onChange={setBaslangic} suffix="₺"/>
      </Card>
      {r&&<Card>
        <SecTitle>Birikim Planı</SecTitle>
        <RRow label="Günlük Katkı Payı" value={fmtTL(r.gunlukKatki)} accent={C.blue} big/>
        <RRow label="Toplam Katkı" value={fmtTL(r.toplamKatki)}/>
        <RRow label="Brüt Kâr Payı Getirisi" value={fmtTL(r.toplamGetiri)}/>
        <RRow label={`Stopaj (%${fmtN(r.sOran)})`} value={`- ${fmtTL(r.toplamGetiri*(r.sOran/100))}`} sub accent={C.red}/>
        <RRow label="Net Kâr Payı Getirisi" value={fmtTL(r.netGetiri)} accent={C.green}/>
      </Card>}
    </div>
  );
}

// ─── FİNANSMAN ARAÇLARI ─────────────────────────────────────────────────────

function OdemePlani({plan, bsmvOran, kkdfOran, onClose}){
  const bsmv=bsmvOran||0, kkdf=kkdfOran||0;
  const hasBsmv=bsmv>0, hasKkdf=kkdf>0, hasTax=(bsmv+kkdf)>0;
  const MONTHS=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const now=new Date();
  const getTarih=(idx)=>{const tot=now.getMonth()+1+idx;return MONTHS[tot%12]+' '+(now.getFullYear()+Math.floor(tot/12));};
  const totTaksit=plan.reduce((a,r)=>a+r.toplam,0);
  const totAna=plan.reduce((a,r)=>a+r.anapara,0);
  const totKar=plan.reduce((a,r)=>a+r.karPayi,0);
  const totBsmv=plan.reduce((a,r)=>a+r.karPayi*(bsmv/100),0);
  const totKkdf=plan.reduce((a,r)=>a+r.karPayi*(kkdf/100),0);
  const thStyle={padding:"8px 8px",color:"#fff",fontWeight:700,fontSize:10,whiteSpace:"nowrap",textAlign:"right",background:"#1C3A5E",letterSpacing:"0.04em"};
  const tdStyle=(color)=>({padding:"7px 8px",fontFamily:"monospace",fontSize:11,textAlign:"right",color:color||"#1C1C1E",whiteSpace:"nowrap"});
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{fontSize:16,fontWeight:800,color:C.label}}>📅 Aylık Ödeme Planı</span>
          <button onClick={onClose} style={{background:"#F0F0F0",border:"none",width:32,height:32,borderRadius:16,fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
          <div style={{flex:1,padding:"10px 14px",borderRight:`1px solid ${C.border}`}}>
            <p style={{margin:0,fontSize:9,fontWeight:700,color:C.sub,letterSpacing:"0.06em"}}>TOPLAM TAKSİT</p>
            <p style={{margin:"2px 0 0",fontSize:14,fontWeight:800,color:C.blue}}>{fmtTL(totTaksit)}</p>
          </div>
          <div style={{flex:1,padding:"10px 14px",borderRight:`1px solid ${C.border}`}}>
            <p style={{margin:0,fontSize:9,fontWeight:700,color:C.sub,letterSpacing:"0.06em"}}>KÂR PAYI</p>
            <p style={{margin:"2px 0 0",fontSize:14,fontWeight:800,color:C.orange}}>{fmtTL(totKar)}</p>
          </div>
          {hasTax&&<div style={{flex:1,padding:"10px 14px"}}>
            <p style={{margin:0,fontSize:9,fontWeight:700,color:C.sub,letterSpacing:"0.06em"}}>VERGİ</p>
            <p style={{margin:"2px 0 0",fontSize:14,fontWeight:800,color:C.red}}>{fmtTL(totBsmv+totKkdf)}</p>
          </div>}
        </div>
        <div style={{flex:1,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
          <table style={{borderCollapse:"collapse",width:"100%",minWidth:hasTax?520:400}}>
            <thead>
              <tr>
                <th style={{...thStyle,textAlign:"left"}}>No</th>
                <th style={{...thStyle,textAlign:"left"}}>Tarih</th>
                <th style={thStyle}>Taksit</th>
                <th style={thStyle}>Anapara</th>
                <th style={thStyle}>Kâr Payı</th>
                {hasBsmv&&<th style={thStyle}>BSMV%{bsmv}</th>}
                {hasKkdf&&<th style={thStyle}>KKDF%{kkdf}</th>}
                <th style={thStyle}>Kalan</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((row,i)=>(
                <tr key={i} style={{background:i%2===0?"#fff":"#F6F8FA",borderBottom:`1px solid ${C.border}`}}>
                  <td style={{...tdStyle(C.blue),textAlign:"left",fontWeight:700}}>{row.ay}</td>
                  <td style={{...tdStyle(C.label),textAlign:"left",fontFamily:"inherit",fontSize:11}}>{getTarih(i)}</td>
                  <td style={{...tdStyle(),fontWeight:700}}>{fmtN(row.toplam,2)}</td>
                  <td style={tdStyle(C.sub)}>{fmtN(row.anapara,2)}</td>
                  <td style={tdStyle(C.orange)}>{fmtN(row.karPayi,2)}</td>
                  {hasBsmv&&<td style={tdStyle(C.red)}>{fmtN(row.karPayi*(bsmv/100),2)}</td>}
                  {hasKkdf&&<td style={tdStyle("#9C3060")}>{fmtN(row.karPayi*(kkdf/100),2)}</td>}
                  <td style={tdStyle(C.sub)}>{fmtN(row.bakiye,2)}</td>
                </tr>
              ))}
              <tr style={{background:"#EBF3FB",borderTop:`2px solid ${C.blue}`}}>
                <td style={{...tdStyle(C.blue),textAlign:"left",fontWeight:800}}>∑</td>
                <td style={{...tdStyle(C.label),textAlign:"left",fontFamily:"inherit",fontWeight:800}}>TOPLAM</td>
                <td style={{...tdStyle(),fontWeight:800}}>{fmtN(totTaksit,2)}</td>
                <td style={{...tdStyle(C.sub),fontWeight:800}}>{fmtN(totAna,2)}</td>
                <td style={{...tdStyle(C.orange),fontWeight:800}}>{fmtN(totKar,2)}</td>
                {hasBsmv&&<td style={{...tdStyle(C.red),fontWeight:800}}>{fmtN(totBsmv,2)}</td>}
                {hasKkdf&&<td style={{...tdStyle("#9C3060"),fontWeight:800}}>{fmtN(totKkdf,2)}</td>}
                <td style={{...tdStyle(C.sub),fontWeight:800}}>0,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function hesaplaOdemePlani(T, V, ao, bsmvOran, kkdfOran){
  const bsmv=(bsmvOran||0)/100;
  const kkdf=(kkdfOran||0)/100;
  const vergiOran=bsmv+kkdf;

  // Net PMT (anapara + kâr payı) - sabit
  const pmt = ao===0 ? T/V : T*ao/(1-Math.pow(1+ao,-V));
  const pmtFixed = Math.round(pmt*100)/100;

  // Sabit vergi: ilk ay kâr payı üzerinden — her ay aynı toplam taksit için
  const ilkAyKarPayi = Math.round(T*ao*100)/100;
  const sabitVergi = Math.round(ilkAyKarPayi*vergiOran*100)/100;
  // TOPLAM SABİT TAKSİT = her ay aynı
  const toplamSabitTaksit = Math.round((pmtFixed+sabitVergi)*100)/100;

  const plan=[];
  let bakiye=Math.round(T*100)/100;

  for(let i=1;i<=V;i++){
    const karPayi = Math.round(bakiye*ao*100)/100;
    const anapara = Math.round((pmtFixed-karPayi)*100)/100;
    const vergi   = Math.round(karPayi*vergiOran*100)/100;
    bakiye = Math.max(0, Math.round((bakiye-anapara)*100)/100);
    plan.push({ay:i, karPayi, anapara, vergi,
      toplam: toplamSabitTaksit,  // her ay SABİT
      bakiye});
  }
  // toplamSabitTaksit'i dışarı da döndür
  plan._toplamSabitTaksit = toplamSabitTaksit;
  return plan;
}

// ─── RAPOR / PAYLAŞ ──────────────────────────────────────────────────────────
// ─── RAPOR ÖNİZLEME + PAYLAŞ ────────────────────────────────────────────────
function RaporModal({baslik, satirlar, plan, onClose}){
  const [kopyalandi, setKopyalandi] = useState(false);
  const [onizleme, setOnizleme] = useState(false);
  const tarih = new Date().toLocaleString("tr-TR");
  const fmt=(n)=>n==null?"—":new Intl.NumberFormat("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);

  const metin = [
    baslik, `Tarih: ${tarih}`, "---",
    ...satirlar.filter(s=>s?.label).map(s=>`${s.label}: ${s.value}`),
    "---",
    plan&&plan.length>0 ? `Odeme Plani (${plan.length} taksit):\n`+plan.map((r,i)=>`  ${i+1}. ay — Taksit: ${fmt(r.toplam)} TL — Kalan: ${fmt(r.bakiye)} TL`).join("\n") : "",
    "---",
    "Bu hesaplamalar bilgilendirme amaclidir; kesin teklif belgesi niteligi tasimazlar.",
  ].filter(Boolean).join("\n");

  const kopyala=()=>{
    navigator.clipboard.writeText(metin).catch(()=>{
      const ta=document.createElement("textarea");
      ta.value=metin; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    });
    setKopyalandi(true); setTimeout(()=>setKopyalandi(false),2000);
  };

  const [paylasıldı, setPaylasıldı] = useState(false);

  const paylas=()=>{
    const ta=document.createElement("textarea");
    ta.value=metin; ta.style.position="fixed"; ta.style.opacity="0";
    document.body.appendChild(ta); ta.focus(); ta.select();
    try{ document.execCommand("copy"); }catch(e){}
    document.body.removeChild(ta);
    navigator.clipboard?.writeText(metin).catch(()=>{});
    setPaylasıldı(true);
    setTimeout(()=>setPaylasıldı(false), 4000);
  };

  // Tam ekran önizleme
  if(onizleme){
    return(
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"#F0F2F5",zIndex:400,overflowY:"auto"}}>
        {/* Önizleme araç çubuğu */}
        <div style={{position:"sticky",top:0,zIndex:10,background:"#1C3A5E",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button onClick={()=>setOnizleme(false)} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",padding:"7px 14px",borderRadius:20,fontSize:13,fontWeight:700,cursor:"pointer"}}>← Geri</button>
          <span style={{color:"#fff",fontSize:13,fontWeight:700}}>Önizleme</span>
          <button onClick={paylas} style={{background:paylasıldı?"#34C759":"#34C759",border:"none",color:"#fff",padding:"7px 16px",borderRadius:20,fontSize:13,fontWeight:700,cursor:"pointer"}}>
            {paylasıldı ? "✅ Kopyalandı!" : "📋 Kopyala"}
          </button>
        </div>

        {/* Rapor kartı */}
        <div style={{maxWidth:480,margin:"16px auto",background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          {/* Başlık bandı */}
          <div style={{background:"#1C3A5E",padding:"18px 20px 14px"}}>
            <p style={{margin:"0 0 4px",fontSize:16,color:"#fff",fontWeight:800}}>{baslik}</p>
            <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.6)"}}>{tarih}</p>
          </div>

          {/* Özet satırları */}
          <div style={{padding:"4px 0"}}>
            {satirlar.filter(s=>s?.label).map((s,i)=>(
              <div key={i} style={{
                display:"flex",justifyContent:"space-between",alignItems:"center",
                padding: s.big ? "12px 20px" : "9px 20px",
                background: s.big ? "#EBF3FB" : i%2===0?"#FAFBFC":"#fff",
                borderBottom:"1px solid #F0F0F0"
              }}>
                <span style={{fontSize: s.big?13:12, color: s.big?"#1C3A5E":"#6B7280", fontWeight: s.big?700:500}}>{s.label}</span>
                <span style={{fontSize: s.big?15:13, color: s.big?"#1C3A5E":"#1a1a1a", fontWeight: s.big?900:600, fontFamily:"monospace"}}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Ödeme planı */}
          {plan && plan.length>0 && (
            <div style={{borderTop:"2px solid #1C3A5E"}}>
              <div style={{background:"#1C3A5E",padding:"10px 20px"}}>
                <p style={{margin:0,fontSize:12,fontWeight:700,color:"#fff"}}>📋 Ödeme Planı — {plan.length} Taksit</p>
              </div>
              {/* Tablo başlığı */}
              <div style={{display:"grid",gridTemplateColumns:"40px 1fr 1fr 1fr 1fr",background:"#EBF3FB",padding:"7px 12px",borderBottom:"1px solid #D1E0EF"}}>
                {["Ay","Taksit","Kâr Payı","Anapara","Kalan"].map((h,i)=>(
                  <span key={i} style={{fontSize:10,fontWeight:700,color:"#1C3A5E",textAlign:i>0?"right":"center"}}>{h}</span>
                ))}
              </div>
              {/* Tablo satırları */}
              <div style={{maxHeight:320,overflowY:"auto"}}>
                {plan.map((r,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"40px 1fr 1fr 1fr 1fr",padding:"6px 12px",background:i%2===0?"#F8FAFB":"#fff",borderBottom:"1px solid #F0F0F0"}}>
                    <span style={{fontSize:10,color:"#6B7280",textAlign:"center",fontWeight:600}}>{r.ay||i+1}</span>
                    {[r.toplam, r.karPayi||r.faiz, r.anapara, r.bakiye].map((v,vi)=>(
                      <span key={vi} style={{fontSize:10,color:"#1a1a1a",textAlign:"right",fontFamily:"monospace"}}>{fmt(v)}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Yasal uyarı */}
          <div style={{padding:"12px 20px",background:"#F9F9FB",borderTop:"1px solid #E5E7EB"}}>
            <p style={{margin:0,fontSize:10,color:"#9CA3AF",fontStyle:"italic",lineHeight:1.5}}>
              Bu hesaplamalar yalnızca bilgilendirme amaçlıdır; kesin teklif, resmi belge veya hukuki taahhüt niteliği taşımaz. Nihai oranlar için yetkili biriminizle iletişime geçiniz.
            </p>
          </div>
        </div>

        <div style={{maxWidth:480,margin:"0 auto 32px",padding:"0 16px"}}>
          <button onClick={paylas} style={{
            width:"100%",padding:"15px",borderRadius:14,border:"none",
            background:paylasıldı?"#34C759":"#1C3A5E",color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer",
            transition:"background 0.3s",
            boxShadow:paylasıldı?"0 4px 14px rgba(52,199,89,0.4)":"0 4px 14px rgba(28,58,94,0.3)"
          }}>
            {paylasıldı ? "✅ Metin Kopyalandı!" : "📋 Metni Kopyala"}
          </button>
          {paylasıldı && (
            <div style={{marginTop:12,background:"#F0FDF4",borderRadius:12,padding:"12px 16px",border:"1px solid #86EFAC"}}>
              <p style={{margin:"0 0 4px",fontSize:13,fontWeight:700,color:"#166534"}}>✅ Rapor metni kopyalandı!</p>
              <p style={{margin:0,fontSize:12,color:"#166534",lineHeight:1.5}}>
                Şimdi WhatsApp, Mail veya istediğiniz uygulamayı açıp <strong>yapıştırın (uzun bas → Yapıştır)</strong>.
              </p>
            </div>
          )}
          <p style={{margin:"10px 0 0",fontSize:11,color:"#9CA3AF",textAlign:"center",lineHeight:1.5}}>
            Kopyalanan metni WhatsApp, Mail veya başka bir uygulamaya yapıştırabilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  // Ana modal (özet)
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:300,display:"flex",alignItems:"flex-end"}}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"80vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{fontSize:16,fontWeight:800,color:C.label}}>📤 Rapor / Paylaş</span>
          <button onClick={onClose} style={{background:"#F0F0F0",border:"none",width:32,height:32,borderRadius:16,fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"14px 18px"}}>
          {satirlar.filter(s=>s?.label).map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:13,color:C.sub}}>{s.label}</span>
              <span style={{fontSize:13,fontWeight:s.big?800:600,color:s.big?C.blue:C.label}}>{s.value}</span>
            </div>
          ))}
          {plan&&plan.length>0&&(
            <div style={{marginTop:12,background:C.blueLight,borderRadius:10,padding:"10px 12px"}}>
              <p style={{margin:0,fontSize:12,color:C.blue,fontWeight:700}}>📋 {plan.length} satır ödeme planı önizlemede gösterilecek</p>
            </div>
          )}
        </div>
        <div style={{padding:"12px 18px 28px",display:"flex",gap:10,flexShrink:0}}>
          <button onClick={kopyala} style={{
            flex:1,padding:"13px",borderRadius:12,
            border:`1.5px solid ${C.border}`,
            background:kopyalandi?"#F0FDF4":"#F9F9FB",
            color:kopyalandi?C.green:C.label,
            fontWeight:700,fontSize:14,cursor:"pointer"
          }}>
            {kopyalandi?"✅ Kopyalandı!":"📋 Metin Kopyala"}
          </button>
          <button onClick={()=>setOnizleme(true)} style={{
            flex:2,padding:"13px",borderRadius:12,border:"none",
            background:C.blue,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"
          }}>
            👁 Önizle & Paylaş
          </button>
        </div>
      </div>
    </div>
  );
}

function RaporButon({baslik, satirlar, plan}){
  const [show, setShow] = useState(false);
  return(
    <>
      {show && <RaporModal baslik={baslik} satirlar={satirlar} plan={plan} onClose={()=>setShow(false)}/>}
      <button onClick={()=>setShow(true)} style={{
        width:"100%",marginTop:8,padding:"12px",borderRadius:12,
        border:`1.5px solid ${C.purple}`,background:C.purpleLight,
        color:C.purple,fontWeight:700,fontSize:14,cursor:"pointer"
      }}>
        📤 Rapor / Paylaş
      </button>
    </>
  );
}

// ─── ERKEN KAPAMA MODALI ─────────────────────────────────────────────────────
function ErkenKapamaModal({plan, faizOrani, onClose}){
  const [kapamaAyi, setKapamaAyi] = useState("");
  const [krediTarihi, setKrediTarihi] = useState("sonrasi2024"); // hangi dönem
  const [faizTipi, setFaizTipi] = useState("sabit"); // sabit / degisken
  const [dovizTipi, setDovizTipi] = useState("TL"); // TL / YP

  const ayNum = parseInt(kapamaAyi)||0;
  const row = plan && ayNum>=1 && ayNum<=plan.length ? plan[ayNum-1] : null;
  const kalanBakiye = row ? row.bakiye : null;
  const kalanAySayisi = row ? plan.length - ayNum : null;
  const odenenToplam = plan ? plan.slice(0,ayNum).reduce((a,r)=>a+r.toplam,0) : 0;

  // Tebliğ 2020/4 Madde 11 & Geçici Maddeler
  const cezaHesapla = ()=>{
    if(!kalanBakiye || kalanBakiye<=0) return null;
    const kalanAy = kalanAySayisi || 0;

    if(faizTipi === "degisken"){
      // Tüm dönemler: değişken faizli → %2
      const oran = 0.02;
      const ceza = kalanBakiye * oran;
      return { oran: oran*100, ceza, aciklama: "Değişken faizli kredi — erken ödenen tutarın %2'si (Madde 11/3)" };
    }

    // Sabit faizli
    if(krediTarihi === "oncesi2021"){
      // Geçici Madde 5/1: 01.03.2021 öncesi
      const oran = kalanAy <= 24 ? 0.01 : 0.02;
      const ceza = kalanBakiye * oran;
      const ypEk = dovizTipi === "YP" ? kalanBakiye * 0.01 : 0;
      return {
        oran: (oran + (dovizTipi==="YP"?0.01:0))*100,
        ceza: ceza + ypEk,
        aciklama: `01.03.2021 öncesi — kalan vade ${kalanAy} ay → %${oran*100}${dovizTipi==="YP"?" + %1 YP ek":""} (Geçici Madde 5/1)`
      };
    }

    if(krediTarihi === "arasi"){
      // Geçici Madde 5/2: 01.03.2021–30.06.2024 arası
      let oran = 0.02;
      if(kalanAy > 24){
        const ilave = Math.ceil((kalanAy - 24) / 12);
        oran = 0.02 + (ilave * 0.01);
      }
      const ypEk = dovizTipi === "YP" ? 0.01 : 0;
      const toplamOran = oran + ypEk;
      const ceza = kalanBakiye * toplamOran;
      return {
        oran: toplamOran*100,
        ceza,
        aciklama: `01.03.2021–30.06.2024 arası — kalan vade ${kalanAy} ay → %${(oran*100).toFixed(0)}${ypEk?` + %1 YP ek`:""} (Geçici Madde 5/2)`
      };
    }

    // sonrasi2024: 30.06.2024 sonrası — Madde 11/3
    // Sabit TL: MB formülü uygulanır — pratikte azami %2 kabul edilir
    // Sabit YP: belirli sabit oran × kalan vade (MB talimatına göre)
    if(dovizTipi === "YP"){
      const aciklama = "Sabit YP — MB Talimatı formülüne tabidir (Madde 11/3)";
      return { oran: null, ceza: null, aciklama };
    }
    // TL sabit: MB formülü — yaklaşık %2 azami göster
    const ceza = kalanBakiye * 0.02;
    return {
      oran: "≤ MB Formülü",
      ceza,
      aciklama: "30.06.2024 sonrası sabit TL — MB formülüyle hesaplanan orana kadar (Madde 11/3); azami %2 gösterilmiştir"
    };
  };

  const sonuc = row ? cezaHesapla() : null;

  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"90vh",overflowY:"auto",padding:"20px 18px 36px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontSize:16,fontWeight:800,color:C.label}}>⚡ Erken Kapama Hesabı</span>
          <button onClick={onClose} style={{background:"#F0F0F0",border:"none",width:32,height:32,borderRadius:16,fontSize:20,cursor:"pointer"}}>×</button>
        </div>

        {/* Kredi dönemi */}
        <p style={{margin:"0 0 6px",fontSize:12,fontWeight:600,color:C.sub}}>Kredi Kullandırım Tarihi</p>
        <Seg options={[
          {v:"oncesi2021", l:"01.03.2021 Öncesi"},
          {v:"arasi",      l:"03.2021–06.2024"},
          {v:"sonrasi2024",l:"30.06.2024 Sonrası"},
        ]} value={krediTarihi} onChange={setKrediTarihi}/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          <div>
            <p style={{margin:"0 0 6px",fontSize:12,fontWeight:600,color:C.sub}}>Faiz Tipi</p>
            <Seg options={[{v:"sabit",l:"Sabit"},{v:"degisken",l:"Değişken"}]} value={faizTipi} onChange={setFaizTipi}/>
          </div>
          <div>
            <p style={{margin:"0 0 6px",fontSize:12,fontWeight:600,color:C.sub}}>Para Birimi</p>
            <Seg options={[{v:"TL",l:"TL"},{v:"YP",l:"YP/Döviz"}]} value={dovizTipi} onChange={setDovizTipi}/>
          </div>
        </div>

        <Field label="Kaçıncı ayda kapanıyor?" value={kapamaAyi} onChange={setKapamaAyi} suffix="Ay" hint={plan?`Toplam vade: ${plan.length} ay`:""}/>

        {row && (
          <>
            {/* Kalan anapara */}
            <div style={{background:C.blueLight,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
              <p style={{margin:"0 0 4px",fontSize:12,color:C.sub,fontWeight:600}}>{ayNum}. AY SONU KALAN ANAPARA</p>
              <p style={{margin:0,fontSize:26,fontWeight:900,color:C.blue,fontFamily:"monospace"}}>{fmtTL(kalanBakiye)}</p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div style={{background:"#F9F9FB",borderRadius:10,padding:"11px 13px"}}>
                <p style={{margin:"0 0 2px",fontSize:11,color:C.sub,fontWeight:600}}>Ödenen Taksit</p>
                <p style={{margin:0,fontSize:17,fontWeight:800,color:C.label}}>{ayNum} ay</p>
              </div>
              <div style={{background:"#F9F9FB",borderRadius:10,padding:"11px 13px"}}>
                <p style={{margin:"0 0 2px",fontSize:11,color:C.sub,fontWeight:600}}>Kalan Vade</p>
                <p style={{margin:0,fontSize:17,fontWeight:800,color:C.orange}}>{kalanAySayisi} ay</p>
              </div>
            </div>

            {/* Erken ödeme cezası */}
            {sonuc && (
              <div style={{background: sonuc.ceza!=null ? "#FFF8EC" : "#F0F4F8", borderRadius:12, padding:"14px 16px", marginBottom:10, border:`1.5px solid ${sonuc.ceza!=null ? C.orange : C.border}`}}>
                <p style={{margin:"0 0 4px",fontSize:11,color:C.sub,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                  Erken Ödeme Ücreti (Tebliğ 2020/4)
                </p>
                {sonuc.ceza != null ? (
                  <>
                    <p style={{margin:"0 0 2px",fontSize:22,fontWeight:900,color:C.orange,fontFamily:"monospace"}}>{fmtTL(sonuc.ceza)}</p>
                    <p style={{margin:"2px 0 0",fontSize:12,color:C.sub}}>Oran: %{typeof sonuc.oran==="number"?sonuc.oran.toFixed(2):sonuc.oran}</p>
                  </>
                ) : (
                  <p style={{margin:0,fontSize:13,fontWeight:700,color:C.sub}}>MB Talimatı formülüne göre ayrıca hesaplanmalı</p>
                )}
                <p style={{margin:"6px 0 0",fontSize:11,color:C.sub,lineHeight:1.5}}>{sonuc.aciklama}</p>
              </div>
            )}

            {/* Toplam kapama maliyeti */}
            {sonuc?.ceza != null && (
              <div style={{background:C.greenLight,borderRadius:10,padding:"11px 14px",border:`1px solid ${C.green}`}}>
                <p style={{margin:0,fontSize:13,color:C.green,fontWeight:700}}>
                  ✅ Toplam kapama: <strong>{fmtTL(odenenToplam + kalanBakiye + sonuc.ceza)}</strong>
                </p>
                <p style={{margin:"4px 0 0",fontSize:11,color:C.sub}}>{ayNum} taksit + kalan anapara + erken ödeme ücreti</p>
              </div>
            )}
            {sonuc?.ceza == null && kalanBakiye != null && (
              <div style={{background:C.greenLight,borderRadius:10,padding:"11px 14px",border:`1px solid ${C.green}`}}>
                <p style={{margin:0,fontSize:13,color:C.green,fontWeight:700}}>
                  ✅ Kalan anapara + {ayNum} taksit: <strong>{fmtTL(odenenToplam + kalanBakiye)}</strong>
                </p>
                <p style={{margin:"4px 0 0",fontSize:11,color:C.sub}}>Ceza ayrıca MB formülüyle hesaplanacak</p>
              </div>
            )}
          </>
        )}
        {kapamaAyi && !row && (
          <div style={{background:"#FEF2F2",borderRadius:10,padding:"11px 14px"}}>
            <p style={{margin:0,fontSize:13,color:C.red,fontWeight:700}}>⛔ Geçersiz ay — lütfen 1 ile {plan?.length||"?"} arasında girin</p>
          </div>
        )}
      </div>
    </div>
  );
}

function KonutFinansman({s}){
  const [tutar,setTutar]=useState("");
  const [vade,setVade]=useState("");
  const [oran,setOran]=useState("");
  const [tip,setTip]=useState("yillik");
  const [deger,setDeger]=useState("");
  const [enerji,setEnerji]=useState("AB");
  const [ilkEv,setIlkEv]=useState(false);
  const [showPlan,setShowPlan]=useState(false);
  const [showErken,setShowErken]=useState(false);

  const getLTV=(d,e)=>{
    if(d<=5000000)  return e==="AB"?90:e==="C"?80:70;
    if(d<=7000000)  return e==="AB"?80:e==="C"?70:60;
    if(d<=10000000) return e==="AB"?70:e==="C"?60:50;
    if(d<=20000000) return e==="AB"?50:e==="C"?40:30;
    return e==="AB"?40:e==="C"?30:20;
  };

  const r=useCallback(()=>{
    const T=parseFloat(tutar),V=parseInt(vade),rt=parseFloat(oran);
    if(!T||!V||!rt)return null;
    const ao=tip==="yillik"?rt/12/100:rt/100;
    if(deger){
      const D=parseFloat(deger);
      const maxLTV=getLTV(D,enerji);
      const maxFin=Math.round(D*(maxLTV/100));
      if(T>maxFin) return{ltvAsim:true,maxFin,maxLTV,gercekLTV:(T/D)*100};
    }
    // İlk evde BSMV ve KKDF yok
    const bsmvR=ilkEv?0:s.bireyselBSMV;
    const kkdfR=ilkEv?0:s.bireyselKKDF;
    const pmt=ao===0?T/V:T*ao/(1-Math.pow(1+ao,-V));
    const toplamNet=pmt*V;
    const toplamKarPayi=toplamNet-T;
    const bsmvTL=toplamKarPayi*(bsmvR/100);
    const kkdfTL=toplamKarPayi*(kkdfR/100);
    const musteriFark=toplamKarPayi+bsmvTL+kkdfTL;
    const ltvSonuc=deger?{gercekLTV:(T/parseFloat(deger))*100,maxLTV:getLTV(parseFloat(deger),enerji)}:null;
    const plan=hesaplaOdemePlani(T,V,ao,bsmvR,kkdfR);
    const aylikTaksit=plan._toplamSabitTaksit||pmt;
    const toplamMaliyet=Math.round(aylikTaksit*V*100)/100;
    return{pmt,aylikTaksit,toplamNet,toplamKarPayi,bsmvTL,kkdfTL,toplamMaliyet,ltvSonuc,plan,bsmvR,kkdfR};
  },[tutar,vade,oran,tip,deger,enerji,ilkEv,s])();

  const degerNum=parseFloat(deger)||0;
  const maxLTV=getLTV(degerNum,enerji);

  return(
    <div style={{padding:"0 16px 32px"}}>
      {showPlan&&r?.plan&&<OdemePlani plan={r.plan} bsmvOran={r.bsmvR} kkdfOran={r.kkdfR} onClose={()=>setShowPlan(false)}/>}
      {showErken&&r?.plan&&<ErkenKapamaModal plan={r.plan} onClose={()=>setShowErken(false)}/>}
      <Card>
        <Seg options={[{v:"aylik",l:"Aylık %"},{v:"yillik",l:"Yıllık %"}]} value={tip} onChange={setTip}/>
        <Field label="Finansman Tutarı" value={tutar} onChange={setTutar} suffix="₺"/>
        <Field label="Vade (Ay)" value={vade} onChange={setVade} suffix="Ay"/>
        <Field label={`Kâr Payı Oranı (${tip==="yillik"?"Yıllık":"Aylık"})`} value={oran} onChange={setOran} suffix="%"/>
        {/* İlk Ev toggle */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"10px 12px",background:ilkEv?C.greenLight:"#F9F9FB",borderRadius:10,border:`1px solid ${ilkEv?C.green:C.border}`}}>
          <div onClick={()=>setIlkEv(!ilkEv)} style={{width:44,height:26,borderRadius:13,background:ilkEv?C.green:"#D1D1D6",position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:ilkEv?21:3,width:20,height:20,borderRadius:10,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",transition:"left 0.2s"}}/>
          </div>
          <div>
            <p style={{margin:0,fontSize:13,fontWeight:700,color:ilkEv?C.green:C.label}}>İlk Evim</p>
            <p style={{margin:0,fontSize:11,color:C.sub}}>{ilkEv?"BSMV ve KKDF uygulanmaz":"BSMV ve KKDF uygulanır"}</p>
          </div>
        </div>
        <Field label="Konut Değeri (LTV için)" value={deger} onChange={setDeger} suffix="₺"/>
        {deger&&<>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:C.sub,marginBottom:6}}>Enerji Sınıfı</label>
          <Seg options={[{v:"AB",l:"A-B Enerji"},{v:"C",l:"C Enerji"},{v:"diger",l:"Diğer"}]} value={enerji} onChange={setEnerji}/>
          <div style={{background:C.blueLight,borderRadius:10,padding:"10px 12px",marginBottom:4}}>
            <p style={{margin:0,fontSize:12,color:C.blue,fontWeight:700}}>BDDK Azami LTV: %{maxLTV} → Max {fmtTL(degerNum*(maxLTV/100))}</p>
          </div>
        </>}
      </Card>
      {r&&r.ltvAsim&&(
        <div style={{background:"#FEF2F2",borderRadius:14,padding:"14px 16px",border:`1.5px solid ${C.red}`}}>
          <p style={{margin:"0 0 4px",fontSize:14,fontWeight:800,color:C.red}}>⛔ BDDK LTV Sınırı Aşıldı — Hesaplama Yapılamaz</p>
          <p style={{margin:"0 0 2px",fontSize:13,color:C.red}}>Gerçekleşen LTV: %{fmtN(r.gercekLTV)} — Azami: %{r.maxLTV}</p>
          <p style={{margin:0,fontSize:13,color:C.red}}>Kullandırılabilecek azami tutar: {fmtTL(r.maxFin)}</p>
        </div>
      )}
      {r&&!r.ltvAsim&&r.pmt&&<Card>
        <SecTitle>Konut Finansmanı Analizi</SecTitle>
        {ilkEv&&<div style={{background:C.greenLight,borderRadius:8,padding:"7px 10px",marginBottom:8}}>
          <p style={{margin:0,fontSize:12,color:C.green,fontWeight:700}}>✅ İlk Ev — BSMV ve KKDF uygulanmamaktadır</p>
        </div>}
        <RRow label="Aylık Taksit (Sabit)" value={fmtTL(r.aylikTaksit||r.pmt)} accent={C.blue} big/>
        <RRow label="Toplam Kâr Payı" value={fmtTL(r.toplamKarPayi)}/>
        {!ilkEv&&<><RRow label={`BSMV (%${s.bireyselBSMV})`} value={fmtTL(r.bsmvTL)} sub accent={C.red}/>
        <RRow label={`KKDF (%${s.bireyselKKDF})`} value={fmtTL(r.kkdfTL)} sub accent={C.red}/></>}
        <RRow label="Toplam Müşteri Maliyeti" value={fmtTL(r.toplamMaliyet||r.toplamNet+r.bsmvTL+r.kkdfTL)} accent={C.green} big/>
        {r.ltvSonuc&&<RRow label="LTV" value={`% ${fmtN(r.ltvSonuc.gercekLTV)}`} sub accent={C.green}/>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
          <button onClick={()=>setShowPlan(true)} style={{padding:"12px",borderRadius:12,border:`1.5px solid ${C.blue}`,background:C.blueLight,color:C.blue,fontWeight:700,fontSize:13,cursor:"pointer"}}>
            📅 Ödeme Planı
          </button>
          <button onClick={()=>setShowErken(true)} style={{padding:"12px",borderRadius:12,border:`1.5px solid ${C.orange}`,background:C.orangeLight,color:C.orange,fontWeight:700,fontSize:13,cursor:"pointer"}}>
            ⚡ Erken Kapama
          </button>
        </div>
        <RaporButon baslik="Konut Finansmanı Analizi" plan={r.plan} satirlar={[
          {label:"Aylık Taksit", value:fmtTL(r.aylikTaksit||r.pmt), big:true},
          {label:"Toplam Kâr Payı", value:fmtTL(r.toplamKarPayi)},
          {label:`BSMV (%${s.bireyselBSMV})`, value:fmtTL(r.bsmvTL)},
          {label:`KKDF (%${s.bireyselKKDF})`, value:fmtTL(r.kkdfTL)},
          {label:"Toplam Müşteri Maliyeti", value:fmtTL(r.toplamMaliyet), big:true},
          r.ltvSonuc?{label:"LTV", value:`% ${fmtN(r.ltvSonuc.gercekLTV)}`}:null,
        ].filter(Boolean)}/>
      </Card>}
    </div>
  );
}

function TasitFinansman({s}){
  const [tutar,setTutar]=useState("");
  const [vade,setVade]=useState("");
  const [oran,setOran]=useState("");
  const [tip,setTip]=useState("yillik");
  const [aracDeger,setAracDeger]=useState("");
  const [showPlan,setShowPlan]=useState(false);
  const [showErken,setShowErken]=useState(false);

  const getTasitLimits=(d)=>{
    const v=parseFloat(d)||0;
    if(v<=400000)  return{ltv:70,vadeMax:48};
    if(v<=800000)  return{ltv:50,vadeMax:36};
    if(v<=1200000) return{ltv:30,vadeMax:24};
    if(v<=2000000) return{ltv:20,vadeMax:12};
    return null; // 2M üzeri kredi verilmez
  };

  const r=useCallback(()=>{
    const T=parseFloat(tutar),V=parseInt(vade),rt=parseFloat(oran);
    if(!T||!V||!rt||!aracDeger)return null;
    const D=parseFloat(aracDeger);

    // 2M TL üzeri araç kredisi verilmez
    if(D>2000000) return{limitAsim:true,D};

    const lim=getTasitLimits(D);
    if(!lim) return{limitAsim:true,D};

    const gercekLTV=(T/D)*100;
    const maxFin=Math.round(D*(lim.ltv/100));

    // LTV aşımı
    if(T>maxFin) return{ltvAsim:true,maxLTV:lim.ltv,maxFin,gercekLTV,vadeMax:lim.vadeMax,D};
    // Vade aşımı
    if(V>lim.vadeMax) return{vadeAsim:true,vadeMax:lim.vadeMax,maxLTV:lim.ltv,D};

    // Eşit taksit - PMT formülü
    const ao=tip==="yillik"?rt/12/100:rt/100;
    const pmt=ao===0?T/V:T*ao/(1-Math.pow(1+ao,-V));
    const toplamNet=Math.round(pmt*V*100)/100;
    const toplamKarPayi=toplamNet-T;
    const bsmvTL=Math.round(toplamKarPayi*(s.bireyselBSMV/100)*100)/100;
    const kkdfTL=Math.round(toplamKarPayi*(s.bireyselKKDF/100)*100)/100;
    const plan=hesaplaOdemePlani(T,V,ao,s.bireyselBSMV,s.bireyselKKDF);
    const aylikTaksit=plan._toplamSabitTaksit||pmt;
    const toplamMaliyet=Math.round(aylikTaksit*V*100)/100;
    const ltvSonuc={gercekLTV,maxLTV:lim.ltv,vadeMax:lim.vadeMax};
    return{pmt,aylikTaksit,toplamNet,toplamKarPayi,bsmvTL,kkdfTL,toplamMaliyet,plan,ltvSonuc,D};
  },[tutar,vade,oran,tip,aracDeger,s])();

  const D=parseFloat(aracDeger)||0;
  const lim=D>0&&D<=2000000?getTasitLimits(D):null;

  return(
    <div style={{padding:"0 16px 32px"}}>
      {showPlan&&r?.plan&&<OdemePlani plan={r.plan} bsmvOran={s.bireyselBSMV} kkdfOran={s.bireyselKKDF} onClose={()=>setShowPlan(false)}/>}
      {showErken&&r?.plan&&<ErkenKapamaModal plan={r.plan} onClose={()=>setShowErken(false)}/>}
      <Card>
        <Seg options={[{v:"aylik",l:"Aylık %"},{v:"yillik",l:"Yıllık %"}]} value={tip} onChange={setTip}/>
        <Field label="Araç Değeri (Zorunlu)" value={aracDeger} onChange={setAracDeger} suffix="₺" hint="BDDK LTV ve azami vade kontrolü için gerekli"/>
        {/* Araç değeri bilgi bandı */}
        {D>2000000&&<div style={{background:"#FEF2F2",borderRadius:10,padding:"9px 12px",marginBottom:10,border:`1px solid ${C.red}`}}>
          <p style={{margin:0,fontSize:12,color:C.red,fontWeight:700}}>⛔ 2.000.000 ₺ üzeri araçlara kredi kullandırılamaz</p>
        </div>}
        {D>0&&D<=2000000&&lim&&<div style={{background:C.blueLight,borderRadius:10,padding:"9px 12px",marginBottom:10}}>
          <p style={{margin:"0 0 2px",fontSize:12,color:C.blue,fontWeight:700}}>BDDK Azami LTV: %{lim.ltv} → Max {fmtTL(D*(lim.ltv/100))}</p>
          <p style={{margin:0,fontSize:11,color:C.sub}}>Azami Vade: {lim.vadeMax} Ay</p>
        </div>}
        <Field label="Finansman Tutarı" value={tutar} onChange={setTutar} suffix="₺"/>
        <Field label="Vade (Ay)" value={vade} onChange={setVade} suffix="Ay"/>
        <Field label={`Kâr Payı Oranı (${tip==="yillik"?"Yıllık":"Aylık"})`} value={oran} onChange={setOran} suffix="%"/>
      </Card>

      {/* Uyarılar */}
      {r&&r.limitAsim&&<div style={{background:"#FEF2F2",borderRadius:14,padding:"14px 16px",border:`1.5px solid ${C.red}`}}>
        <p style={{margin:"0 0 4px",fontSize:14,fontWeight:800,color:C.red}}>⛔ Kredi Kullandırılamaz</p>
        <p style={{margin:0,fontSize:13,color:C.red}}>Araç değeri 2.000.000 ₺ üzerinde olduğundan taşıt finansmanı kullandırılamaz.</p>
      </div>}
      {r&&r.ltvAsim&&<div style={{background:"#FEF2F2",borderRadius:14,padding:"14px 16px",border:`1.5px solid ${C.red}`}}>
        <p style={{margin:"0 0 4px",fontSize:14,fontWeight:800,color:C.red}}>⛔ LTV Sınırı Aşıldı — Hesaplama Yapılamaz</p>
        <p style={{margin:"0 0 2px",fontSize:13,color:C.red}}>LTV: %{fmtN(r.gercekLTV)} (Azami %{r.maxLTV}) → Max Finansman: {fmtTL(r.maxFin)}</p>
      </div>}
      {r&&r.vadeAsim&&<div style={{background:"#FEF2F2",borderRadius:14,padding:"14px 16px",border:`1.5px solid ${C.red}`}}>
        <p style={{margin:"0 0 4px",fontSize:14,fontWeight:800,color:C.red}}>⛔ Vade Aşıldı — Hesaplama Yapılamaz</p>
        <p style={{margin:0,fontSize:13,color:C.red}}>Bu araç değeri için azami vade {r.vadeMax} aydır.</p>
      </div>}

      {/* Sonuçlar */}
      {r&&r.pmt&&<Card>
        <SecTitle>Taşıt Finansmanı Analizi</SecTitle>
        <RRow label="Aylık Taksit (Sabit)" value={fmtTL(r.aylikTaksit)} accent={C.blue} big/>
        <RRow label="Toplam Kâr Payı" value={fmtTL(r.toplamKarPayi)}/>
        <RRow label={`BSMV (%${s.bireyselBSMV})`} value={fmtTL(r.bsmvTL)} sub accent={C.red}/>
        <RRow label={`KKDF (%${s.bireyselKKDF})`} value={fmtTL(r.kkdfTL)} sub accent={C.red}/>
        <RRow label="Toplam Müşteri Maliyeti" value={fmtTL(r.toplamMaliyet||r.toplamNet+r.bsmvTL+r.kkdfTL)} accent={C.green} big/>
        {r.ltvSonuc&&<><RRow label="LTV" value={`% ${fmtN(r.ltvSonuc.gercekLTV)}`} sub accent={C.green}/>
        <RRow label="✅ BDDK Sınırları" value="Uygun" sub accent={C.green}/></>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
          <button onClick={()=>setShowPlan(true)} style={{padding:"12px",borderRadius:12,border:`1.5px solid ${C.blue}`,background:C.blueLight,color:C.blue,fontWeight:700,fontSize:13,cursor:"pointer"}}>
            📅 Ödeme Planı
          </button>
          <button onClick={()=>setShowErken(true)} style={{padding:"12px",borderRadius:12,border:`1.5px solid ${C.orange}`,background:C.orangeLight,color:C.orange,fontWeight:700,fontSize:13,cursor:"pointer"}}>
            ⚡ Erken Kapama
          </button>
        </div>
        <RaporButon baslik="Taşıt Finansmanı Analizi" plan={r.plan} satirlar={[
          {label:"Aylık Taksit", value:fmtTL(r.aylikTaksit), big:true},
          {label:"Toplam Kâr Payı", value:fmtTL(r.toplamKarPayi)},
          {label:`BSMV (%${s.bireyselBSMV})`, value:fmtTL(r.bsmvTL)},
          {label:`KKDF (%${s.bireyselKKDF})`, value:fmtTL(r.kkdfTL)},
          {label:"Toplam Müşteri Maliyeti", value:fmtTL(r.toplamMaliyet), big:true},
          r.ltvSonuc?{label:"LTV", value:`% ${fmtN(r.ltvSonuc.gercekLTV)}`}:null,
        ].filter(Boolean)}/>
      </Card>}
    </div>
  );
}


function YatirimFonuFinansman({s}){
  const [tutar,setTutar]=useState("");
  const [vade,setVade]=useState("");
  const [oran,setOran]=useState("");
  const [tip,setTip]=useState("yillik");
  const [fonTuru,setFonTuru]=useState("bireysel");
  const [showPlan,setShowPlan]=useState(false);

  const getVadeLimit=(t)=>{
    const v=parseFloat(t)||0;
    if(v>=50000&&v<=125000) return 36;
    if(v>125000&&v<=250000) return 24;
    return null;
  };

  const r=useCallback(()=>{
    const T=parseFloat(tutar),V=parseInt(vade),rt=parseFloat(oran);
    if(!T||!V||!rt)return null;
    const ao=tip==="yillik"?rt/12/100:rt/100;
    const lim=getVadeLimit(T);
    if(lim&&V>lim) return{vadeAsim:true,vadeLimit:lim};
    const bsmvR=fonTuru==="bireysel"?s.bireyselBSMV:s.ticariBSMV;
    const kkdfR=fonTuru==="bireysel"?s.bireyselKKDF:s.ticariKKDF;
    const pmt=ao===0?T/V:T*ao/(1-Math.pow(1+ao,-V));
    const toplamNet=pmt*V;
    const toplamKarPayi=toplamNet-T;
    const bsmvTL=toplamKarPayi*(bsmvR/100);
    const kkdfTL=toplamKarPayi*(kkdfR/100);
    const plan=hesaplaOdemePlani(T,V,ao,bsmvR,kkdfR);
    const aylikTaksit=plan._toplamSabitTaksit||pmt;
    return{pmt,aylikTaksit,toplamNet,toplamKarPayi,bsmvTL,kkdfTL,plan,bsmvR,kkdfR,vadeLimit:lim};
  },[tutar,vade,oran,tip,fonTuru,s])();

  const lim=getVadeLimit(tutar);

  return(
    <div style={{padding:"0 16px 32px"}}>
      {showPlan&&r?.plan&&<OdemePlani plan={r.plan} bsmvOran={r.bsmvR} kkdfOran={r.kkdfR} onClose={()=>setShowPlan(false)}/>}
      <Card>
        <Seg options={[{v:"bireysel",l:"Bireysel"},{v:"kurumsal",l:"Kurumsal"}]} value={fonTuru} onChange={setFonTuru}/>
        <Seg options={[{v:"aylik",l:"Aylık %"},{v:"yillik",l:"Yıllık %"}]} value={tip} onChange={setTip}/>
        <Field label="Finansman Tutarı" value={tutar} onChange={setTutar} suffix="₺"/>
        <Field label="Vade (Ay)" value={vade} onChange={setVade} suffix="Ay"/>
        <Field label={`Kâr Payı Oranı (${tip==="yillik"?"Yıllık":"Aylık"})`} value={oran} onChange={setOran} suffix="%"/>
        {lim&&<div style={{background:C.blueLight,borderRadius:10,padding:"9px 12px",marginBottom:4}}>
          <p style={{margin:0,fontSize:12,color:C.blue,fontWeight:700}}>Bu tutar için azami vade: {lim} Ay</p>
        </div>}
      </Card>
      {r&&r.vadeAsim&&(
        <div style={{background:"#FEF2F2",borderRadius:14,padding:"14px 16px",border:`1.5px solid ${C.red}`}}>
          <p style={{margin:"0 0 4px",fontSize:14,fontWeight:800,color:C.red}}>⛔ Azami Vade Aşıldı — Hesaplama Yapılamaz</p>
          <p style={{margin:0,fontSize:13,color:C.red}}>Bu tutar için azami vade {r.vadeLimit} aydır.</p>
        </div>
      )}
      {r&&!r.vadeAsim&&r.pmt&&<Card>
        <SecTitle>Yatırım Fonu Finansmanı</SecTitle>
        <RRow label="Aylık Taksit (Sabit)" value={fmtTL(r.aylikTaksit)} accent={C.blue} big/>
        <RRow label="Toplam Kâr Payı" value={fmtTL(r.toplamKarPayi)}/>
        <RRow label={`BSMV (%${r.bsmvR})`} value={fmtTL(r.bsmvTL)} sub accent={C.red}/>
        <RRow label={`KKDF (%${r.kkdfR})`} value={fmtTL(r.kkdfTL)} sub accent={C.red}/>
        <RRow label="Toplam Müşteri Maliyeti" value={fmtTL(r.toplamMaliyet||r.toplamNet+r.bsmvTL+r.kkdfTL)} accent={C.green} big/>
        <button onClick={()=>setShowPlan(true)} style={{width:"100%",marginTop:12,padding:"12px",borderRadius:12,border:`1.5px solid ${C.blue}`,background:C.blueLight,color:C.blue,fontWeight:700,fontSize:14,cursor:"pointer"}}>
          📅 Ödeme Planını Görüntüle
        </button>
      </Card>}
    </div>
  );
}


function KrediKarlilik({s}){
  const [tutar,setTutar]=useState("");const [vade,setVade]=useState("");const [oran,setOran]=useState("");
  const [tip,setTip]=useState("aylik");const [odeme,setOdeme]=useState("esit");const [ticari,setTicari]=useState("ticari");
  const [fonlama,setFonlama]=useState(String(s.fonlamaMaliyeti));
  const [showPlan,setShowPlan]=useState(false);
  const r=useCallback(()=>{
    const T=parseFloat(tutar),V=parseFloat(vade),rt=parseFloat(oran);
    if(!T||!V||!rt)return null;
    const ao=tip==="yillik"?rt/12/100:rt/100;
    const fm=parseFloat(fonlama)/100/12; // yıllık → aylık
    const kkdf=(ticari==="ticari"?s.ticariKKDF:s.bireyselKKDF)/100;
    const bsmv=(ticari==="ticari"?s.ticariBSMV:s.bireyselBSMV)/100;
    let taksit,toplamOdeme,tf;
    if(odeme==="esit"){
      taksit=ao===0?T/V:T*ao/(1-Math.pow(1+ao,-V));
      toplamOdeme=taksit*V; tf=toplamOdeme-T;
    }else{tf=T*ao*V;toplamOdeme=T+tf;taksit=null;}
    const fmT=T*fm*V; const nk=tf-fmT;
    const spreadBp=(parseFloat(oran)-(tip==="yillik"?parseFloat(fonlama):parseFloat(fonlama)/12))*100;
    const plan=odeme==="esit"&&taksit?hesaplaOdemePlani(T,V,ao,ticari==="ticari"?s.ticariBSMV:s.bireyselBSMV,ticari==="ticari"?s.ticariKKDF:s.bireyselKKDF):null;
    return{taksit,tf,toplamOdeme,kkdfTL:tf*kkdf,bsmvTL:tf*bsmv,fmT,nk,spreadBp,plan};
  },[tutar,vade,oran,tip,odeme,ticari,fonlama,s])();
  return(
    <div style={{padding:"0 16px 32px"}}>
      {showPlan&&r?.plan&&<OdemePlani plan={r.plan} bsmvOran={ticari==="ticari"?s.ticariBSMV:s.bireyselBSMV} kkdfOran={ticari==="ticari"?s.ticariKKDF:s.bireyselKKDF} onClose={()=>setShowPlan(false)}/>}
      <Card>
        <Seg options={[{v:"ticari",l:"Ticari"},{v:"bireysel",l:"Bireysel"}]} value={ticari} onChange={setTicari}/>
        <Seg options={[{v:"aylik",l:"Aylık %"},{v:"yillik",l:"Yıllık %"}]} value={tip} onChange={setTip}/>
        <Seg options={[{v:"esit",l:"Eşit Taksit"},{v:"bullet",l:"Bullet/Balon"}]} value={odeme} onChange={setOdeme}/>
        <Field label="Finansman Tutarı" value={tutar} onChange={setTutar} suffix="₺"/>
        <Field label="Vade (Ay)" value={vade} onChange={setVade} suffix="Ay"/>
        <Field label={`Kâr Payı (${tip==="yillik"?"Yıllık":"Aylık"})`} value={oran} onChange={setOran} suffix="%"/>
      </Card>
      {r&&<>
        <Card>
          <SecTitle>Kâr Payı & Vergi</SecTitle>
          {r.taksit&&<RRow label="Aylık Taksit (Sabit)" value={fmtTL(r.aylikTaksit||r.taksit)} accent={C.blue} big/>}
          <RRow label="Toplam Kâr Payı Geliri" value={fmtTL(r.tf)}/>
          <RRow label={`KKDF (%${ticari==="ticari"?s.ticariKKDF:s.bireyselKKDF})`} value={fmtTL(r.kkdfTL)} sub accent={C.red}/>
          <RRow label={`BSMV (%${ticari==="ticari"?s.ticariBSMV:s.bireyselBSMV})`} value={fmtTL(r.bsmvTL)} sub accent={C.red}/>
        </Card>
        <Card>
          <SecTitle>Kârlılık</SecTitle>
          <RRow label="Fonlama Maliyeti" value={`- ${fmtTL(r.fmT)}`} sub accent={C.red}/>
          <RRow label="Net Kâr" value={fmtTL(r.nk)} accent={C.green} big/>
          <RRow label="Spread" value={`${fmtN(r.spreadBp,0)} baz puan`} sub/>
          {r.taksit&&r.plan&&<button onClick={()=>setShowPlan(true)} style={{width:"100%",marginTop:12,padding:"12px",borderRadius:12,border:`1.5px solid ${C.blue}`,background:C.blueLight,color:C.blue,fontWeight:700,fontSize:14,cursor:"pointer"}}>📅 Ödeme Planını Görüntüle</button>}
        </Card>
      </>}
    </div>
  );
}

function TaksitenKredi({s}){
  const [taksit,  setTaksit]  = useState("");
  const [vade,    setVade]    = useState("");
  const [oran,    setOran]    = useState("");
  const [tip,     setTip]     = useState("aylik");
  const [tur,     setTur]     = useState("bireysel"); // bireysel | tuzel
  const [showPlan,setShowPlan]= useState(false);

  // Vergi oranları kredi türüne göre
  const bsmvOran = tur==="bireysel" ? s.bireyselBSMV : s.ticariBSMV;
  const kkdfOran = tur==="bireysel" ? s.bireyselKKDF : s.ticariKKDF;

  const r = useCallback(()=>{
    const tk = parseFloat(taksit), V = parseInt(vade), rt = parseFloat(oran);
    if(!tk||!V||!rt) return null;

    const ao = tip==="yillik" ? rt/12/100 : rt/100;

    // Taksit içinde BSMV ve KKDF var
    // Brüt taksit = anapara payı + kâr payı + BSMV + KKDF
    // BSMV ve KKDF sadece kâr payı üzerinden alınır
    // Net taksit (sadece anapara + kâr) = brüt taksit / (1 + bsmvOran/100 + kkdfOran/100)
    const vergiCarpan = 1 + bsmvOran/100 + kkdfOran/100;
    const netTaksit = tk / vergiCarpan;

    // Net taksit üzerinden anapara hesapla (ters PMT)
    const anapara = ao===0 ? netTaksit*V : netTaksit*(1-Math.pow(1+ao,-V))/ao;

    const toplamNetOdeme = netTaksit * V;
    const toplamKarPayi  = toplamNetOdeme - anapara;
    const toplamBsmv     = toplamKarPayi * bsmvOran/100;
    const toplamKkdf     = toplamKarPayi * kkdfOran/100;
    const toplamBrutOdeme= tk * V;

    // Ödeme planı
    const plan = hesaplaOdemePlani(anapara, V, ao, bsmvOran, kkdfOran);

    return{
      anapara, netTaksit, toplamNetOdeme,
      toplamKarPayi, toplamBsmv, toplamKkdf,
      toplamBrutOdeme, vergiCarpan,
      girilenTaksit: tk, plan,
    };
  },[taksit,vade,oran,tip,tur,s])();

  return(
    <div style={{padding:"0 16px 32px"}}>
      {showPlan&&r?.plan&&<OdemePlani plan={r.plan} bsmvOran={bsmvOran} kkdfOran={kkdfOran} onClose={()=>setShowPlan(false)}/>}
      <Card>
        <SecTitle>Kredi Türü</SecTitle>
        <Seg options={[{v:"bireysel",l:"Bireysel"},{v:"tuzel",l:"Tüzel/Ticari"}]} value={tur} onChange={setTur}/>
        <div style={{background:C.blueLight,borderRadius:8,padding:"8px 10px",marginBottom:4}}>
          <p style={{margin:0,fontSize:11,color:C.blue}}>
            BSMV: %{fmtN(bsmvOran,0)} — KKDF: %{fmtN(kkdfOran,0)} — Vergi çarpanı: {fmtN(1+bsmvOran/100+kkdfOran/100,4)}x
          </p>
        </div>
      </Card>
      <Card>
        <SecTitle>Parametreler</SecTitle>
        <Seg options={[{v:"aylik",l:"Aylık %"},{v:"yillik",l:"Yıllık %"}]} value={tip} onChange={setTip}/>
        <Field label="Aylık Brüt Taksit Tutarı" value={taksit} onChange={setTaksit} suffix="₺" hint="BSMV ve KKDF dahil ödenen tutar"/>
        <Field label="Vade (Ay)" value={vade} onChange={setVade} suffix="Ay"/>
        <Field label={`Kâr Payı (${tip==="yillik"?"Yıllık":"Aylık"})`} value={oran} onChange={setOran} suffix="%"/>
      </Card>

      {r&&<>
        <Card>
          <SecTitle>Finansman Tutarı</SecTitle>
          <RRow label="Kullanılabilir Kredi (Anapara)" value={fmtTL(r.anapara)} accent={C.blue} big/>
          <div style={{height:1,background:C.border,margin:"6px 0"}}/>
          <RRow label="Net Taksit (Vergi Hariç)" value={fmtTL(r.netTaksit)} sub/>
          <RRow label={`BSMV (%${fmtN(bsmvOran,0)}) payı / taksit`} value={fmtTL(r.girilenTaksit - r.netTaksit - r.toplamKarPayi*kkdfOran/100/parseInt(vade||"1"))} sub accent={C.red}/>
          <RRow label={`KKDF (%${fmtN(kkdfOran,0)}) payı / taksit`} value={fmtTL(r.toplamKarPayi*kkdfOran/100/parseInt(vade||"1"))} sub accent={C.red}/>
          <RRow label="Girilen Brüt Taksit" value={fmtTL(r.girilenTaksit)} accent={C.orange}/>
          <div style={{height:1,background:C.border,margin:"6px 0"}}/>
          <RRow label="Toplam Kâr Payı" value={fmtTL(r.toplamKarPayi)}/>
          <RRow label={`Toplam BSMV (%${fmtN(bsmvOran,0)})`} value={fmtTL(r.toplamBsmv)} sub accent={C.red}/>
          <RRow label={`Toplam KKDF (%${fmtN(kkdfOran,0)})`} value={fmtTL(r.toplamKkdf)} sub accent={C.red}/>
          <RRow label="Toplam Brüt Ödeme" value={fmtTL(r.toplamBrutOdeme)} accent={C.green} big/>

          <button onClick={()=>setShowPlan(true)} style={{
            width:"100%",marginTop:12,padding:"12px",borderRadius:12,
            border:`1.5px solid ${C.blue}`,background:C.blueLight,
            color:C.blue,fontWeight:700,fontSize:14,cursor:"pointer"
          }}>
            📅 Ödeme Planını Görüntüle
          </button>
        </Card>

        <RaporButon baslik="Taksitten Tutar Hesaplama" plan={r.plan} satirlar={[
          {label:"Kredi Türü", value:tur==="bireysel"?"Bireysel":"Tüzel/Ticari"},
          {label:"Kullanılabilir Kredi", value:fmtTL(r.anapara), big:true},
          {label:"Girilen Brüt Taksit", value:fmtTL(r.girilenTaksit)},
          {label:`BSMV (%${fmtN(bsmvOran,0)})`, value:fmtTL(r.toplamBsmv)},
          {label:`KKDF (%${fmtN(kkdfOran,0)})`, value:fmtTL(r.toplamKkdf)},
          {label:"Toplam Brüt Ödeme", value:fmtTL(r.toplamBrutOdeme), big:true},
        ]}/>
      </>}
    </div>
  );
}

function SpotKredi({s}){
  const [tutar,setTutar]=useState("");
  const [gun,setGun]=useState("");
  const [oran,setOran]=useState("");
  const [showPlan,setShowPlan]=useState(false);

  const r=useCallback(()=>{
    const T=parseFloat(tutar),G=parseInt(gun),rt=parseFloat(oran)/100;
    if(!T||!G||!rt)return null;
    const gunlukOran=rt/360;
    const karPayi=Math.round(T*gunlukOran*G*100)/100;
    const bsmvTL=Math.round(karPayi*(s.ticariBSMV/100)*100)/100;
    const kkdfTL=Math.round(karPayi*(s.ticariKKDF/100)*100)/100;
    const toplam=Math.round((karPayi+bsmvTL+kkdfTL)*100)/100;
    const efektif=gunlukOran*360*100;
    // Spot için tek satır plan (vade sonunda tek ödeme)
    const plan=[{
      ay:1,
      karPayi,
      anapara:T,
      vergi:bsmvTL+kkdfTL,
      toplam:T+toplam, // anapara + faiz + vergi
      bakiye:0
    }];
    return{karPayi,bsmvTL,kkdfTL,toplam,efektif,gunlukFaiz:T*gunlukOran,T,G,plan};
  },[tutar,gun,oran,s])();

  return(
    <div style={{padding:"0 16px 32px"}}>
      {showPlan&&r?.plan&&<OdemePlani
        plan={r.plan}
        bsmvOran={s.ticariBSMV}
        kkdfOran={s.ticariKKDF}
        onClose={()=>setShowPlan(false)}
      />}
      <Card>
        <Field label="Finansman Tutarı" value={tutar} onChange={setTutar} suffix="₺"/>
        <Field label="Vade (Gün)" value={gun} onChange={setGun} suffix="Gün"/>
        <Field label="Yıllık Kâr Payı Oranı" value={oran} onChange={setOran} suffix="%"/>
      </Card>
      {r&&<Card>
        <SecTitle>Spot Finansman Analizi</SecTitle>
        <RRow label="Günlük Kâr Payı" value={fmtTL(r.gunlukFaiz)} sub/>
        <RRow label={`${gun} Günlük Kâr Payı`} value={fmtTL(r.karPayi)} accent={C.orange} big/>
        <RRow label={`BSMV (%${s.ticariBSMV})`} value={fmtTL(r.bsmvTL)} sub accent={C.red}/>
        <RRow label={`KKDF (%${s.ticariKKDF})`} value={fmtTL(r.kkdfTL)} sub accent={C.red}/>
        <RRow label="Toplam Müşteri Maliyeti" value={fmtTL(r.toplam)} accent={C.green} big/>
        <RRow label="Efektif Yıllık %" value={`% ${fmtN(r.efektif)}`} sub/>
        <button onClick={()=>setShowPlan(true)} style={{width:"100%",marginTop:12,padding:"12px",borderRadius:12,border:`1.5px solid ${C.blue}`,background:C.blueLight,color:C.blue,fontWeight:700,fontSize:14,cursor:"pointer"}}>
          📅 Ödeme Planını Görüntüle
        </button>
        <RaporButon baslik="Spot Finansman Analizi" plan={r.plan} satirlar={[
          {label:"Finansman Tutarı", value:fmtTL(r.T), big:true},
          {label:"Vade", value:`${r.G} gün`},
          {label:"Günlük Kâr Payı", value:fmtTL(r.gunlukFaiz)},
          {label:"Toplam Kâr Payı", value:fmtTL(r.karPayi)},
          {label:`BSMV (%${s.ticariBSMV})`, value:fmtTL(r.bsmvTL)},
          {label:`KKDF (%${s.ticariKKDF})`, value:fmtTL(r.kkdfTL)},
          {label:"Toplam Müşteri Maliyeti", value:fmtTL(r.toplam), big:true},
          {label:"Efektif Yıllık", value:`% ${fmtN(r.efektif)}`},
        ]}/>
      </Card>}
    </div>
  );
}


function RotatifKredi({s}){
  const [limit,setLimit]=useState("");const [kullanim,setKullanim]=useState("");const [gun,setGun]=useState("");const [oran,setOran]=useState("");
  const r=useCallback(()=>{
    const L=parseFloat(limit),K=parseFloat(kullanim)||parseFloat(limit),G=parseInt(gun),rt=parseFloat(oran)/100;
    if(!L||!G||!rt)return null;
    const do_=rt/360; const tf=K*do_*G;
    const bsmv=tf*(s.ticariBSMV/100); const kkdf=tf*(s.ticariKKDF/100);
    const kullanilmayan=(L-K)>0?L-K:0;
    const komisyon=kullanilmayan*(rt*0.2/365)*G;
    return{tf,bsmv,kkdf,toplam:tf+bsmv+kkdf+komisyon,komisyon,kullanilmayan,efektif:do_*360*100};
  },[limit,kullanim,gun,oran,s])();
  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Field label="Kredi Limiti" value={limit} onChange={setLimit} suffix="₺"/>
        <Field label="Kullanılan Tutar" value={kullanim} onChange={setKullanim} suffix="₺" hint="Boş bırakılırsa limit=kullanım"/>
        <Field label="Gün" value={gun} onChange={setGun} suffix="Gün"/>
        <Field label="Yıllık Kâr Payı Oranı" value={oran} onChange={setOran} suffix="%"/>
      </Card>
      {r&&<Card>
        <SecTitle>Rotatif Analizi</SecTitle>
        <RRow label="Kâr Payı Tutarı" value={fmtTL(r.tf)} accent={C.blue} big/>
        <RRow label={`BSMV (%${s.ticariBSMV})`} value={fmtTL(r.bsmv)} sub accent={C.red}/>
        <RRow label={`KKDF (%${s.ticariKKDF})`} value={fmtTL(r.kkdf)} sub accent={C.red}/>
        {r.komisyon>0&&<RRow label="Kullanılmayan Limit Komisyonu" value={fmtTL(r.komisyon)} sub accent={C.orange}/>}
        <RRow label="Toplam Maliyet" value={fmtTL(r.toplam)} accent={C.green} big/>
        <RRow label="Efektif Yıllık" value={`% ${fmtN(r.efektif)}`} sub/>
      </Card>}
    </div>
  );
}

function LTV(){
  const [deger,setDeger]=useState("");const [tip,setTip]=useState("konut");
  const ORANLAR={konut:0.90,tasit:0.70,ticari:0.80};
  const r=useCallback(()=>{
    const D=parseFloat(deger);
    if(!D)return null;
    const oran=ORANLAR[tip];
    return{maxKredi:D*oran,oran:oran*100,minPesinat:D*(1-oran)};
  },[deger,tip])();
  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Seg options={[{v:"konut",l:"Konut"},{v:"tasit",l:"Taşıt"},{v:"ticari",l:"Ticari"}]} value={tip} onChange={setTip}/>
        <Field label="Teminat/Gayrimenkul Değeri" value={deger} onChange={setDeger} suffix="₺"/>
        <div style={{background:C.blueLight,borderRadius:10,padding:"10px 12px",marginTop:4}}>
          <p style={{margin:0,fontSize:12,color:C.blue,fontWeight:600}}>BDDK LTV Oranı: % {ORANLAR[tip]*100}</p>
        </div>
      </Card>
      {r&&<Card>
        <SecTitle>Kullanılabilir Kredi (LTV)</SecTitle>
        <RRow label="Azami Finansman Tutarı" value={fmtTL(r.maxKredi)} accent={C.blue} big/>
        <RRow label="LTV Oranı" value={`% ${fmtN(r.oran,0)}`}/>
        <RRow label="Min. Peşinat" value={fmtTL(r.minPesinat)} accent={C.orange}/>
      </Card>}
    </div>
  );
}

function IskontoIstirak({s}){
  const [nominal,setNominal]=useState("");const [gun,setGun]=useState("");const [oran,setOran]=useState("");
  const r=useCallback(()=>{
    const N=parseFloat(nominal),G=parseInt(gun),rt=parseFloat(oran)/100;
    if(!N||!G||!rt)return null;
    const do_=rt/360; const faiz=N*do_*G;
    const bsmv=faiz*(s.ticariBSMV/100); const kkdf=faiz*(s.ticariKKDF/100);
    const netGelir=N-faiz-bsmv-kkdf;
    const iskontoFiyat=N-faiz;
    return{faiz,bsmv,kkdf,netGelir,iskontoFiyat,efektif:do_*360*100};
  },[nominal,gun,oran,s])();
  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Field label="Senet Nominal Değeri" value={nominal} onChange={setNominal} suffix="₺"/>
        <Field label="Vadeye Kalan Gün" value={gun} onChange={setGun} suffix="Gün"/>
        <Field label="Yıllık İskonto Kâr Payı Oranı" value={oran} onChange={setOran} suffix="%"/>
      </Card>
      {r&&<Card>
        <SecTitle>İskonto / İştira Analizi</SecTitle>
        <RRow label="Nominal (Vade Sonu)" value={fmtTL(parseFloat(nominal))} />
        <RRow label="İskonto Fiyatı" value={fmtTL(r.iskontoFiyat)} accent={C.blue} big/>
        <RRow label="İskonto Kâr Payı" value={fmtTL(r.faiz)}/>
        <RRow label={`BSMV (%${s.ticariBSMV})`} value={fmtTL(r.bsmv)} sub accent={C.red}/>
        <RRow label={`KKDF (%${s.ticariKKDF})`} value={fmtTL(r.kkdf)} sub accent={C.red}/>
        <RRow label="Net Gelir (Bankaya)" value={fmtTL(r.netGelir)} accent={C.green} big/>
        <RRow label="Efektif Yıllık" value={`% ${fmtN(r.efektif)}`} sub/>
      </Card>}
    </div>
  );
}

function Leasing({s}){
  const [tutar,setTutar]=useState("");const [vade,setVade]=useState("");const [oran,setOran]=useState("");
  const [kdv,setKdv]=useState("20");const [kalintiDeger,setKalintiDeger]=useState("0");
  const r=useCallback(()=>{
    const T=parseFloat(tutar),V=parseInt(vade),rt=parseFloat(oran)/100/12,K=parseFloat(kalintiDeger)||0,kdvR=parseFloat(kdv)/100;
    if(!T||!V||!rt)return null;
    const pvK=K/Math.pow(1+rt,V);
    const anapara=T-pvK;
    const taksit_net=rt===0?anapara/V:anapara*rt/(1-Math.pow(1+rt,-V));
    const taksit_kdv=taksit_net*(1+kdvR);
    const toplamOdeme=taksit_kdv*V+K;
    const toplamKarPayi=(taksit_net*V+K)-T;
    return{taksit_net,taksit_kdv,toplamOdeme,toplamKarPayi,kdvMaliyet:taksit_net*kdvR*V};
  },[tutar,vade,oran,kalintiDeger,kdv])();
  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Field label="Leasing Tutarı (KDV Hariç)" value={tutar} onChange={setTutar} suffix="₺"/>
        <Field label="Vade (Ay)" value={vade} onChange={setVade} suffix="Ay"/>
        <Field label="Yıllık Kâr Payı Oranı" value={oran} onChange={setOran} suffix="%"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Field label="KDV Oranı" value={kdv} onChange={setKdv} suffix="%"/>
          <Field label="Kalıntı Değer" value={kalintiDeger} onChange={setKalintiDeger} suffix="₺"/>
        </div>
      </Card>
      {r&&<Card>
        <SecTitle>Leasing Analizi</SecTitle>
        <RRow label="Aylık Taksit (KDV Hariç)" value={fmtTL(r.taksit_net)}/>
        <RRow label="Aylık Taksit (KDV Dahil)" value={fmtTL(r.taksit_kdv)} accent={C.blue} big/>
        <RRow label="KDV Maliyeti (Toplam)" value={fmtTL(r.kdvMaliyet)} sub accent={C.orange}/>
        <RRow label="Toplam Kâr Payı" value={fmtTL(r.toplamKarPayi)}/>
        <RRow label="Toplam Ödeme (KDV Dahil)" value={fmtTL(r.toplamOdeme)} accent={C.green} big/>
      </Card>}
    </div>
  );
}

function TahvilBono({s}){
  const [nominal,setNominal]=useState("");const [kupon,setKupon]=useState("");
  const [vadeYil,setVadeYil]=useState("");const [ytm,setYtm]=useState("");const [stopajTip,setStopajTip]=useState("uzun");
  const r=useCallback(()=>{
    const N=parseFloat(nominal),c=parseFloat(kupon)/100,Y=parseFloat(vadeYil),g=parseFloat(ytm)/100;
    if(!N||!c||!Y||!g)return null;
    let fiyat=0; const yk=N*c;
    for(let t=1;t<=Y;t++)fiyat+=yk/Math.pow(1+g,t);
    fiyat+=N/Math.pow(1+g,Y);
    const tk=yk*Y; const sO=stopajTip==="kisa"?s.stopajTL_0_180:s.stopajTL_365plus;
    const stop=tk*(sO/100); const nk=tk-stop;
    const ngy=(nk/fiyat)/Y*100;
    return{fiyat,yk,tk,stop,nk,ngy,sO,premium:fiyat>N?"Primli":"İskontolu"};
  },[nominal,kupon,vadeYil,ytm,stopajTip,s])();
  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Seg options={[{v:"kisa",l:"0-180 Gün Stopaj"},{v:"uzun",l:"365+ Gün Stopaj"}]} value={stopajTip} onChange={setStopajTip}/>
        <Field label="Nominal Değer" value={nominal} onChange={setNominal} suffix="₺"/>
        <Field label="Kupon Oranı (Yıllık)" value={kupon} onChange={setKupon} suffix="%"/>
        <Field label="Vade (Yıl)" value={vadeYil} onChange={setVadeYil} suffix="Yıl"/>
        <Field label="Piyasa Getirisi (YTM)" value={ytm} onChange={setYtm} suffix="%"/>
      </Card>
      {r&&<Card>
        <SecTitle>Tahvil Analizi</SecTitle>
        <RRow label={`Fiyat (${r.premium})`} value={fmtTL(r.fiyat)} accent={C.blue} big/>
        <RRow label="Yıllık Kupon" value={fmtTL(r.yk)}/>
        <RRow label="Toplam Kupon Geliri" value={fmtTL(r.tk)}/>
        <RRow label={`Stopaj (%${fmtN(r.sO)})`} value={`- ${fmtTL(r.stop)}`} sub accent={C.red}/>
        <RRow label="Net Kupon Geliri" value={fmtTL(r.nk)} accent={C.green} big/>
        <RRow label="Net Yıllık Getiri (Est.)" value={`% ${fmtN(r.ngy)}`} sub/>
      </Card>}
    </div>
  );
}

// ─── AYARLAR ─────────────────────────────────────────────────────────────────
function Ayarlar({settings,onSave}){
  const [s,setS]=useState({...settings});
  const upd=k=>v=>setS(p=>({...p,[k]:parseFloat(v)||0}));
  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <SecTitle>TL Mevduat Stopaj Oranları</SecTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="0-180 Gün" value={s.stopajTL_0_180} onChange={upd("stopajTL_0_180")} suffix="%"/>
          <Field label="181-365 Gün" value={s.stopajTL_181_365} onChange={upd("stopajTL_181_365")} suffix="%"/>
          <Field label="365+ Gün" value={s.stopajTL_365plus} onChange={upd("stopajTL_365plus")} suffix="%"/>
        </div>
      </Card>
      <Card>
        <SecTitle>YP Mevduat Stopaj</SecTitle>
        <Field label="Tüm Vadeler" value={s.stopajYP_tum} onChange={upd("stopajYP_tum")} suffix="%"/>
      </Card>
      <Card>
        <SecTitle>Kredi Vergi Oranları</SecTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="Bireysel KKDF" value={s.bireyselKKDF} onChange={upd("bireyselKKDF")} suffix="%"/>
          <Field label="Bireysel BSMV" value={s.bireyselBSMV} onChange={upd("bireyselBSMV")} suffix="%"/>
          <Field label="Ticari KKDF" value={s.ticariKKDF} onChange={upd("ticariKKDF")} suffix="%"/>
          <Field label="Ticari BSMV" value={s.ticariBSMV} onChange={upd("ticariBSMV")} suffix="%"/>
        </div>
      </Card>
      <Card>
        <SecTitle>ZK Oranları (Referans)</SecTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="TL Vadesiz/Kısa" value={s.zkTL_vadesiz} onChange={upd("zkTL_vadesiz")} suffix="%"/>
          <Field label="TL 6ay-1yıl" value={s.zkTL_6ay} onChange={upd("zkTL_6ay")} suffix="%"/>
          <Field label="YP Vadesiz" value={s.zkYP_vadesiz} onChange={upd("zkYP_vadesiz")} suffix="%"/>
          <Field label="YP 3ay+" value={s.zkYP_diger} onChange={upd("zkYP_diger")} suffix="%"/>
        </div>
      </Card>
      <Card>
        <SecTitle>Yıllık Fonlama Maliyeti</SecTitle>
        <Field label="Yıllık Fonlama Maliyeti" value={s.fonlamaMaliyeti} onChange={upd("fonlamaMaliyeti")} suffix="% Yıllık"/>
      </Card>
      <Card>
        <SecTitle>POS Referans Oranı (Tebliğ 2020/4)</SecTitle>
        <Field label="Aylık Referans Oran" value={s.referansOran} onChange={upd("referansOran")} suffix="%" hint="Azami %3,11 — MB her ay günceller"/>
        <Field label="BKM Takas (Interchange) Oranı" value={s.bkmTakas} onChange={upd("bkmTakas")} suffix="%" hint="Aylık — BKM talimatına göre güncellenir"/>
        <div style={{background:C.blueLight,borderRadius:8,padding:"8px 10px",marginTop:4}}>
          <p style={{margin:0,fontSize:11,color:C.blue}}>Kredi kartı taksitsiz azami = Referans + %0,45 puan | Banka kartı azami = %1,04</p>
        </div>
      </Card>
      <button onClick={()=>onSave(s)} style={{width:"100%",padding:"15px",borderRadius:14,border:"none",background:C.blue,color:"#fff",fontWeight:800,fontSize:16,cursor:"pointer"}}>
        Kaydet
      </button>
    </div>
  );
}

// ─── AI ASİSTAN ───────────────────────────────────────────────────────────────
const KB = [
  {
    keys:["tl zk","tl zorunlu","tl mevduat zk","tl mevduat zorunlu","vadesiz zk","vadesiz mevduat","tl katılım zk"],
    title:"TL Zorunlu Karşılık Oranları",
    content:`TL MEVDUAT / KATILIM FONU ZK ORANLARI:
• Vadesiz / İhbarlı / 1 aya kadar / 3 aya kadar: %17
• 6 aya kadar (dahil): %10
• 1 yıla kadar: %10
• 1 yıl ve üzeri: %10
• TCMB kur/fiyat koruma destekli (6 aya kadar): %40
• TCMB kur/fiyat koruma destekli (1 yıl+): %22
• TÜFE/ÜFE/TLREF endeksli değişken faizli hesaplar: %10

TL DİĞER YÜKÜMLÜLÜKLER:
• 1 yıla kadar (dahil): %8
• 3 yıla kadar (dahil): %5,5
• 3 yıldan uzun: %3
• Yurt dışı repo/kredi 1 aya kadar: %20
• Yurt dışı repo/kredi 3 aya kadar: %16
• Yurt dışı repo/kredi ve mevduat 1 yıla kadar: %14
• Ana ortaklığa ait vadesiz yurt dışı banka mevduatı: %0`
  },
  {
    keys:["yp zk","yp zorunlu","yp mevduat zk","döviz zk","yabancı para zk","döviz mevduat zk","yp katılım"],
    title:"YP Zorunlu Karşılık Oranları",
    content:`YP MEVDUAT / KATILIM FONU ZK ORANLARI:
• Vadesiz / İhbarlı / 1 aya kadar: %30
• 3 ay / 6 ay / 1 yıl / 1 yıl+: %26
• İlave ZK (yurt dışı bankalar ve kıymetli maden depo hariç): %2,5

YP DİĞER YÜKÜMLÜLÜKLER:
• 1 yıla kadar (dahil): %21
• 2 yıla kadar (dahil): %10
• 3 yıla kadar (dahil): %8
• 5 yıla kadar (dahil): %3
• 5 yıldan uzun: %0
• Yurt içi yerleşiklerle YP repo (1 yıla kadar): %25`
  },
  {
    keys:["tl finansman büyüme","tl kredi büyüme","tl büyüme sınır","kobi dışı büyüme","kobi büyüme","ihtiyaç büyüme","taşıt büyüme","tüketici büyüme","tl büyüme limit","tl istisna","tl muaf","tl finansman istisna"],
    title:"TL Finansman Büyüme Sınırları ve İstisnaları",
    content:`TL FİNANSMAN BÜYÜME SINIRI (29.03.2024–31.12.2026):
• KOBİ dışı işletmeler: %2 (iki haftada bir)
• KOBİ işletmeler: %4,5
• Tüketici ihtiyaç finansmanı: %3
• Tüketici taşıt finansmanı: %3

TL İSTİSNA FİNANSMANLAR (büyüme dışı):
✅ Net ihracatçı firmalara ihracat finansmanı (max 2 yıl)
✅ Döviz kazandırıcı hizmet finansmanı (max 2 yıl)
✅ İhracat reeskont finansmanları
✅ Yatırım Teşvik Belgeli yatırım finansmanı (min 2 yıl)
✅ Esnaf finansmanları
✅ Tarımsal finansmanlar
✅ Kamusal amaçlı finansmanlar (5018 sayılı Kanun)
✅ Savunma sanayi firmaları
✅ KOSGEB destekli finansmanlar
✅ Elektrik dağıtım lisanslı firmalar
✅ Başka bankada yeniden yapılandırılan finansmanların kapatılması
✅ Merkez Bankasınca uygun KGF kefaletli programlar`
  },
  {
    keys:["yp finansman büyüme","yp kredi büyüme","yp büyüme sınır","yabancı para büyüme","yp büyüme istisna","yp muaf","yp finansman istisna"],
    title:"YP Finansman Büyüme Sınırı ve İstisnaları",
    content:`YP FİNANSMAN BÜYÜME SINIRI: %0,5 (iki haftada bir)

YP İSTİSNA FİNANSMANLAR (büyüme dışı):
✅ YTB kapsamında makine-teçhizat yatırım finansmanı (min 2 yıl, faturaya bağlı)
✅ Otel yatırımı bina-inşaat finansmanı (min 2 yıl)
✅ Ağır ticari araç finansmanı (min 2 yıl)
✅ Uluslararası kalkınma kuruluşlarından makine-teçhizat finansmanı
✅ Yurt içi bankalara kullandırılan finansmanlar
✅ Gayrikabili rücu akreditif iskontosu (yurt dışı banka riskinde)
✅ Kamusal amaçlı finansmanlar
✅ Savunma sanayi firmaları
✅ KGF kefaletli ihracat finansmanları
✅ Elektrik dağıtım lisanslı firmalar
✅ Başka bankada yeniden yapılandırılan YP finansmanların kapatılması
✅ Hazine garantili kalkınma/yatırım bankası finansmanları
✅ Borç üstlenim anlaşması kapsamı projeler (min 2 yıl)
✅ Özelleştirme ihalesi kazananlara kullandırılan finansmanlar

⚠️ ÖNEMLİ: YP finansmanlarda NET İHRACATÇI muafiyeti YOKTUR.
Bu muafiyet SADECE TL finansmanlarda geçerlidir.`
  },
  {
    keys:["net ihracatçı","ihracat muaf","ihracat finansman muaf","ihracat kredi muaf","net ihracat"],
    title:"Net İhracatçı Firma TL Finansman Muafiyeti",
    content:`NET İHRACATÇI TANIMI:
Son 3 mali yıl VEYA son mali yılda ihracat/ithalat oranı ≥ %110 olan firmalar.
(Yatırım Malları Listesindeki ithalat bedelleri bu hesaba dahil edilmez.)

Net ihracatçılık şartı ARANMAYAN firmalar:
• Savunma sanayi firmaları
• Yüksek teknoloji ihracatı taahhüdü verenler
• Sevk sonrası ihracat finansmanı kullananlar
• İhracat alacak sigortasıyla başvuran yeni kurulan firmalar

UYGULAMA:
• Finansman vadesi en fazla 2 yıl olmalıdır
• Sorumluluk bankaya aittir
• Her yılın 4. ayı sonuna kadar net ihracatçılık güncellenir

⚠️ Bu muafiyet SADECE TL finansmanlarda geçerlidir.
YP finansmanlarda net ihracatçı muafiyeti YOKTUR.`
  },
  {
    keys:["yaptırım","ceza","eksik zk","eksik tesis","cezai faiz","yaptırım nedir"],
    title:"ZK Yaptırımları",
    content:`EKSİK ZK TESİSİNDE YAPTIRIM:
• Eksik TL ZK → 2 katı faizsiz TL bloke mevduat
• Eksik YP ZK → 3 katı faizsiz USD bloke mevduat
• Cezai faiz: TCMB en yüksek gecelik borç verme faizi × 1,50
• Tahakkuk eden cezai faizler ödenmezse 6183 sayılı Kanun'a göre tahsil edilir
• Sürekli ihlal eden kuruluşlara idari tedbirler uygulanır`
  },
  {
    keys:["faiz ödeme","telafi ödeme","zk faiz","karşılık faizi","nema","zk getiri","zk kazanç"],
    title:"ZK Faiz / Telafi Ödemesi",
    content:`TL ZK FAİZ / TELAFİ ÖDEMESİ:
• TL mevduat ZK'sı: TCMB ağırlıklı ort. fonlama maliyeti × 0,86
• Kur/fiyat koruma destekli hesap ZK'sı: TCMB maliyeti × 0,40
• 21 Aralık 2024 sonrası açılan/yenilenen kur koruma hesaplarına bu oran uygulanmaz
• Fazla tesis edilen tutarlara faiz ödenmez
• Ödeme: Her 3 ayda bir (Mart, Haziran, Eylül, Aralık sonu)
• Ödeme, takip eden ilk iş günü serbest mevduat hesabına aktarılır`
  },
  {
    keys:["stopaj","tevkifat","mevduat stopaj","kesinti","stopaj oranı"],
    title:"Mevduat Stopaj Oranları",
    content:`TL MEVDUAT STOPAJ ORANLARI:
• 0 – 180 gün: %17,5
• 181 – 365 gün: %15
• 365 gün üzeri: %10

YP MEVDUAT STOPAJ ORANLARI:
• Tüm vadeler: %25`
  },
  {
    keys:["kkdf","bsmv","vergi oranı","kredi vergi","finansman vergi","kkdf bsmv"],
    title:"KKDF ve BSMV Oranları",
    content:`TİCARİ FİNANSMAN:
• BSMV: %5
• KKDF: %0

BİREYSEL FİNANSMAN:
• BSMV: %15
• KKDF: %15`
  },
  {
    keys:["tesis dönem","hesaplama dönem","bildiri","cetvel","evas","bloke","zk300","tesis süresi"],
    title:"Tesis Dönemi ve Bildirim",
    content:`HESAPLAMA VE TESİS:
• Yükümlülükler: 2 haftada bir Cuma günü itibarıyla hesaplanır
• Tesis başlangıcı: Hesaplama tarihinden 2 hafta sonraki Cuma
• Tesis bitişi: Başlangıcı takip eden Perşembe (14 gün)

BİLDİRİM:
• ZK300H cetveli, EVAS ile öğlen 12:00'ye kadar gönderilir
• Bloke hesap hareketi varsa 1-2 iş günü öncesinde gönderilmesi önerilir

BLOKE ZK ZORUNLULUĞU (31.12.2026'ya kadar):
• Aktif ≥ 500 milyar TL: TL ZK'nın %40'ı bloke
• Aktif ≥ 100 milyar TL: TL ZK'nın %30'u bloke

AKTİF BÜYÜKLÜK İNDİRİMLERİ:
• Aktif < 300 milyar TL: TL ZK'dan 500 milyon TL indirim
• Aktif < 300 milyar TL: YP TL ZK'dan 250 milyon TL indirim`
  },
  {
    keys:["kmh","kredi mevduat","limit büyüme","kmh limit"],
    title:"KMH Limit Büyüme Sınırı (Geçici Madde 17)",
    content:`TÜKETİCİ KMH LİMİT BÜYÜME SINIRI:
• %1 (8 haftada bir hesaplanır)
• 5 milyar TL altı KMH limiti olan bankalar hariçtir
• Geçerlilik: 27.03.2026 – 31.12.2026`
  },
  {
    keys:["erken kapama","erken ödeme","erken ödeme cezası","erken ödeme ücreti","kapama cezası","kredi kapatma","erken kapatma"],
    title:"Erken Ödeme Ücreti (Tebliğ 2020/4 — Madde 11 & Geçici Maddeler)",
    content:`TİCARİ KREDİLERDE ERKEN ÖDEME ÜCRETİ (Tebliğ 2020/4, Madde 11):

▶ 30.06.2024 SONRASI KULLANDIRILAN KREDİLER (Madde 11/3):
• Sabit faizli TL kredi: MB Talimatıyla belirlenen formülle hesaplanan oranda
  (Faiz oranı × kalan ağırlıklı ort. vade bazlı; pratikte azami ~%2)
• Sabit faizli YP/dövize endeksli: Sabit bir oran × kalan ağırlıklı ort. vade (MB Talimatı)
• Değişken faizli (tüm para birimleri): Erken ödenen tutarın azami %2'si

▶ 01.03.2021 – 30.06.2024 ARASI KULLANDIRILAN KREDİLER (Geçici Madde 5/2):
• Kalan vade ≤ 24 ay: %2
• Kalan vade > 24 ay: %2 + her ilave tam yıl için +%1
  (Örn: kalan 36 ay → %2 + %1 = %3; kalan 48 ay → %2 + %2 = %4)
• YP/dövize endeksli: TL oranına +%1 ilave uygulanır

▶ 01.03.2021 ÖNCESİ KULLANDIRILAN KREDİLER (Geçici Madde 5/1):
• Kalan vade ≤ 24 ay: %1
• Kalan vade > 24 ay: %2
• YP/dövize endeksli: +%1 ilave uygulanır

GENEL KURALLAR:
✅ Banka, müşterinin tüm krediyi erken kapatma talebini kabul ETMEK ZORUNDADIR
✅ Erken ödeme anında tahakkuk etmeyen faiz ve diğer maliyetlere ilişkin indirim yapılır
✅ Kısmi erken ödeme de mümkündür; bankadan indirim talep edilebilir
⛔ Bu ücretler sadece erken ödenen tutar üzerinden alınır`
  },
  {
    keys:["kredi tahsis","kullandırım ücreti","tahsis ücreti","kredi ücreti","kredi komisyonu"],
    title:"Kredi Tahsis ve Kullandırım Ücreti (Tebliğ 2020/4 — Madde 9)",
    content:`KREDİ TAHSİS ÜCRETİ (Madde 9/1):
• Azami: Tahsis edilen kredi limitinin %0,20'si
• Yıllık oran; vade ay sayısına oransal uygulanır
• Limit artışında sadece ilave limit üzerinden yeni ücret alınabilir
• Limit talebi müşteriden gelmeden tahsis ücreti alınamaz
• Gayri nakdi krediler dahil tüm kredi limitleri için uygulanır

KREDİ KULLANDIRIMI ÜCRETİ (Madde 9/2):
• Sadece nakdi kredilerden alınır
• Azami: Kullandırılan TL kredinin %1,10'u
• Rotatif kredilerde: Ortalama kullandırım bakiyesi üzerinden yıllık
• Bir yıldan kısa vadeli: Vade gün sayısına oransal düşürülür
• YP kredilerde kullandırım ücreti serbestçe belirlenebilir`
  },
  {
    keys:["teminat","ekspertiz","ipotek ücreti","rehin ücreti","teminat ücreti"],
    title:"Teminatlandırma Ücreti (Tebliğ 2020/4 — Madde 10)",
    content:`TEMİNATLANDIRMA ÜCRETİ (Madde 10):
• Taşınır/taşınmaz rehin ve ipotek tesisleri + ekspertiz işlemleri
• Azami: 3. kişilere ödenen tutarın %15 fazlası
• Hizmet banka bünyesinde sunuluyorsa: Hizmetin makul bedeli`
  },
  {
    keys:["eft ücreti","havale ücreti","fast ücreti","para transferi ücreti","transfer ücreti"],
    title:"Para Transferi Ücretleri (Tebliğ 2020/4 — Madde 15)",
    content:`EFT AZAMİ ÜCRETLERİ (Madde 15 — 06.01.2026 güncel):
≤ 8.300 TL:
  Mobil/İnternet/Düzenli Ödeme: 7,97 TL
  ATM/Kiosk: 27,84 TL
  Diğer kanallar: 39,87 TL

8.300,01 – 399.000 TL:
  Mobil/İnternet/Düzenli Ödeme: 15,96 TL
  ATM/Kiosk: 55,69 TL
  Diğer kanallar: 79,76 TL

399.000 TL Üzeri:
  Mobil/İnternet/Düzenli Ödeme: 199,41 TL
  ATM/Kiosk: 398,83 TL
  Diğer kanallar: 797,68 TL

HAVALE: EFT azami ücretlerinin yarısı
FAST: EFT ile aynı azami limitler
⛔ Hesaptan hesaba işyeri ödemelerinde GÖNDERENden ücret alınamaz`
  },
  {
    keys:["üye işyeri","pos komisyonu","pos ücreti","üye işyeri ücreti","mdm komisyon"],
    title:"Üye İşyeri Ücretleri (Tebliğ 2020/4 — Madde 20)",
    content:`ÜYE İŞYERİ ÜCRETLERİ (Madde 20):
• Kredi kartı taksitsiz (ertesi gün valör): Referans oran + 0,45 puan azami
• Banka kartı (ertesi gün valör): Azami %1,04
• Yurt dışı ihraçlı kartlar: Azami %1,90
• Taksitli işlemler: Taksitsiz ücret + her taksit için en fazla %50 ilave

REFERANS ORAN (Madde 20/A):
• Her ayın sondan 5. iş günü MB tarafından ilan edilir
• Azami: %3,11
• %5'ten fazla değişirse güncellenir

TİCARİ KART KURALLARI (Madde 21):
⛔ Limit aşım ücreti alınamaz
• Nakit avans ücreti: Azami %1
⛔ Ekstre erteleme, taksitlendirme, son ödeme tarihi uzatma ücreti alınamaz
✅ Bankalar ÜCRETSİZ ticari kredi kartı sunmak ZORUNDADIR
• Ek kart yıllık üyelik ücreti: Asıl kartın azami %50'si`
  },
  {
    keys:["ticari ücret tebliğ","2020/4","ticari müşteri ücret","banka ücret tebliğ","ücret bilgilendirme"],
    title:"Tebliğ 2020/4 Genel Çerçeve",
    content:`TİCARİ MÜŞTERİLERDEN ALINABİLECEK ÜCRETLER TEBLİĞİ (2020/4):
Son güncelleme: 31.01.2026 tarihli ve 33154 sayılı RG (2026/5 sayılı Tebliğ)

KAPSAM:
• Mali kuruluşlar dışındaki ticari müşterilere sunulan ürün ve hizmetler
• 4 ana kategori: Ticari Krediler, Dış Ticaret, Nakit Yönetimi, Ödeme Sistemleri

BİLGİLENDİRME KURALLARI (Madde 5 & 7):
• Ücretler internet sitesinde açık ve anlaşılır şekilde ilan edilir
• Ücret artışları en az 2 iş günü önceden bildirilir
• Artışlar geçmişe uygulanamaz

GENEL YASAKLAR:
⛔ Ek-1 dışındaki kategorilerde başka adlarla ücret alınamaz
⛔ Ürün/hizmet sunulamaması halinde (müşterinin vazgeçmesi hariç) iade yapılır
• Paket içindeki ürünlerin toplam ücreti ayrı ayrı azami fiyatları aşamaz`
  },
  {
    keys:["bilgilendirme esası","ücret bildirimi","ilan zorunluluğu","dekont","işlem fişi","sözleşme bilgilendirme","madde 5"],
    title:"Bilgilendirme Esasları (Tebliğ 2020/4 — Madde 5)",
    content:`BİLGİLENDİRME ESASLARI (Madde 5):
• Azami tarifeler bankaların internet sitesinde açık, anlaşılır ve kolay erişilebilir şekilde ilan edilir
• Birlikler ücret bilgilerini toplu olarak kendi internet sitesinde yayımlar
• Azami tarifelerdeki değişiklikler uygulamadan önce MB'ye bildirilir; bildirilen üzeri ücret alınamaz
• Sözleşmelerde bilgilendirme formu zorunludur; form sözleşmenin ayrılmaz parçasıdır
• Hizmet sunulmadan önce müşteriye tahsil edilecek ücret tutarı bildirilmek zorundadır
• Şubede: işlem sonrası dekont veya fişin imzalanması bilgilendirme yükümlülüğünü karşılar
• İşlem fişinde ücret bilgisine açıkça yer verilir
• Fatura/ekstre/sözleşme kopyaları ayrıca ücretlendirilemez (3. kişi maliyetleri hariç)
• Bankalar müşteri onaysız bildirimden ücret alamaz
• İspat yükü bankaya aittir`
  },
  {
    keys:["ücret değişiklik","artış bildirimi","madde 7","ücret artış","tarife güncelleme"],
    title:"Ücretlerin Değiştirilmesi (Tebliğ 2020/4 — Madde 7)",
    content:`ÜCRETLERİN DEĞİŞTİRİLMESİ (Madde 7):
• Ücret artışları uygulamadan en az 2 iş günü önce müşteriye yazılı veya kalıcı veri saklayıcısıyla bildirilir
• Artışlar geçmiş döneme uygulanamaz
• Maktu parasal sınırlar ve azami ücretler her yıl TÜFE oranında MB tarafından artırılır
• 06.01.2026 itibarıyla EFT/Havale/FAST sınırları TÜFE ile güncellenmiştir`
  },
  {
    keys:["dış ticaret","akreditif","ihracat","ithalat","gayri nakdi","madde 12","vesaik","aval"],
    title:"Dış Ticaret Ücretleri (Tebliğ 2020/4 — Madde 12 & Ek-1)",
    content:`DIŞ TİCARET KATEGORİSİ (Madde 12):
• İhracat ve ithalat işlemleri kapsamında sunulan gayri nakdi krediler ve diğer hizmetler

İTHALAT İŞLEMLERİ (Ek-1):
• Akreditif Açılış Ücreti
• Rezerv/Uyuşmazlık Ücreti
• Ön İhbar Ücreti
• Aval/Kabul Ücreti
• Vade/Tutar Değişiklik Ücreti
• Poliçe Kabul Ücreti

İHRACAT İŞLEMLERİ (Ek-1):
• İhbar Ücreti
• Teyit Ücreti
• Vade/Tutar Değişikliği Ücreti
• Vadeli Ödeme Ücreti
• İskonto Ücreti
• Tahsil Ücreti

ORTAK İŞLEMLER (Ek-1):
• Vesaik İnceleme Ücreti
• Değişiklik Ücreti
• İşlem Ücreti
• Muhabir Banka Masrafı
• Ödeme Ücreti

NOT: Dış ticaret kapsamındaki gayri nakdi krediler (akreditif ve banka kabul/avali) ticari krediler kategorisi dışındadır`
  },
  {
    keys:["nakit yönetimi","madde 13","madde 14","hesap açılış","para yatırma","mevduat hesap","atm ücret"],
    title:"Nakit Yönetimi — Hesap ve ATM (Tebliğ 2020/4 — Madde 13-14)",
    content:`NAKİT YÖNETİMİ (Madde 13):
Nakit pozisyon takibi, hesap hizmetleri, para transferleri, ödeme ve tahsilat ürünleri

MEVDUAT/KATILIM FONU HESAPLARI (Madde 14):
⛔ Hesap açılış, işletim, saklama ve bilgi işlem yatırımları için ücret alınamaz
⛔ Para yatırma işlemlerinden (saat 15:30 öncesi şube dahil) ücret alınamaz
  İSTİSNA: Şube kanalıyla 15:30 SONRASI para yatırma ücretlendirilebilir
⛔ Müşterinin kendi bankasının ATM'sinden bakiye sorgulama ve para çekme ücretsizdir
• Başka banka ATM'si: Ödenen tutarın azami %15 fazlası alınabilir`
  },
  {
    keys:["kiralık kasa","madde 16","kasa depozito","kasa ziyaret"],
    title:"Kiralık Kasa (Tebliğ 2020/4 — Madde 16)",
    content:`KİRALIK KASA (Madde 16):
• Sözleşme ile belirlenen hizmetler karşılığında kira ücreti alınabilir
⛔ Kiralık kasa ziyaretinden ücret alınamaz
• Depozito: Bir yıllık kira bedelini aşamaz
• Hizmet sonunda hasar, ödenmemiş kira ve diğer borçlar düşülerek kalan iade edilir`
  },
  {
    keys:["aracılık","fatura tahsilat","madde 17","faturaödeme","gönderen ücret"],
    title:"Aracılık Hizmetleri (Tebliğ 2020/4 — Madde 17)",
    content:`ARACILIK HİZMETLERİ (Madde 17):
⛔ Fatura ve benzeri tahsilatlara aracılık işlemlerinde ÖDEME YAPAN ticari müşteriden ücret alınamaz
✅ Bankalar tahsilatına aracılık yapılan taraftan (alacaklıdan) ücret talep edebilir`
  },
  {
    keys:["belge talep","ekstre","sözleşme kopyası","madde 18","geçmiş evrak"],
    title:"Belge ve Bilgilendirme Ücreti (Tebliğ 2020/4 — Madde 18)",
    content:`BELGE VE BİLGİLENDİRME (Madde 18):
• Sözleşme/fiş/belge kopyası talebi — ilk 1 yıl: Yalnızca 3. kişilere ödenen tutarlar alınabilir
• 1 yılı geçen belge talepleri: Müşteriye bilgi verilerek işlemle orantılı makul ücret alınabilir
• Basılı ekstre: 3. kişilere ödenen tutar kadar (banka bünyesinde: makul bedel)`
  },
  {
    keys:["çek","senet","çek defteri","senet protesto","çek iade","madde 3","çek işlem"],
    title:"Çek ve Senet İşlemleri (Tebliğ 2020/4 — Ek-1)",
    content:`ÇEK İŞLEMLERİ (Ek-1, 3.7):
• Çek Defteri ve Çek Düzenleme Ücreti
• Çek İade Ücreti
• Çek Tahsilatı Ücreti
• Çek Belgelendirme ve Düzeltme İşlemleri Ücreti

SENET İŞLEMLERİ (Ek-1, 3.8):
• Senet Bilgilendirme Ücreti
• Senet İade Ücreti
• Senet Protesto İşlemleri Ücreti
• Senet Tahsile Alma Ücreti`
  },
  {
    keys:["pos ücreti","sanal pos","fiziki pos","kayıp pos","pos donanım","madde 19"],
    title:"POS Ücretleri (Tebliğ 2020/4 — Madde 19 & Ek-1)",
    content:`POS ÜCRETLERİ (Ek-1, 4.1):
• POS Yazılım/Donanım/Bakım Ücreti — Fiziki POS
• POS Yazılım/Donanım/Bakım Ücreti — Sanal POS
• Kayıp/Hasarlı POS ve Aksesuar Bedeli

NOT: Üye işyeri ücreti dışında mal/hizmet tutarı üzerinden başka ücret alınamaz (Madde 20/7)
Üye işyerinin onayıyla kart sahibine aktarılmak üzere alınan ücretler istisnası vardır`
  },
  {
    keys:["tedarikçi finansmanı","dbs","doğrudan borçlandırma","tedarikçi"],
    title:"Tedarikçi Finansmanı ve DBS (Tebliğ 2020/4 — Ek-1)",
    content:`TEDARİKÇİ FİNANSMANI VE DBS (Ek-1, 3.1):
• Tedarikçi Finansmanı ve DBS Ücreti
• Tedarikçi Finansmanı ve DBS Dönem Ücreti

DBS (Doğrudan Borçlandırma Sistemi): Alıcı firmanın onayıyla tedarikçilerin alacaklarının erken tahsili`
  },
  {
    keys:["proje finansman","yapılandırılmış finansman","satın alım birleşme","özelleştirme finansman","madde 8"],
    title:"Ticari Krediler Kapsamı Dışı (Tebliğ 2020/4 — Madde 8/2)",
    content:`TİCARİ KREDİLER KATEGORİSİ DIŞINDA KALAN KREDİLER (Madde 8/2):
Aşağıdakiler için özel sözleşme veya protokol kapsamında kullandırılan krediler ticari krediler kategorisi dışındadır:
• Proje finansmanı
• Satın alım ve birleşme finansmanı
• Özelleştirme finansmanı
• Yapılandırılmış finansman
• Bunların refinansmanı`
  },
];

function normalize(s){
  return (s||"").toLowerCase()
    .replace(/ı/g,"i").replace(/ğ/g,"g").replace(/ş/g,"s")
    .replace(/ç/g,"c").replace(/ö/g,"o").replace(/ü/g,"u");
}

function findAnswer(q){
  const qn=normalize(q);
  const words=qn.split(/\s+/).filter(w=>w.length>2);
  
  let bestScore=0, bestItem=null;
  
  for(const item of KB){
    let score=0;
    for(const key of item.keys){
      const kn=normalize(key);
      // Full phrase match - highest score
      if(qn.includes(kn)) score+=10;
      // Word overlap
      const kwords=kn.split(/\s+/);
      const overlap=words.filter(w=>kwords.some(kw=>kw.includes(w)||w.includes(kw))).length;
      score+=overlap*2;
    }
    if(score>bestScore){bestScore=score;bestItem=item;}
  }
  
  if(bestScore>=4) return bestItem;
  
  // Fallback: single keyword
  for(const item of KB){
    if(item.keys.some(k=>words.some(w=>normalize(k).includes(w)&&w.length>3))){
      return item;
    }
  }
  return null;
}

function Asistan(){
  const [msgs,setMsgs]=useState([{role:"assistant",text:"Merhaba! Ben Vakıf Katılım Fon Fiyatlama AI Asistanıyım.\n\n📋 ZK Uygulama Talimatı (17.06.2026) bilgi tabanım yüklendi. Serbest dille soru sorabilirsiniz.\n\nÖrnek sorular:\n• TL finansman büyüme sınırı nedir?\n• Net ihracatçı muafiyeti YP'de de geçerli mi?\n• Eksik ZK yaptırımı ne olur?\n• KKDF ve BSMV oranları neler?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef();

  const KB_TEXT = KB.map(k=>`### ${k.title}\n${k.content}`).join("\n\n");

  const SYSTEM = `Sen Vakıf Katılım Bankası Fon Fiyatlama Müdürlüğü AI Asistanısın. Türkçe yanıt ver, kısa ve net ol.

Aşağıdaki iki bilgi tabanını kullan:

## 1. ZK UYGULAMA TALİMATI (17.06.2026)
${KB_TEXT}

## 2. TİCARİ MÜŞTERİLERDEN ALINABİLECEK ÜCRETLER TEBLİĞİ (2020/4 — son güncelleme 31.01.2026)
Bu tebliğ bankaların ticari müşterilerden alabileceği ücretleri düzenler. Temel maddeler:
- Madde 9: Kredi tahsis (%0,20 azami) ve kullandırım (%1,10 azami TL) ücretleri
- Madde 10: Teminatlandırma — 3. kişi maliyetinin %15 fazlası azami
- Madde 11: Erken ödeme ücreti (kredi tarihine göre farklı oranlar — KB'de detay mevcut)
- Madde 15: EFT/Havale/FAST azami ücretleri (06.01.2026 güncel tablolar)
- Madde 20: Üye işyeri ücretleri (referans oran + 0,45 puan; banka kartı %1,04 azami)
- Madde 21: Ticari kart kuralları (ücretsiz kart zorunluluğu, limit aşım yasağı)

Bilgi tabanında olmayan konularda "Bu konuda bilgi tabanımda veri bulunmuyor, lütfen ilgili birimi ile iletişime geçin." de.`;

  const send=async()=>{
    const q=input.trim();
    if(!q||loading)return;
    setInput("");
    const newMsgs=[...msgs,{role:"user",text:q}];
    setMsgs(newMsgs);
    setLoading(true);

    try{
      const apiMsgs=newMsgs
        .filter(m=>m.role!=="assistant"||newMsgs.indexOf(m)>0)
        .map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));

      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system:SYSTEM,
          messages:apiMsgs,
        })
      });
      const data=await res.json();
      const text=data.content?.map(b=>b.text||"").join("")||"Yanıt alınamadı.";
      setMsgs(p=>[...p,{role:"assistant",text}]);
    }catch(e){
      // API erişimi yoksa yerel KB'ye geri dön
      const found=findAnswer(q);
      if(found){
        setMsgs(p=>[...p,{role:"assistant",text:"📋 "+found.title+"\n\n"+found.content}]);
      } else {
        setMsgs(p=>[...p,{role:"assistant",text:"Bağlantı hatası. Lütfen tekrar deneyin."}]);
      }
    }
    setLoading(false);
    setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 112px)"}}>
      <div style={{padding:"9px 16px",background:C.blueLight,borderBottom:`1px solid ${C.border}`,flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:14}}>🤖</span>
        <p style={{margin:0,fontSize:12,color:C.blue,fontWeight:700}}>Claude AI · ZK Talimatı 17.06.2026 yüklü</p>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:12}}>
            <div style={{maxWidth:"88%",padding:"10px 14px",
              borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
              background:m.role==="user"?C.blue:C.card,
              color:m.role==="user"?"#fff":"#1C1C1E",
              fontSize:14,lineHeight:1.65,
              boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
              whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",justifyContent:"flex-start",marginBottom:12}}>
            <div style={{padding:"12px 18px",borderRadius:"18px 18px 18px 4px",background:C.card,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
              <span style={{fontSize:18,letterSpacing:4,color:C.sub}}>· · ·</span>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"10px 16px 24px",background:C.card,borderTop:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder="Serbest dille soru sorun..."
            rows={2}
            style={{flex:1,padding:"10px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,background:"#F9F9FB",outline:"none",resize:"none",fontFamily:"-apple-system,sans-serif",lineHeight:1.4}}/>
          <button onClick={send} disabled={loading||!input.trim()}
            style={{width:42,height:42,borderRadius:21,border:"none",background:input.trim()&&!loading?C.blue:C.border,color:"#fff",fontSize:18,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ─── TAKSİTLİ TİCARİ FİNANSMAN ───────────────────────────────────────────────
function TaksitliTicariFinansman({s}){
  const [tutar,setTutar]=useState("");
  const [vade,setVade]=useState("");
  const [oran,setOran]=useState("");
  const [tip,setTip]=useState("yillik");
  const [showPlan,setShowPlan]=useState(false);

  const r=useCallback(()=>{
    const T=parseFloat(tutar),V=parseFloat(vade),rt=parseFloat(oran);
    if(!T||!V||!rt)return null;
    const ao=tip==="yillik"?rt/12/100:rt/100;
    const kkdf=s.ticariKKDF/100;
    const bsmv=s.ticariBSMV/100;

    const taksit=ao===0?T/V:T*ao/(1-Math.pow(1+ao,-V));
    const toplamOdeme=taksit*V;
    const toplamKarPayi=toplamOdeme-T;

    const kkdfTL=toplamKarPayi*kkdf;
    const bsmvTL=toplamKarPayi*bsmv;
    const plan=hesaplaOdemePlani(T,V,ao,s.ticariBSMV,s.ticariKKDF);
    const aylikTaksit=plan?plan._toplamSabitTaksit:taksit;
    const toplamMaliyet=aylikTaksit?Math.round(aylikTaksit*V*100)/100:toplamOdeme+kkdfTL+bsmvTL;

    return{taksit,aylikTaksit,toplamKarPayi,toplamOdeme,kkdfTL,bsmvTL,plan,toplamMaliyet};
  },[tutar,vade,oran,tip,s])();

  return(
    <div style={{padding:"0 16px 32px"}}>
      {showPlan&&r?.plan&&<OdemePlani plan={r.plan} bsmvOran={s.ticariBSMV} kkdfOran={s.ticariKKDF} onClose={()=>setShowPlan(false)}/>}
      <Card>
        <Seg options={[{v:"aylik",l:"Aylık %"},{v:"yillik",l:"Yıllık %"}]} value={tip} onChange={setTip}/>
        <Field label="Finansman Tutarı" value={tutar} onChange={setTutar} suffix="₺"/>
        <Field label="Vade (Ay)" value={vade} onChange={setVade} suffix="Ay"/>
        <Field label={`Kâr Payı Oranı (${tip==="yillik"?"Yıllık":"Aylık"})`} value={oran} onChange={setOran} suffix="%"/>
      </Card>
      {r&&<>
        <Card>
          <SecTitle>Kâr Payı & Vergi</SecTitle>
          {r.taksit&&<RRow label="Aylık Taksit (Sabit)" value={fmtTL(r.aylikTaksit||r.taksit)} accent={C.blue} big/>}
          <RRow label="Toplam Kâr Payı Geliri" value={fmtTL(r.toplamKarPayi)}/>
          <RRow label={`BSMV (%${s.ticariBSMV})`} value={fmtTL(r.bsmvTL)} sub accent={C.red}/>
          <RRow label={`KKDF (%${s.ticariKKDF})`} value={fmtTL(r.kkdfTL)} sub accent={C.red}/>
          <RRow label="Toplam Müşteri Maliyeti" value={fmtTL(r.toplamMaliyet)} accent={C.green} big/>
          {r.taksit&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
            <button onClick={()=>setShowPlan(true)} style={{padding:"12px",borderRadius:12,border:`1.5px solid ${C.blue}`,background:C.blueLight,color:C.blue,fontWeight:700,fontSize:13,cursor:"pointer"}}>
              📅 Ödeme Planı
            </button>
            <RaporButon baslik="Taksitli Ticari Finansman" plan={r.plan} satirlar={[
              {label:"Aylık Taksit", value:fmtTL(r.aylikTaksit||r.taksit), big:true},
              {label:"Toplam Kâr Payı", value:fmtTL(r.toplamKarPayi)},
              {label:`BSMV (%${s.ticariBSMV})`, value:fmtTL(r.bsmvTL)},
              {label:`KKDF (%${s.ticariKKDF})`, value:fmtTL(r.kkdfTL)},
              {label:"Toplam Müşteri Maliyeti", value:fmtTL(r.toplamMaliyet), big:true},
            ]}/>
          </div>}
        </Card>
      </>}
    </div>
  );
}

function KasaOranAnalizi(){
  const [mod,setMod]=useState("basilden_bilesik");
  const [gunlukOran,setGunlukOran]=useState("");
  const [vadeGun,setVadeGun]=useState("");
  const [hedefBilesik,setHedefBilesik]=useState("");

  const r=useCallback(()=>{
    const G=parseInt(vadeGun);
    if(!G)return null;

    if(mod==="basilden_bilesik"){
      const yb=parseFloat(gunlukOran);
      if(!yb)return null;
      // Günlük oran (360 baz)
      const gunlukR=yb/100/360;
      // N gün bileşik getiri: (1+gunlukR)^N - 1
      const bilesikDonem=Math.pow(1+gunlukR,G)-1;
      // Bu bileşik getiriyi yıllık basit orana çevir: getiri/N*360
      const esdeğerYillikBasil=(bilesikDonem/G)*360*100;
      // 1M ₺ için getiri
      const getiri1M=bilesikDonem*1000000;
      return{mod,yb,G,bilesikDonem:bilesikDonem*100,esdeğerYillikBasil,getiri1M};
    } else {
      const hb=parseFloat(hedefBilesik);
      if(!hb)return null;
      // Hedef yıllık basit → N günlük getiri
      const hedefDonem=hb/100/360*G;
      // Gereken günlük bileşik: (1+hedefDonem)^(1/N) - 1
      const gunlukR=Math.pow(1+hedefDonem,1/G)-1;
      // Yıllık basit eşdeğeri
      const gerekliYillikBasil=gunlukR*360*100;
      return{mod,hb,G,hedefDonem:hedefDonem*100,gerekliYillikBasil};
    }
  },[mod,gunlukOran,vadeGun,hedefBilesik])();

  return(
    <div style={{padding:"0 16px 32px"}}>

      <Card>
        <Seg options={[{v:"basilden_bilesik",l:"Basit → Eşdeğer Basit"},{v:"bilesikten_basil",l:"Hedef Basit → Gerekli"}]} value={mod} onChange={setMod}/>
        <Field label="Temdit Vade (Gün)" value={vadeGun} onChange={setVadeGun} suffix="Gün" hint="Kaç günde bir yenileniyor? (örn: 32, 91)"/>
        {mod==="basilden_bilesik"
          ? <Field label="Yıllık Basit Kâr Payı Oranı" value={gunlukOran} onChange={setGunlukOran} suffix="%" hint="Hesabın açıldığı oran (örn: 40)"/>
          : <Field label="Hedef Yıllık Basit Oran" value={hedefBilesik} onChange={setHedefBilesik} suffix="%" hint="Ulaşmak istediğin eşdeğer basit oran (örn: 40.50)"/>
        }
      </Card>

      {r&&r.mod==="basilden_bilesik"&&<Card>
        <SecTitle>Bileşik Eşdeğer Oran</SecTitle>
        <RRow label="Açılış Oranı (Yıllık Basit)" value={`% ${fmtN(r.yb,2)}`}/>
        <RRow label={`${r.G} Günlük Getiri`} value={`% ${fmtN(r.bilesikDonem,4)}`} sub accent={C.orange}/>
        <div style={{height:1,background:C.border,margin:"6px 0"}}/>
        <RRow label="Bileşik Eşdeğer Yıllık Basit" value={`% ${fmtN(r.esdeğerYillikBasil,4)}`} accent={C.blue} big/>
        <div style={{background:C.blueLight,borderRadius:10,padding:"12px 14px",marginTop:10}}>
          <p style={{margin:0,fontSize:14,color:C.blue,fontWeight:800,lineHeight:1.6}}>
            %{fmtN(r.yb,2)} ile açılan hesap {r.G} gün temdit edilince
          </p>
          <p style={{margin:"2px 0 0",fontSize:18,fontWeight:800,color:"#1C3A5E"}}>
            ≡ %{fmtN(r.esdeğerYillikBasil,4)} yıllık basit
          </p>
          <p style={{margin:"6px 0 0",fontSize:12,color:C.sub}}>
            1.000.000 ₺ için {r.G} günlük getiri: {fmtTL(r.getiri1M)}
          </p>
        </div>
      </Card>}

      {r&&r.mod==="bilesikten_basil"&&<Card>
        <SecTitle>Gereken Açılış Oranı</SecTitle>
        <RRow label="Hedef Eşdeğer Basit Oran" value={`% ${fmtN(r.hb,2)}`}/>
        <RRow label={`${r.G} Günlük Hedef Getiri`} value={`% ${fmtN(r.hedefDonem,4)}`} sub accent={C.orange}/>
        <div style={{height:1,background:C.border,margin:"6px 0"}}/>
        <RRow label="Gereken Açılış Oranı (Yıllık Basit)" value={`% ${fmtN(r.gerekliYillikBasil,4)}`} accent={C.blue} big/>
        <div style={{background:C.blueLight,borderRadius:10,padding:"12px 14px",marginTop:10}}>
          <p style={{margin:0,fontSize:14,color:C.blue,fontWeight:800,lineHeight:1.6}}>
            {r.G} günde %{fmtN(r.hb,2)} eşdeğer basit elde etmek için
          </p>
          <p style={{margin:"2px 0 0",fontSize:18,fontWeight:800,color:"#1C3A5E"}}>
            %{fmtN(r.gerekliYillikBasil,4)} ile açılmalı
          </p>
        </div>
      </Card>}
    </div>
  );
}


function VerimliliKAnalizi({s}){
  const [tutar,setTutar]=useState("");
  const [vade,setVade]=useState("");
  const [getiriOrani,setGetiriOrani]=useState("");
  const [doviz,setDoviz]=useState("TL");
  const [katilim,setKatilim]=useState("vadesiz");

  // TL ZK oranları (vadeye göre)
  const TL_ZK={vadesiz:17,"1ay":17,"3ay":10,"6ay":10,"1yil":10};
  // YP ZK oranları (ilave %2.5 dahil)
  const YP_ZK={vadesiz:32.5,"1ay":32.5,"3ay":28.5,"6ay":28.5,"1yil":28.5};

  // Vade gün sayıları (ZK hesabı için)
  const VADE_GUN={vadesiz:1,"1ay":31,"3ay":92,"6ay":182,"1yil":365};

  const KATILIM_OPTS=[
    {v:"vadesiz",l:"Vadesiz"},
    {v:"1ay",l:"1 Ay"},
    {v:"3ay",l:"3 Ay"},
    {v:"6ay",l:"6 Ay"},
    {v:"1yil",l:"1 Yıl"},
  ];

  const r=useCallback(()=>{
    const T=parseFloat(tutar);
    if(!T)return null;

    const zkOran=(doviz==="TL"?TL_ZK:YP_ZK)[katilim]/100;
    // Kullanılabilir tutar = Toplam × (1 - ZK oranı)
    const kullanilanTutar=Math.round(T*(1-zkOran)*100)/100;
    const zkTutar=T-kullanilanTutar;
    const vadeGun=parseInt(vade)||VADE_GUN[katilim];

    if(!getiriOrani||!vade)return{kullanilanTutar,zkTutar,zkOran:zkOran*100,T};

    const go=parseFloat(getiriOrani);
    const gunlukOran=go/100/360;

    // Getiri sadece kullanılan tutar üzerinden (ZK bloke kısım getiri sağlamaz)
    const brutFaiz=Math.round(kullanilanTutar*gunlukOran*vadeGun*100)/100;

    // Efektif yıllık getiri (toplam tutar üzerinden)
    const efektifYillik=(brutFaiz/T)/vadeGun*360*100;

    // Getiri oranının ZK etkisiyle azalması
    const efektifVsNominal=go*(1-zkOran);

    return{
      kullanilanTutar,zkTutar,zkOran:zkOran*100,T,
      brutFaiz,efektifYillik,efektifVsNominal,
      vadeGun,go,
      spread:go-s.fonlamaMaliyeti,
    };
  },[tutar,vade,getiriOrani,doviz,katilim])();

  const zkOranGoster=(doviz==="TL"?TL_ZK:YP_ZK)[katilim];
  const tutarNum=parseFloat(tutar)||0;
  const kullanilanAuto=Math.round(tutarNum*(1-zkOranGoster/100)*100)/100;

  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Seg options={[{v:"TL",l:"Türk Lirası (TL)"},{v:"YP",l:"Yabancı Para (YP)"}]} value={doviz} onChange={setDoviz}/>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:C.sub,marginBottom:6}}>Cari Katılım Dilimi</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:5,marginBottom:14}}>
          {KATILIM_OPTS.map(o=>(
            <button key={o.v} onClick={()=>setKatilim(o.v)} style={{
              padding:"8px 2px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,
              background:katilim===o.v?C.blue:"#F0F4F8",
              color:katilim===o.v?"#fff":C.sub,
            }}>{o.l}</button>
          ))}
        </div>
        {/* ZK oranı bandı */}
        <div style={{background:C.blueLight,borderRadius:10,padding:"8px 14px",marginBottom:14,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:12,color:C.blue,fontWeight:600}}>ZK Oranı ({doviz})</span>
          <span style={{fontSize:14,fontWeight:800,color:C.blue}}>% {zkOranGoster}</span>
        </div>
        <Field label="Tutar" value={tutar} onChange={setTutar} suffix={doviz==="TL"?"₺":"$"}/>
        {/* ZK Dahil Tutar - otomatik, read-only */}
        {tutarNum>0&&<div style={{background:"#F0F4F8",borderRadius:10,padding:"11px 14px",marginBottom:14,border:`1.5px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:12,color:C.sub,fontWeight:600}}>Kullanılabilir Tutar (ZK Sonrası)</span>
            <span style={{fontSize:15,fontWeight:800,color:C.green}}>{fmtTL(kullanilanAuto)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
            <span style={{fontSize:11,color:C.sub}}>ZK Bloke Tutarı</span>
            <span style={{fontSize:13,fontWeight:700,color:C.red}}>{fmtTL(tutarNum-kullanilanAuto)}</span>
          </div>
        </div>}
        <Field label="Vade (Gün)" value={vade} onChange={setVade} suffix="Gün" hint={`Seçilen dilim: ${VADE_GUN[katilim]} gün`}/>
        <Field label="Kâr Payı Oranı (Yıllık %)" value={getiriOrani} onChange={setGetiriOrani} suffix="%"/>
      </Card>

      {r&&r.brutFaiz!==undefined&&<Card>
        <SecTitle>Verimlilik Analizi</SecTitle>
        <RRow label="Toplam Tutar" value={fmtTL(r.T)}/>
        <RRow label={`ZK Bloke (%${fmtN(r.zkOran)})`} value={`- ${fmtTL(r.zkTutar)}`} sub accent={C.red}/>
        <RRow label="Kullanılabilir Tutar" value={fmtTL(r.kullanilanTutar)} accent={C.blue}/>
        <div style={{height:1,background:C.border,margin:"6px 0"}}/>
        <RRow label={`Brüt Kâr Payı (${r.vadeGun} Gün)`} value={fmtTL(r.brutFaiz)} accent={C.orange} big/>
        <div style={{height:1,background:C.border,margin:"6px 0"}}/>
        <RRow label="Efektif Yıllık Getiri (ZK Dahil)" value={`% ${fmtN(r.efektifYillik)}`} accent={C.green} big/>
        <RRow label="ZK Zorunlu Karşılık Getiri Kaybı" value={`- % ${fmtN(r.go - r.efektifVsNominal, 2)}`} sub accent={C.red}/>
        <RRow label={`Spread (vs Fonlama %${fmtN(s.fonlamaMaliyeti)} yıllık)`} value={`% ${fmtN(r.spread)}`} sub accent={r.spread>=0?C.green:C.red}/>
      </Card>}
    </div>
  );
}


// ─── FİNANSAL TAKVİM ────────────────────────────────────────────────────────
function FinansalTakvim(){
  const [filtre,setFiltre]=useState("tumu");
  const bugun=new Date(); bugun.setHours(0,0,0,0);

  // ZK tarihleri: 19 Haz 2026 başlangıç, 2 haftada bir Cuma
  const zkTarihleri=[];
  const zkStart=new Date(2026,5,19); // 19 Haziran 2026
  for(let i=0;i<40;i++){
    const t=new Date(zkStart);
    t.setDate(zkStart.getDate()+i*14);
    if(t.getFullYear()>2027) break;
    zkTarihleri.push(t);
  }

  // PPK tarihleri 2026 (TCMB resmi)
  const PPK_2026=[
    new Date(2026,0,22),new Date(2026,2,12),new Date(2026,3,22),
    new Date(2026,5,11),new Date(2026,6,23),new Date(2026,8,10),
    new Date(2026,9,22),new Date(2026,11,10),
  ];

  // TL Payı Rasyo: 03/07/2026 başlangıç, 8 haftada bir Cuma
  const tlPayiTarihleri=[];
  const tlStart=new Date(2026,6,3); // 3 Temmuz 2026
  for(let i=0;i<20;i++){
    const t=new Date(tlStart);
    t.setDate(tlStart.getDate()+i*56); // 8 hafta = 56 gün
    if(t.getFullYear()>2027) break;
    tlPayiTarihleri.push(t);
  }

  // Kredi Büyüme tarihleri: 17/07/2026 başlangıç, 8 haftada bir Cuma
  const krediTarihleri=[];
  const krediStart=new Date(2026,6,17); // 17 Temmuz 2026
  for(let i=0;i<20;i++){
    const t=new Date(krediStart);
    t.setDate(krediStart.getDate()+i*56); // 8 hafta = 56 gün
    if(t.getFullYear()>2027) break;
    krediTarihleri.push(t);
  }

  const tumEvents=[
    ...PPK_2026.map(t=>({tarih:t,tip:"ppk",label:"PPK Toplantısı",renk:"#9C3060",bg:"#FCE4EC",icon:"🏛️"})),
    ...zkTarihleri.map(t=>({tarih:t,tip:"zk",label:"ZK Hesaplama",renk:C.blue,bg:C.blueLight,icon:"📊"})),
    ...tlPayiTarihleri.map(t=>({tarih:t,tip:"tlpayi",label:"TL Payı Rasyo Hesaplama",renk:C.green,bg:C.greenLight,icon:"📈"})),
    ...krediTarihleri.map(t=>({tarih:t,tip:"kredi",label:"Kredi Büyüme Hesaplama",renk:C.orange,bg:C.orangeLight,icon:"💳"})),
  ]
  .filter(e=>e.tarih>=bugun)
  .sort((a,b)=>a.tarih-b.tarih);

  const filtreliEvents=filtre==="tumu"?tumEvents:tumEvents.filter(e=>e.tip===filtre);

  const MONTHS=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const DAYS=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
  const formatTarih=(d)=>`${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${DAYS[d.getDay()]}`;
  const kalanGun=(d)=>{
    const diff=Math.round((d-bugun)/(1000*60*60*24));
    if(diff===0)return{text:"Bugün",renk:"#B83232"};
    if(diff===1)return{text:"Yarın",renk:C.orange};
    if(diff<=7)return{text:`${diff} gün`,renk:C.orange};
    return{text:`${diff} gün`,renk:C.sub};
  };

  const FILTRELER=[
    {v:"tumu",l:"Tümü",renk:"#1C3A5E"},
    {v:"ppk",l:"PPK",renk:"#9C3060",icon:"🏛️"},
    {v:"zk",l:"ZK",renk:C.blue,icon:"📊"},
    {v:"tlpayi",l:"TL Payı",renk:C.green,icon:"📈"},
    {v:"kredi",l:"Kredi Büyüme",renk:C.orange,icon:"💳"},
  ];

  const yaklasan=tumEvents.filter(e=>Math.round((e.tarih-bugun)/(1000*60*60*24))<=7).length;

  return(
    <div style={{padding:"0 16px 32px"}}>
      {yaklasan>0&&<div style={{background:"#FEF3C7",borderRadius:12,padding:"10px 14px",marginBottom:14,border:"1px solid #F59E0B",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:18}}>⚠️</span>
        <p style={{margin:0,fontSize:13,color:"#92400E",fontWeight:700}}>Önümüzdeki 7 günde {yaklasan} önemli tarih var</p>
      </div>}
      <div style={{display:"flex",gap:8,marginBottom:18,overflowX:"auto",paddingBottom:4,WebkitOverflowScrolling:"touch"}}>
        {FILTRELER.map(f=>(
          <button key={f.v} onClick={()=>setFiltre(f.v)} style={{
            padding:"11px 18px",borderRadius:24,border:"none",cursor:"pointer",
            fontWeight:700,fontSize:14,whiteSpace:"nowrap",flexShrink:0,
            background:filtre===f.v?f.renk:"#F0F4F8",
            color:filtre===f.v?"#fff":C.sub,
            boxShadow:filtre===f.v?"0 3px 10px rgba(0,0,0,0.15)":"none",
          }}>{f.icon?f.icon+" ":""}{f.l}</button>
        ))}
      </div>
      {filtreliEvents.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.sub}}>
        <p style={{fontSize:36,margin:"0 0 8px"}}>📅</p>
        <p style={{fontSize:14,fontWeight:600}}>Bu kategoride yaklaşan tarih yok</p>
      </div>}
      {filtreliEvents.map((e,i)=>{
        const kg=kalanGun(e.tarih);
        const oncekiAy=i===0?-1:filtreliEvents[i-1].tarih.getMonth();
        const yeniAy=oncekiAy!==e.tarih.getMonth();
        return(
          <div key={i}>
            {yeniAy&&<p style={{fontSize:12,fontWeight:800,color:C.sub,textTransform:"uppercase",letterSpacing:"0.08em",margin:"16px 0 8px"}}>{MONTHS[e.tarih.getMonth()]} {e.tarih.getFullYear()}</p>}
            <div style={{display:"flex",alignItems:"center",gap:12,background:C.card,borderRadius:12,padding:"12px 14px",marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,0.07)",borderLeft:`4px solid ${e.renk}`}}>
              <div style={{width:40,height:40,borderRadius:10,background:e.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                {e.icon}
              </div>
              <div style={{flex:1}}>
                <p style={{margin:0,fontSize:14,fontWeight:700,color:"#1C1C1E"}}>{e.label}</p>
                <p style={{margin:"2px 0 0",fontSize:12,color:C.sub}}>{formatTarih(e.tarih)}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <p style={{margin:0,fontSize:13,fontWeight:800,color:kg.renk}}>{kg.text}</p>
                <p style={{margin:"1px 0 0",fontSize:10,color:C.sub}}>kaldı</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


// ─── TM KOMİSYON ─────────────────────────────────────────────────────────────
function TmKomisyon(){
  const [tutar,setTutar]=useState("");
  const [oran,setOran]=useState("");
  const [vade,setVade]=useState("");
  const [odeme,setOdeme]=useState("aylik");

  const r=useCallback(()=>{
    const T=parseFloat(tutar),rt=parseFloat(oran),G=parseInt(vade);
    if(!T||!rt||!G)return null;
    // Yıllık oran üzerinden gün bazlı hesap (360)
    const gunlukOran=rt/100/360;
    const toplamKomisyon=Math.round(T*gunlukOran*G*100)/100;

    let plan=[];
    if(odeme==="aylik"){
      // Aylık: her 30 günde bir eşit taksit
      const aylik=Math.ceil(G/30);
      const aylikTutar=Math.round(toplamKomisyon/aylik*100)/100;
      for(let i=1;i<=aylik;i++){
        plan.push({donem:`${i}. Ay`,tutar:i===aylik?toplamKomisyon-(aylikTutar*(aylik-1)):aylikTutar,gun:Math.min(i*30,G)});
      }
    } else if(odeme==="uc_aylik"){
      // 3 aylık: her 90 günde bir
      const donem=Math.ceil(G/90);
      const donemTutar=Math.round(toplamKomisyon/donem*100)/100;
      for(let i=1;i<=donem;i++){
        plan.push({donem:`${i}. Çeyrek`,tutar:i===donem?toplamKomisyon-(donemTutar*(donem-1)):donemTutar,gun:Math.min(i*90,G)});
      }
    } else {
      // Flat: tek seferinde
      plan=[{donem:"Vade Sonu",tutar:toplamKomisyon,gun:G}];
    }
    return{toplamKomisyon,plan,gunlukKomisyon:T*gunlukOran};
  },[tutar,oran,vade,odeme])();

  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <Seg options={[{v:"aylik",l:"Aylık"},{v:"uc_aylik",l:"3 Aylık"},{v:"flat",l:"Flat"}]} value={odeme} onChange={setOdeme}/>
        <Field label="TM Tutarı" value={tutar} onChange={setTutar} suffix="₺"/>
        <Field label="Yıllık Komisyon Oranı" value={oran} onChange={setOran} suffix="%"/>
        <Field label="Vade (Gün)" value={vade} onChange={setVade} suffix="Gün"/>
      </Card>
      {r&&<>
        <Card>
          <SecTitle>TM Komisyon Özeti</SecTitle>
          <RRow label="Günlük Komisyon" value={fmtTL(r.gunlukKomisyon)} sub/>
          <RRow label="Toplam Komisyon" value={fmtTL(r.toplamKomisyon)} accent={C.blue} big/>
          <RRow label="Ödeme Şekli" value={odeme==="aylik"?"Aylık":odeme==="uc_aylik"?"3 Aylık":"Flat (Tek Seferinde)"} sub/>
        </Card>
        <Card>
          <SecTitle>Ödeme Planı</SecTitle>
          {r.plan.map((p,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
              <div>
                <p style={{margin:0,fontSize:13,fontWeight:700,color:C.blue}}>{p.donem}</p>
                <p style={{margin:0,fontSize:11,color:C.sub}}>{p.gun}. gün</p>
              </div>
              <span style={{fontSize:15,fontFamily:"monospace",fontWeight:800,color:"#1C1C1E"}}>{fmtTL(p.tutar)}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",marginTop:2}}>
            <span style={{fontSize:13,fontWeight:800,color:C.label}}>TOPLAM</span>
            <span style={{fontSize:15,fontFamily:"monospace",fontWeight:800,color:C.blue}}>{fmtTL(r.toplamKomisyon)}</span>
          </div>
        </Card>
      </>}
    </div>
  );
}

// ─── AKREDİTİF KOMİSYON ──────────────────────────────────────────────────────
function AkreditifKomisyon(){
  const [doviz,setDoviz]=useState("USD");
  const [tutar,setTutar]=useState("");
  const [tolerans,setTolerans]=useState("10");
  const [acilisTarih,setAcilisTarih]=useState("");
  const [sonYuklemeTarih,setSonYuklemeTarih]=useState("");
  const [ibrazGun,setIbrazGun]=useState("21");
  const [komisyonOran,setKomisyonOran]=useState("");

  const DOVIZ_SEMBOL={TL:"₺",USD:"$",EUR:"€"};
  const sembol=DOVIZ_SEMBOL[doviz];
  const fmtDoviz=(n)=>isNaN(n)||n===null?"—":`${sembol}${new Intl.NumberFormat("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)}`;

  const r=useCallback(()=>{
    const T=parseFloat(tutar);
    if(!T)return null;
    const tolOran=parseFloat(tolerans)||0;
    const maxTutar=Math.round(T*(1+tolOran/100)*100)/100;

    let vadeSuresi=null,ibrazSuresi=null,toplamVade=null,vadeBitis=null;
    if(acilisTarih&&sonYuklemeTarih){
      const ac=new Date(acilisTarih);
      const sy=new Date(sonYuklemeTarih);
      vadeSuresi=Math.round((sy-ac)/(1000*60*60*24));
      ibrazSuresi=parseInt(ibrazGun)||21;
      toplamVade=vadeSuresi+ibrazSuresi;
      vadeBitis=new Date(sy);
      vadeBitis.setDate(vadeBitis.getDate()+ibrazSuresi);
    }

    const oran=parseFloat(komisyonOran);
    if(!oran||!toplamVade)return{maxTutar,tolOran,vadeSuresi,ibrazSuresi,toplamVade,vadeBitis};

    const komisyon=Math.round(maxTutar*(oran/100/360)*toplamVade*100)/100;
    const bsmv=Math.round(komisyon*0.05*100)/100;
    const toplamMaliyet=Math.round((komisyon+bsmv)*100)/100;

    return{maxTutar,tolOran,vadeSuresi,ibrazSuresi,toplamVade,vadeBitis,komisyon,bsmv,toplamMaliyet,oran};
  },[tutar,tolerans,acilisTarih,sonYuklemeTarih,ibrazGun,komisyonOran])();

  const MONTHS=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const fmtDate=(d)=>d?`${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`:"—";

  return(
    <div style={{padding:"0 16px 32px"}}>
      <Card>
        <div style={{marginBottom:8,padding:"8px 12px",background:C.blueLight,borderRadius:10}}>
          <p style={{margin:0,fontSize:13,fontWeight:700,color:C.blue}}>🏦 İthalat Akreditifi</p>
        </div>
        <Seg options={[{v:"USD",l:"$ USD"},{v:"EUR",l:"€ EUR"},{v:"TL",l:"₺ TL"}]} value={doviz} onChange={setDoviz}/>
        <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:10}}>
          <Field label={`Akreditif Tutarı (${doviz})`} value={tutar} onChange={setTutar} suffix={sembol}/>
          <Field label="Tolerans" value={tolerans} onChange={setTolerans} suffix="%" hint="Std: %10"/>
        </div>
        {r?.maxTutar&&tutar&&<div style={{background:C.blueLight,borderRadius:10,padding:"9px 12px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:C.blue,fontWeight:600}}>Tolerans Dahil Azami Tutar</span>
          <span style={{fontSize:15,fontWeight:800,color:C.blue}}>{fmtDoviz(r.maxTutar)}</span>
        </div>}
        <label style={{display:"block",fontSize:12,fontWeight:600,color:C.sub,marginBottom:4}}>Akreditif Açılış Tarihi</label>
        <input type="date" value={acilisTarih} onChange={e=>setAcilisTarih(e.target.value)}
          style={{width:"100%",boxSizing:"border-box",padding:"11px 13px",fontSize:15,fontWeight:600,background:"#F9F9FB",border:`1.5px solid ${C.border}`,borderRadius:10,color:"#1C1C1E",outline:"none",marginBottom:13}}/>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:C.sub,marginBottom:4}}>Son Yükleme Tarihi</label>
        <input type="date" value={sonYuklemeTarih} onChange={e=>setSonYuklemeTarih(e.target.value)}
          style={{width:"100%",boxSizing:"border-box",padding:"11px 13px",fontSize:15,fontWeight:600,background:"#F9F9FB",border:`1.5px solid ${C.border}`,borderRadius:10,color:"#1C1C1E",outline:"none",marginBottom:13}}/>
        <Field label="İbraz Süresi (Son yükleme + gün)" value={ibrazGun} onChange={setIbrazGun} suffix="Gün" hint="Standart: 21 gün"/>
        {r?.toplamVade&&<div style={{background:"#F0F4F8",borderRadius:10,padding:"10px 12px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:12,color:C.sub}}>Akreditif Süresi</span>
            <span style={{fontSize:13,fontWeight:700,color:C.label}}>{r.vadeSuresi} gün</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:12,color:C.sub}}>+ İbraz Süresi</span>
            <span style={{fontSize:13,fontWeight:700,color:C.label}}>{r.ibrazSuresi} gün</span>
          </div>
          <div style={{height:1,background:C.border,margin:"6px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:13,fontWeight:700,color:C.label}}>Toplam Vade</span>
            <span style={{fontSize:14,fontWeight:800,color:C.blue}}>{r.toplamVade} gün</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:12,color:C.sub}}>Vade Bitiş Tarihi</span>
            <span style={{fontSize:12,fontWeight:700,color:C.orange}}>{fmtDate(r.vadeBitis)}</span>
          </div>
        </div>}
        <Field label="Komisyon Oranı (Yıllık %)" value={komisyonOran} onChange={setKomisyonOran} suffix="%"/>
      </Card>

      {r?.komisyon!==undefined&&<Card>
        <SecTitle>İthalat Akreditifi Komisyon Analizi ({doviz})</SecTitle>
        <RRow label="Akreditif Tutarı" value={fmtDoviz(parseFloat(tutar)||0)}/>
        <RRow label={`Tolerans (+%${r.tolOran})`} value={fmtDoviz(r.maxTutar-(parseFloat(tutar)||0))} sub accent={C.orange}/>
        <RRow label="Azami Tutar (Komisyon Bazı)" value={fmtDoviz(r.maxTutar)}/>
        <div style={{height:1,background:C.border,margin:"6px 0"}}/>
        <RRow label="Toplam Vade" value={`${r.toplamVade} gün`} sub/>
        <RRow label={`Komisyon (%${fmtN(r.oran,4)} × ${r.toplamVade} gün)`} value={fmtDoviz(r.komisyon)}/>
        <RRow label="BSMV (%5)" value={fmtDoviz(r.bsmv)} sub accent={C.red}/>
        <RRow label="Toplam Maliyet" value={fmtDoviz(r.toplamMaliyet)} accent={C.blue} big/>
      </Card>}
    </div>
  );
}


// ─── FİNANSAL GÖSTERGELER ───────────────────────────────────────────────────
function FinansalGostergeler(){
  const [kurlar,setKurlar]=useState(null);
  const [yukleniyor,setYukleniyor]=useState(true);
  const [sonGuncelleme,setSonGuncelleme]=useState(null);

  // Fallback: 24 Haz 2026 19:41 Investing.com
  const FALLBACK=[
    {ad:"USD/TRY",deger:"46,4953",canli:false},
    {ad:"EUR/TRY",deger:"52,8978",canli:false},
    {ad:"Altın/TRY (Gram)",deger:"5.994,00",canli:false},
    {ad:"Gümüş/TRY (Gram)",deger:"87,68",canli:false},
    {ad:"EUR/USD",deger:"1,1365",canli:false},
    {ad:"Ons Altın/USD",deger:"4.024,00",canli:false},
  ];

  useEffect(()=>{
    const fetch2=async()=>{
      try{
        const r=await Promise.race([
          fetch('https://open.er-api.com/v6/latest/USD'),
          new Promise((_,rej)=>setTimeout(()=>rej('t'),5000))
        ]);
        if(!r.ok)throw new Error();
        const d=await r.json();
        const usdTry=d.rates?.TRY;
        const eurUsd=d.rates?.EUR?1/d.rates.EUR:null;
        const eurTry=usdTry&&d.rates?.EUR?usdTry/d.rates.EUR:null;
        const fmt=(n,dec)=>n!=null?n.toLocaleString('tr-TR',{minimumFractionDigits:dec,maximumFractionDigits:dec}):null;
        setKurlar([
          {ad:"USD/TRY",deger:fmt(usdTry,4),canli:true},
          {ad:"EUR/TRY",deger:fmt(eurTry,4),canli:true},
          {ad:"Altın/TRY (Gram)",deger:"—",canli:false,not:"Manuel"},
          {ad:"Gümüş/TRY (Gram)",deger:"—",canli:false,not:"Manuel"},
          {ad:"EUR/USD",deger:fmt(eurUsd,4),canli:true},
          {ad:"Ons Altın/USD",deger:"—",canli:false,not:"Manuel"},
        ]);
        setSonGuncelleme(new Date());
      }catch(e){
        setKurlar(null);
      }finally{
        setYukleniyor(false);
      }
    };
    fetch2();
  },[]);

  const gosterKurlar=kurlar||FALLBACK;
  const canliVar=kurlar!==null;

  const SABIT=[
    {kategori:"Faiz & Para Politikası",icon:"🏛️",color:"#2C5F8A",items:[
      {ad:"TCMB Politika Faizi",deger:"%37,00",tarih:"Haziran 2026"},
      {ad:"TCMB Üst Bant (Borç Verme)",deger:"%40,00",tarih:"Haziran 2026"},
      {ad:"TCMB Alt Bant (Borçlanma)",deger:"%34,00",tarih:"Haziran 2026"},
    ]},
    {kategori:"Enflasyon",icon:"📊",color:"#B83232",items:[
      {ad:"TÜFE (Yıllık)",deger:"%32,61",tarih:"Mayıs 2026"},
      {ad:"TÜFE (Aylık)",deger:"%1,71",tarih:"Mayıs 2026"},
      {ad:"Yİ-ÜFE (Yıllık)",deger:"%28,93",tarih:"Mayıs 2026"},
      {ad:"Yİ-ÜFE (Aylık)",deger:"%2,75",tarih:"Mayıs 2026"},
      {ad:"Çekirdek Enflasyon (C - Yıllık)",deger:"%30,44",tarih:"Mayıs 2026"},
    ]},
    {kategori:"CDS & Risk",icon:"⚡",color:"#9C3060",items:[
      {ad:"Türkiye 5Y CDS",deger:"~250 bps",tarih:"Haziran 2026"},
      {ad:"EMBI+ Türkiye",deger:"~280 bps",tarih:"Haziran 2026"},
    ]},
    {kategori:"Borsa & Sermaye",icon:"📈",color:"#2E7D5C",items:[
      {ad:"BIST 100",deger:"~11.200",tarih:"Haziran 2026"},
      {ad:"Gösterge Tahvil (2Y)",deger:"%35,50",tarih:"Haziran 2026"},
      {ad:"Gösterge Tahvil (10Y)",deger:"%28,50",tarih:"Haziran 2026"},
    ]},
  ];

  return(
    <div style={{padding:"0 16px 32px"}}>
      {/* Döviz & Emtia Kurları */}
      <div style={{background:"linear-gradient(135deg,#1C3A5E 0%,#2C5F8A 100%)",borderRadius:16,padding:"16px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <p style={{margin:0,fontSize:14,fontWeight:800,color:"#fff"}}>💱 Döviz & Emtia</p>
          <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,0.75)"}}>
            {yukleniyor?"⏳ Yükleniyor...":
             canliVar?`🟢 ${sonGuncelleme?.toLocaleTimeString('tr-TR')} canlı`:
             "🟡 Manuel — 24 Haz 19:41"}
          </p>
        </div>
        {yukleniyor?(
          <div style={{textAlign:"center",padding:"20px"}}>
            <p style={{margin:0,fontSize:22,letterSpacing:8,color:"rgba(255,255,255,0.4)"}}>· · ·</p>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {gosterKurlar.map((k,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.12)",borderRadius:10,padding:"10px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.65)",fontWeight:600,flex:1}}>{k.ad}</p>
                  {k.not&&<span style={{fontSize:9,color:"rgba(255,200,0,0.8)",fontWeight:600,flexShrink:0}}>{k.not}</span>}
                </div>
                <p style={{margin:"4px 0 0",fontSize:17,fontWeight:800,color:k.canli?"#fff":"rgba(255,255,255,0.7)",fontFamily:"monospace"}}>{k.deger||"—"}</p>
              </div>
            ))}
          </div>
        )}
        {!yukleniyor&&!canliVar&&(
          <div style={{marginTop:10,background:"rgba(255,200,0,0.15)",borderRadius:8,padding:"7px 12px"}}>
            <p style={{margin:0,fontSize:11,color:"rgba(255,220,100,0.9)"}}>⚠️ Canlı kur alınamadı. Netlify üzerinden açıldığında USD/TRY ve EUR/TRY anlık çalışır.</p>
          </div>
        )}
      </div>

      <div style={{background:"#EBF3FB",borderRadius:10,padding:"9px 12px",marginBottom:14,display:"flex",gap:8,alignItems:"flex-start",border:`1px solid ${C.blue}`}}>
        <span style={{fontSize:13}}>ℹ️</span>
        <p style={{margin:0,fontSize:11,color:C.blue,lineHeight:1.4}}>Altın ve gümüş fiyatları periyodik güncellenir. Anlık takip için TCMB ve Bloomberg'e başvurun.</p>
      </div>

      {SABIT.map((kat,ki)=>(
        <div key={ki} style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <span style={{fontSize:16}}>{kat.icon}</span>
            <p style={{fontSize:12,fontWeight:800,color:kat.color,textTransform:"uppercase",letterSpacing:"0.06em",margin:0}}>{kat.kategori}</p>
          </div>
          <div style={{background:C.card,borderRadius:14,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.07)"}}>
            {kat.items.map((item,ii)=>(
              <div key={ii} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 16px",borderBottom:ii<kat.items.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:13,fontWeight:700,color:C.label}}>{item.ad}</p>
                  <p style={{margin:"1px 0 0",fontSize:10,color:C.sub}}>{item.tarih}</p>
                </div>
                <span style={{fontSize:15,fontWeight:800,color:kat.color,fontFamily:"monospace",marginLeft:8}}>{item.deger}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


// ─── MENÜ TANIMLARI ──────────────────────────────────────────────────────────
const MENU = {
  home: null,
  katilimMenu:{title:"Katılım Fonu Hesaplama Araçları",back:"home"},
  finansmanMenu:{title:"Bireysel Finansman Araçları",back:"home"},
  ticariMenu:{title:"Tüzel Finansman Araçları",back:"home"},
  // katılım fonu
  vadeliKatilim:{title:"Katılım Hesabı Getiri Hesaplama",back:"katilimMenu"},
  getiridenAnapara:{title:"Getiriden Anapara Hesaplama",back:"katilimMenu"},
  oranAnalizi:{title:"Günlük Hesap Oran Hesaplama",back:"katilimMenu"},
  birikimHesapla:{title:"Birikim Hesapla",back:"katilimMenu"},
  tahvilBono:{title:"Sukuk & Kira Sertifikası",back:"katilimMenu"},
  kasaOranAnalizi:{title:"Kasa Hesabı Oran Analizi",back:"katilimMenu"},
  verimlilikAnalizi:{title:"Verimlilik Analizi",back:"katilimMenu"},
  // bireysel finansman (sadece 3)
  konutFinansman:{title:"Konut Finansmanı",back:"finansmanMenu"},
  tasitFinansman:{title:"Taşıt Finansmanı",back:"finansmanMenu"},
  yatirimFonuFinansman:{title:"Yatırım Fonu Finansmanı",back:"finansmanMenu"},
  taksitenKredi:{title:"Taksitten Tutar Hesaplama",back:"finansmanMenu"},
  // ticari finansman (spot + leasing + taksitli ticari)
  spotFinansman:{title:"Spot Finansman",back:"ticariMenu"},
  taksitliTicari:{title:"Taksitli Ticari Finansman",back:"ticariMenu"},
  leasing:{title:"Leasing",back:"ticariMenu"},
  posHesaplama:{title:"POS Komisyon Hesaplama",back:"ticariMenu"},
  akreditifKomisyon:{title:"Akreditif Komisyon Hesaplama",back:"ticariMenu"},
  // diğer
  asistan:{title:"VK Asistan",back:"home"},
  finansalTakvim:{title:"Finansal Takvim",back:"home"},
  finansalGostergeler:{title:"Finansal Göstergeler",back:"home"},
  ayarlar:{title:"Ayarlar",back:"home"},
};

// ─── ANA UYGULAMA ─────────────────────────────────────────────────────────────
// ─── POS KÂRLILİK ANALİZİ ────────────────────────────────────────────────────
function PosHesaplama({s}){
  const [ciro,       setCiro]       = useState("");  // ZORUNLU - aylık POS cirosu
  const [komisyon,   setKomisyon]   = useState("");  // uygulanan komisyon %
  const [blokGun,    setBlokGun]    = useState("");  // bloke / valör gün
  const [cariOrt,    setCariOrt]    = useState("");  // cari hesap aylık ortalama ₺
  const [vadOrt,     setVadOrt]     = useState("");  // vadeli katılım aylık ortalama ₺
  const [cariKarPay, setCariKarPay] = useState("");  // cari kâr payı yıllık %
  const [vadKarPay,  setVadKarPay]  = useState("");  // vadeli kâr payı yıllık %

  const referans   = parseFloat(s.referansOran) || 3.11;
  const bkmTakas   = parseFloat(s.bkmTakas)     || 1.20;
  const AZAMI_KOM  = parseFloat((referans + 0.45).toFixed(4));
  const AZAMI_BLOK = 40;

  const ciroVal  = parseFloat(ciro)      || 0;
  const komVal   = parseFloat(komisyon)  || 0;
  const blokVal  = parseFloat(blokGun)   || 0;
  const cariVal  = parseFloat(cariOrt)   || 0;
  const vadVal   = parseFloat(vadOrt)    || 0;
  const cariKO   = (parseFloat(cariKarPay) || 0) / 12;  // aylık %
  const vadKO    = (parseFloat(vadKarPay)  || 0) / 12;  // aylık %

  // ── Kural kontrolleri ─────────────────────────────────────────────────────
  // Müşteri efektif maliyet: komisyon × (1 + blokGün/30) ≤ 3,56
  const efektifMusteri = komVal * (1 + blokVal / 30);

  // Max izinli komisyon bu bloke için
  const maxKomForBlok = blokVal > 0
    ? parseFloat((AZAMI_KOM / (1 + blokVal / 30)).toFixed(4))
    : AZAMI_KOM;

  // Max izinli bloke bu komisyon için: 30 × (3,56/komisyon - 1), max 40 gün
  const maxBlokForKom = komVal > 0
    ? Math.min(Math.floor(30 * (AZAMI_KOM / komVal - 1)), AZAMI_BLOK)
    : AZAMI_BLOK;

  const hatalar = [];

  if(komisyon !== "" && komVal > AZAMI_KOM)
    hatalar.push(`Komisyon oranı tavanı %${fmtN(AZAMI_KOM,4)}'i aşıyor.`);

  if(blokGun !== "" && blokVal > AZAMI_BLOK)
    hatalar.push(`Bloke gün sayısı tavanı ${AZAMI_BLOK} günü aşıyor.`);

  // İkisi de girilmişse kombinasyon kontrolü
  if(komisyon !== "" && blokGun !== "" && komVal > 0 && efektifMusteri > AZAMI_KOM){
    hatalar.push(
      `%${fmtN(komVal,4)} komisyon + ${blokVal} gün bloke geçersiz — müşteri efektif maliyeti %${fmtN(efektifMusteri,4)} olup %${fmtN(AZAMI_KOM,4)} tavanını aşıyor.\n` +
      `• Bu komisyon için maksimum bloke: ${Math.max(0,maxBlokForKom)} gün\n` +
      `• Bu bloke için maksimum komisyon: %${fmtN(maxKomForBlok,4)}`
    );
  }

  // İki alan da dolu mu (0 dahil geçerli)
  const girislerTam = komisyon !== "" && blokGun !== "";

  // ── Hesap ─────────────────────────────────────────────────────────────────
  const r = useCallback(()=>{
    if(!ciroVal || !girislerTam) return null;

    // 1. BKM TAKAS MALİYETİ
    const bkmMaliyet = ciroVal * bkmTakas / 100;

    // 2. KOMİSYON GELİRİ — banka tam komisyonu alır, bloke ayrı gelir
    const efKom = komVal; // banka komisyonu tam tahsil eder
    const komisyonGeliri = ciroVal * efKom / 100;

    // 3. BLOKE GÜN FAYDA GELİRİ
    //    Formül: Ciro × blokGün × fonlama_oranı / 36500
    //    Bloke > 14 gün ise ZK oranı uygulanır (vadesiz ZK: zkTL_vadesiz)
    const fonlamaOran = parseFloat(s.fonlamaMaliyeti) || 24.0;
    const zkBlokeOran = blokVal > 14 ? (parseFloat(s.zkTL_vadesiz) || 17) / 100 : 0;
    const ciroKullanilabilir = ciroVal * (1 - zkBlokeOran);
    const blokeGeliri = blokVal > 0 ? ciroKullanilabilir * blokVal * fonlamaOran / 36500 : 0;

    // 4. CARİ HESAP GELİRİ
    //    ZK oranı düşüldükten sonra kalan tutar üzerinden hesapla
    //    Cari = vadesiz → ZK oranı: zkTL_vadesiz
    const zkCariOran = (parseFloat(s.zkTL_vadesiz) || 17) / 100;
    const cariKullanilabilir = cariVal * (1 - zkCariOran);
    const cariGelir = cariKullanilabilir * cariKO / 100;

    // 5. VADELİ KATILIM GELİRİ
    //    Vadeli → ZK oranı: zkTL_6ay
    const zkVadOran = (parseFloat(s.zkTL_6ay) || 10) / 100;
    const vadKullanilabilir = vadVal * (1 - zkVadOran);
    const vadGelir = vadKullanilabilir * vadKO / 100;

    // 6. TOPLAM GELİR & MALİYET
    const toplamGelir   = komisyonGeliri + blokeGeliri + cariGelir + vadGelir;
    const toplamMaliyet = bkmMaliyet;

    // 7. NET KÂR / ZARAR
    const netSonuc = toplamGelir - toplamMaliyet;

    // 8. ÖNERİLER (sadece zarar varsa kullanılacak)
    // Öneri: bloke 0 gün, komisyon = BKM takas + %0,15 marj
    // Efektif müşteri maliyeti = onerKom × (1 + 0/30) = onerKom ≤ 3,56 ✓
    const onerKom  = Math.min(parseFloat((bkmTakas + 0.15).toFixed(4)), AZAMI_KOM);
    const onerBlok = 0; // bloke 0 → tavan sorunu yok

    return{
      ciroVal, komVal, blokVal, efKom: komVal,
      bkmMaliyet, komisyonGeliri, blokeGeliri, cariGelir, vadGelir,
      toplamGelir, toplamMaliyet, netSonuc,
      onerKom, onerBlok,
      cariVal, vadVal, cariKO, vadKO,
      fonlamaOran,
      zkCariOran, zkVadOran,
      cariKullanilabilir, vadKullanilabilir,
      zkBlokeOran, ciroKullanilabilir,
    };
  },[ciro,komisyon,blokGun,cariOrt,vadOrt,cariKarPay,vadKarPay,s.referansOran,s.bkmTakas])();

  return(
    <div style={{padding:"0 16px 32px"}}>

      {/* GİRİŞ */}
      <Card>
        <SecTitle>POS Cirosu (Zorunlu)</SecTitle>
        <Field label="Aylık POS Cirosu" value={ciro} onChange={setCiro} suffix="₺"
          hint="Tüm hesaplama bu ciroya göre yapılır"/>
      </Card>

      <Card>
        <SecTitle>Komisyon & Bloke</SecTitle>
        <Field label="Uygulanacak Komisyon Oranı" value={komisyon} onChange={setKomisyon}
          suffix="%" hint={`Tavan: %${fmtN(AZAMI_KOM,4)} — BKM Takas: %${fmtN(bkmTakas,2)}${girislerTam && blokVal>0 ? ` — ${blokVal} gün bloke için max: %${fmtN(maxKomForBlok,4)}` : ""}`}/>
        <Field label="Bloke / Valör Gün Sayısı" value={blokGun} onChange={setBlokGun}
          suffix="Gün" hint={`Tavan: ${AZAMI_BLOK} gün${girislerTam && komVal>0 ? ` — %${fmtN(komVal,4)} komisyon için max: ${Math.max(0,maxBlokForKom)} gün` : ""}`}/>
        {hatalar.map((h,i)=>(
          <div key={i} style={{background:"#FEF2F2",borderRadius:8,padding:"8px 10px",marginBottom:4,border:`1px solid ${C.red}`}}>
            <p style={{margin:0,fontSize:11,color:C.red,fontWeight:700}}>⛔ {h}</p>
          </div>
        ))}
      </Card>

      <Card>
        <SecTitle>Hesap Ortalamaları</SecTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="Cari Ortalama" value={cariOrt} onChange={setCariOrt} suffix="₺"/>
          <Field label="Cari Kâr Payı" value={cariKarPay} onChange={setCariKarPay} suffix="% Yıllık"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="Vadeli Ortalama" value={vadOrt} onChange={setVadOrt} suffix="₺"/>
          <Field label="Vadeli Kâr Payı" value={vadKarPay} onChange={setVadKarPay} suffix="% Yıllık"/>
        </div>
      </Card>

      {/* SONUÇLAR */}
      {r && hatalar.length === 0 && girislerTam && (
        <>
          <Card>
            <SecTitle>Kâr / Zarar Analizi</SecTitle>

            {/* MALİYET */}
            <div style={{background:"#FEF2F2",borderRadius:10,padding:"11px 14px",marginBottom:10}}>
              <p style={{margin:"0 0 6px",fontSize:11,fontWeight:700,color:C.red,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                📤 Maliyet
              </p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:C.sub}}>BKM Takas ({fmtTL(r.ciroVal)} × %{fmtN(bkmTakas,2)})</span>
                <span style={{fontSize:15,fontWeight:800,color:C.red,fontFamily:"monospace"}}>- {fmtTL(r.bkmMaliyet)}</span>
              </div>
            </div>

            {/* GELİRLER */}
            <div style={{background:C.greenLight,borderRadius:10,padding:"11px 14px",marginBottom:10}}>
              <p style={{margin:"0 0 6px",fontSize:11,fontWeight:700,color:C.green,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                📥 Gelirler
              </p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <span style={{fontSize:12,color:C.sub}}>
                  Komisyon ({fmtTL(r.ciroVal)} × %{fmtN(r.komVal,4)})
                </span>
                <span style={{fontSize:14,fontWeight:700,color:C.green,fontFamily:"monospace"}}>+ {fmtTL(r.komisyonGeliri)}</span>
              </div>
              {r.blokVal > 0 && (
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:12,color:C.sub}}>
                    Bloke Faydası ({fmtTL(r.ciroKullanilabilir)} × {r.blokVal} gün × %{fmtN(r.fonlamaOran,2)} ÷ 36500
                    {r.zkBlokeOran>0?` — ZK %${fmtN(r.zkBlokeOran*100,0)} düşüldü`:""})
                  </span>
                  <span style={{fontSize:14,fontWeight:700,color:C.teal,fontFamily:"monospace"}}>+ {fmtTL(r.blokeGeliri)}</span>
                </div>
              )}
              {r.cariVal > 0 && r.cariKO > 0 && (
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:12,color:C.sub}}>
                    Cari ({fmtTL(r.cariKullanilabilir)} × %{fmtN(r.cariKO,4)}/ay — ZK %{fmtN(r.zkCariOran*100,0)} düşüldü)
                  </span>
                  <span style={{fontSize:14,fontWeight:700,color:C.green,fontFamily:"monospace"}}>+ {fmtTL(r.cariGelir)}</span>
                </div>
              )}
              {r.vadVal > 0 && r.vadKO > 0 && (
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,color:C.sub}}>
                    Vadeli ({fmtTL(r.vadKullanilabilir)} × %{fmtN(r.vadKO,4)}/ay — ZK %{fmtN(r.zkVadOran*100,0)} düşüldü)
                  </span>
                  <span style={{fontSize:14,fontWeight:700,color:C.green,fontFamily:"monospace"}}>+ {fmtTL(r.vadGelir)}</span>
                </div>
              )}
              {r.blokVal > 0 && (
                <div style={{background:"#F0F4F8",borderRadius:8,padding:"8px 10px",marginTop:6}}>
                  <p style={{margin:0,fontSize:10,color:C.sub}}>
                    Formül: Ciro × Bloke Gün × Oran ÷ 36500 — Oran: %{fmtN(r.fonlamaOran,2)} (Ayarlar → Fonlama Maliyeti)
                  </p>
                </div>
              )}
              <div style={{height:1,background:"rgba(0,0,0,0.08)",margin:"8px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,fontWeight:700,color:C.green}}>Toplam Gelir</span>
                <span style={{fontSize:15,fontWeight:800,color:C.green,fontFamily:"monospace"}}>+ {fmtTL(r.toplamGelir)}</span>
              </div>
            </div>

            {/* NET SONUÇ */}
            <div style={{
              background: r.netSonuc >= 0 ? "#F0FDF4" : "#FEF2F2",
              borderRadius:14, padding:"16px",
              border:`2.5px solid ${r.netSonuc >= 0 ? C.green : C.red}`
            }}>
              <p style={{margin:"0 0 4px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",
                color: r.netSonuc >= 0 ? C.green : C.red}}>
                {r.netSonuc >= 0 ? "✅ NET KÂR" : "❌ NET ZARAR"}
              </p>
              <p style={{margin:0,fontSize:32,fontWeight:900,fontFamily:"monospace",
                color: r.netSonuc >= 0 ? C.green : C.red}}>
                {r.netSonuc >= 0 ? "+" : ""}{fmtTL(r.netSonuc)}
              </p>
              <p style={{margin:"6px 0 0",fontSize:11,color:C.sub}}>
                Aylık net — {fmtTL(r.ciroVal)} ciro üzerinden
              </p>
            </div>
          </Card>

          {/* ÖNERİLER — sadece zarar varsa */}
          {r.netSonuc < 0 && (
          <Card>
            <SecTitle>💡 Öneriler</SecTitle>
            <div style={{background:C.greenLight,borderRadius:12,padding:"13px 15px",border:`1.5px solid ${C.green}`}}>
              <p style={{margin:"0 0 8px",fontSize:12,fontWeight:700,color:C.green}}>✅ Önerilen Komisyon & Bloke</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <p style={{margin:"0 0 2px",fontSize:11,color:C.sub}}>Komisyon</p>
                  <p style={{margin:0,fontSize:20,fontWeight:900,color:C.green,fontFamily:"monospace"}}>%{fmtN(r.onerKom,4)}</p>
                </div>
                <div>
                  <p style={{margin:"0 0 2px",fontSize:11,color:C.sub}}>Bloke</p>
                  <p style={{margin:0,fontSize:20,fontWeight:900,color:C.green,fontFamily:"monospace"}}>{r.onerBlok} gün</p>
                </div>
              </div>
              <p style={{margin:"6px 0 0",fontSize:10,color:C.sub}}>BKM takas + %0,15 marj. Efektif müşteri maliyeti: %{fmtN(r.onerKom,4)} ≤ %{fmtN(AZAMI_KOM,4)} tavan ✓</p>
            </div>
          </Card>
          )}

          <RaporButon baslik="POS Kârlılık Analizi" plan={null} satirlar={[
            {label:"Aylık POS Cirosu", value:fmtTL(r.ciroVal), big:true},
            {label:`Komisyon Geliri (%${fmtN(r.efKom,4)} efektif)`, value:fmtTL(r.komisyonGeliri)},
            r.blokeGeliri>0?{label:`Bloke Gün Faydası (${r.blokVal} gün)`, value:fmtTL(r.blokeGeliri)}:null,
            r.cariGelir>0?{label:"Cari Hesap Geliri", value:fmtTL(r.cariGelir)}:null,
            r.vadGelir>0?{label:"Vadeli Katılım Geliri", value:fmtTL(r.vadGelir)}:null,
            {label:"Toplam Gelir", value:fmtTL(r.toplamGelir)},
            {label:`BKM Takas Maliyeti (%${fmtN(bkmTakas,2)})`, value:`- ${fmtTL(r.bkmMaliyet)}`},
            {label:"NET SONUÇ", value:`${r.netSonuc>=0?"+":""}${fmtTL(r.netSonuc)}`, big:true},
          ].filter(Boolean)}/>
        </>
      )}

      {(!ciroVal || !girislerTam) && (
        <div style={{background:C.blueLight,borderRadius:12,padding:"14px 16px",border:`1.5px solid ${C.blue}`}}>
          <p style={{margin:0,fontSize:13,color:C.blue,fontWeight:700}}>
            {!ciroVal ? "ℹ️ Aylık POS cirosunu girerek başlayın." : "ℹ️ Komisyon ve bloke gün sayısı zorunludur (0 yazılabilir)."}
          </p>
        </div>
      )}
    </div>
  );
}
export default function App(){
  const [screen,setScreen]=useState("home");
  const [settings,setSettings]=useState(()=>{
    try{
      const saved=localStorage.getItem("vk_settings");
      return saved?{...DEFAULT_SETTINGS,...JSON.parse(saved)}:DEFAULT_SETTINGS;
    }catch{return DEFAULT_SETTINGS;}
  });
  const [saved,setSaved]=useState(false);

  const handleSave=(s)=>{
    setSettings(s);
    try{localStorage.setItem("vk_settings",JSON.stringify(s));}catch{}
    setSaved(true);setTimeout(()=>{setSaved(false);setScreen("home");},1200);
  };
  const [saat, setSaat] = useState(()=>new Date());
  useEffect(()=>{
    const t = setInterval(()=>setSaat(new Date()), 1000);
    return ()=>clearInterval(t);
  },[]);

  const [kurlar, setKurlar] = useState([
    {kod:"USD",try:"—"},{kod:"EUR",try:"—"},{kod:"GBP",try:"—"},
    {kod:"CHF",try:"—"},{kod:"SAR",try:"—"},{kod:"AED",try:"—"},{kod:"JPY100",try:"—"},
  ]);
  useEffect(()=>{
    // TCMB kur XML'ini allorigins proxy üzerinden çek
    const url = "https://www.tcmb.gov.tr/kurlar/today.xml";
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    fetch(proxy)
      .then(r=>r.json())
      .then(d=>{
        const parser = new DOMParser();
        const xml = parser.parseFromString(d.contents, "text/xml");
        const getKur=(kod)=>{
          const nodes = xml.querySelectorAll("Currency");
          for(const n of nodes){
            if(n.getAttribute("CurrencyCode")===kod){
              const satis = n.querySelector("ForexSelling")?.textContent;
              return satis ? parseFloat(satis.replace(",",".")) : null;
            }
          }
          return null;
        };
        const usd = getKur("USD");
        const eur = getKur("EUR");
        const gbp = getKur("GBP");
        const chf = getKur("CHF");
        const sar = getKur("SAR");
        const aed = getKur("AED");
        const jpy = getKur("JPY"); // TCMB JPY 100'lük verir
        if(usd){
          setKurlar([
            {kod:"USD",   try: usd},
            {kod:"EUR",   try: eur},
            {kod:"GBP",   try: gbp},
            {kod:"CHF",   try: chf},
            {kod:"SAR",   try: sar},
            {kod:"AED",   try: aed},
            {kod:"100 JPY", try: jpy},
          ].filter(k=>k.try));
        }
      }).catch(()=>{
        // Proxy de çalışmazsa ikinci API dene
        fetch("https://open.er-api.com/v6/latest/USD")
          .then(r=>r.json())
          .then(d=>{
            if(d.rates?.TRY){
              const t = d.rates.TRY;
              const r = d.rates;
              setKurlar([
                {kod:"USD",   try: parseFloat(t.toFixed(4))},
                {kod:"EUR",   try: parseFloat((t/r.EUR).toFixed(4))},
                {kod:"GBP",   try: parseFloat((t/r.GBP).toFixed(4))},
                {kod:"CHF",   try: parseFloat((t/r.CHF).toFixed(4))},
                {kod:"SAR",   try: parseFloat((t/r.SAR).toFixed(4))},
                {kod:"AED",   try: parseFloat((t/r.AED).toFixed(4))},
                {kod:"100 JPY", try: parseFloat((t/r.JPY*100).toFixed(4))},
              ]);
            }
          }).catch(()=>{});
      });
  },[]);

  const saatStr = saat.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const tarihStr = saat.toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

  const nav=(sc)=>setScreen(sc);
  const back=()=>{const b=MENU[screen]?.back;if(b)setScreen(b);};
  const meta=MENU[screen];

  const menuItem=(key,icon,title,sub,color,bg,badge)=>(
    <div key={key} onClick={()=>nav(key)} style={{display:"flex",alignItems:"center",gap:14,background:C.card,borderRadius:14,padding:"13px 16px",marginBottom:9,cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
      <div style={{width:46,height:46,borderRadius:12,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{icon}</div>
      <div style={{flex:1}}>
        <p style={{margin:0,fontSize:18,fontWeight:700,color:C.label}}>{title}</p>
        {sub&&<p style={{margin:"2px 0 0",fontSize:12,color:C.sub}}>{sub}</p>}
      </div>
      {badge&&<span style={{background:color,color:"#fff",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:700}}>{badge}</span>}
      <span style={{color:C.sep,fontSize:20}}>›</span>
    </div>
  );

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto"}}>
      {/* header */}
      <div style={{background:"#0F1923",padding:"44px 20px 20px",position:"sticky",top:0,zIndex:50}}>
        {screen==="home"?(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600}}>Vakıf Katılım Bankası A.Ş.</p>
                <p style={{margin:0,fontSize:22,fontWeight:900,color:"#fff",letterSpacing:"-0.01em",lineHeight:1.1}}>Fon Fiyatlama Müdürlüğü</p>
                <p style={{margin:"3px 0 0",fontSize:11,color:"rgba(255,255,255,0.45)"}}>Finans Analiz Platformu</p>
              </div>
              <button onClick={()=>nav("ayarlar")} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",width:38,height:38,borderRadius:10,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>⚙️</button>
            </div>
            {/* Tarih & Saat */}
            <div style={{background:"rgba(255,255,255,0.07)",borderRadius:10,padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,0.6)",textTransform:"capitalize"}}>{tarihStr}</p>
              <p style={{margin:0,fontSize:15,fontWeight:700,color:"#fff",fontFamily:"monospace",letterSpacing:"0.05em"}}>{saatStr}</p>
            </div>

            {/* Kur Ticker */}
            <div style={{overflow:"hidden",borderRadius:8,background:"rgba(0,0,0,0.25)",padding:"5px 0"}}>
              <style>{`
                @keyframes ticker {
                  0%   { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .ticker-inner {
                  display: inline-flex;
                  animation: ticker ${kurlar.length*4}s linear infinite;
                  white-space: nowrap;
                }
              `}</style>
              <div className="ticker-inner">
                {[...kurlar,...kurlar].map((k,i)=>(
                  <span key={i} style={{
                    display:"inline-flex",alignItems:"center",gap:4,
                    marginRight:28,fontSize:11,fontWeight:600,
                    color:"rgba(255,255,255,0.85)"
                  }}>
                    <span style={{color:"rgba(255,255,255,0.45)",fontSize:10}}>{k.kod}/TRY</span>
                    <span style={{color:"#4ADE80",fontFamily:"monospace"}}>{typeof k.try==="number"?fmtN(k.try,4):k.try}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ):(
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={back} style={{background:"rgba(255,255,255,0.12)",border:"none",color:"#fff",fontWeight:600,fontSize:15,cursor:"pointer",padding:"8px 14px",borderRadius:10}}>‹ Geri</button>
            <span style={{fontSize:16,fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{meta?.title}</span>
          </div>
        )}
      </div>

      {saved&&<div style={{position:"fixed",top:64,left:"50%",transform:"translateX(-50%)",background:"#1C3A5E",color:"#fff",borderRadius:20,padding:"10px 20px",fontSize:14,fontWeight:600,zIndex:100}}>✓ Ayarlar kaydedildi</div>}

      <div style={{paddingTop:0}}>

        {/* ── HOME ── */}
        {screen==="home"&&(
          <div style={{background:"#0F1923",minHeight:"100vh",padding:"16px 16px 40px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {key:"katilimMenu",   icon:"🏦", label:"Katılım Fonu\nHesaplama Araçları",    count:"6 Araç", g1:"#1C3A5E",g2:"#2C5282", fs:16},
                {key:"finansmanMenu", icon:"💳", label:"Bireysel\nFinansman Araçları",         count:"4 Araç", g1:"#1A5C4A",g2:"#2A7A62", fs:16},
                {key:"ticariMenu",    icon:"🏢", label:"Tüzel\nFinansman Araçları",            count:"6 Araç", g1:"#7A5000",g2:"#B07D2E", fs:16},
                {key:"finansalTakvim",icon:"📅", label:"Finansal\nTakvim",                    count:"",       g1:"#4A3080",g2:"#6B4FA0", fs:18},
                {key:"finansalGostergeler",icon:"📊",label:"Finansal\nGöstergeler",            count:"",       g1:"#7A1A40",g2:"#9C3060", fs:16},
                {key:"asistan",       icon:"🤖", label:"VK\nAsistan",                         count:"",       g1:"#1A4A2A",g2:"#2A6A3A", fs:16},
              ].map((c,i)=>(
                <div key={i} onClick={()=>nav(c.key)} style={{
                  background:`linear-gradient(145deg,${c.g1} 0%,${c.g2} 100%)`,
                  borderRadius:20,
                  padding:"22px 18px",
                  cursor:"pointer",
                  position:"relative",
                  overflow:"hidden",
                  minHeight:150,
                  boxShadow:`0 6px 24px ${c.g1}88`,
                }}>
                  {/* Dekoratif daire */}
                  <div style={{position:"absolute",top:-24,right:-24,width:100,height:100,borderRadius:50,background:"rgba(255,255,255,0.07)"}}/>
                  <div style={{position:"absolute",bottom:-32,left:-12,width:120,height:120,borderRadius:60,background:"rgba(255,255,255,0.04)"}}/>
                  <div style={{fontSize:32,marginBottom:12,position:"relative"}}>{c.icon}</div>
                  <p style={{margin:"0 0 10px",fontSize:c.fs||15,fontWeight:800,color:"#fff",lineHeight:1.3,whiteSpace:"pre-line",position:"relative"}}>{c.label}</p>
                  {c.count&&(
                    <div style={{display:"inline-flex",alignItems:"center",background:"rgba(255,255,255,0.18)",borderRadius:20,padding:"4px 12px",position:"relative"}}>
                      <span style={{fontSize:11,color:"rgba(255,255,255,0.9)",fontWeight:700}}>{c.count}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

{/* ── KATILIM MENU ── */}
        {screen==="katilimMenu"&&(
          <div style={{padding:"0 16px 32px"}}>
            {menuItem("vadeliKatilim","💰","Katılım Hesabı Getiri Hesaplama","Net kâr payı ve stopaj analizi",C.blue,C.blueLight)}
            {menuItem("getiridenAnapara","🎯","Getiriden Anapara Hesaplama","Hedef kâr payı için gerekli anapara",C.blue,C.blueLight)}
            {menuItem("oranAnalizi","📊","Günlük Hesap Oran Hesaplama","Kâr payından yıllık net oran",C.purple,C.purpleLight)}
            {menuItem("tahvilBono","📈","Sukuk & Kira Sertifikası","Getiri hesaplama",C.teal,C.tealLight)}
            {menuItem("kasaOranAnalizi","🔄","Kasa Hesabı Oran Analizi","Basit↔Bileşik oran dönüşümü",C.teal,C.tealLight)}
            {menuItem("verimlilikAnalizi","📐","Verimlilik Analizi","ZK dahil getiri ve spread analizi",C.green,C.greenLight)}
          </div>
        )}

        {screen==="finansmanMenu"&&(
          <div style={{padding:"0 16px 32px"}}>
            {menuItem("konutFinansman","🏠","Konut Finansmanı","Enerji sınıfı bazlı BDDK LTV analizi",C.green,C.greenLight)}
            {menuItem("tasitFinansman","🚗","Taşıt Finansmanı","BDDK LTV ve azami vade kontrolü",C.teal,C.tealLight)}
            {menuItem("yatirimFonuFinansman","📦","Yatırım Fonu Finansmanı","Bireysel/kurumsal finansman analizi",C.purple,C.purpleLight)}
            {menuItem("taksitenKredi","🔢","Taksitten Tutar Hesaplama","Aylık taksetten kullanılabilir anapara",C.orange,C.orangeLight)}
          </div>
        )}

        {/* ── TİCARİ FİNANSMAN MENU ── */}
        {screen==="ticariMenu"&&(
          <div style={{padding:"0 16px 32px"}}>
            {menuItem("spotFinansman","⚡","Spot Finansman","Günlük kâr payı hesaplama",C.orange,C.orangeLight)}
            {menuItem("taksitliTicari","🏢","Taksitli Ticari Finansman","KOBİ ve ticari taksit planı",C.blue,C.blueLight)}
            {menuItem("leasing","🚙","Leasing","KDV dahil leasing hesaplama",C.teal,C.tealLight)}
            {menuItem("posHesaplama","💳","POS Komisyon Hesaplama","Üye işyeri komisyon ve net tahsilat analizi",C.purple,C.purpleLight)}
            {menuItem("tmKomisyon","📋","TM Komisyon Hesaplama","Aylık, 3 aylık ve flat ödeme planı",C.purple,C.purpleLight)}
            {menuItem("akreditifKomisyon","🏦","Akreditif Komisyon Hesaplama","İthalat/İhracat akreditif komisyonları",C.blue,C.blueLight)}
          </div>
        )}

        {/* ── EKRANLAR ── */}
        {screen==="vadeliKatilim"&&<VadeliKatilim s={settings}/>}
        {screen==="kasaOranAnalizi"&&<KasaOranAnalizi/>}
        {screen==="verimlilikAnalizi"&&<VerimliliKAnalizi s={settings}/>}
        {screen==="getiridenAnapara"&&<GetiridenAnapara s={settings}/>}
        {screen==="oranAnalizi"&&<OranAnalizi s={settings}/>}
        {screen==="tahvilBono"&&<TahvilBono s={settings}/>}
        {screen==="konutFinansman"&&<KonutFinansman s={settings}/>}
        {screen==="tasitFinansman"&&<TasitFinansman s={settings}/>}
        {screen==="yatirimFonuFinansman"&&<YatirimFonuFinansman s={settings}/>}
        {screen==="taksitenKredi"&&<TaksitenKredi s={settings}/>}
        {screen==="spotFinansman"&&<SpotKredi s={settings}/>}
        {screen==="taksitliTicari"&&<TaksitliTicariFinansman s={settings}/>}
        {screen==="leasing"&&<Leasing s={settings}/>}
        {screen==="posHesaplama"&&<PosHesaplama s={settings}/>}
        {screen==="tmKomisyon"&&<TmKomisyon/>}
        {screen==="akreditifKomisyon"&&<AkreditifKomisyon/>}
        {screen==="asistan"&&<Asistan/>}
        {screen==="finansalTakvim"&&<FinansalTakvim/>}
        {screen==="finansalGostergeler"&&<FinansalGostergeler/>}
        {screen==="ayarlar"&&<Ayarlar settings={settings} onSave={handleSave}/>}

        {/* ── YASAL UYARI FOOTER ── */}
        {!["home","katilimMenu","finansmanMenu","ticariMenu","asistan","finansalTakvim","finansalGostergeler","ayarlar"].includes(screen)&&(
          <div style={{
            margin:"4px 16px 28px",
            padding:"10px 14px",
            background:"#F5F6F8",
            borderRadius:10,
            borderLeft:`3px solid #B0B8C8`,
            display:"flex",gap:8,alignItems:"flex-start"
          }}>
            <span style={{fontSize:13,flexShrink:0,marginTop:1}}>⚠️</span>
            <p style={{
              margin:0,
              fontSize:11,
              color:"#6B7280",
              lineHeight:1.55,
              fontStyle:"italic"
            }}>
              Bu hesaplamalar yalnızca bilgilendirme amaçlıdır; kesin teklif, resmi belge veya hukuki taahhüt niteliği taşımaz. Nihai oranlar ve koşullar için yetkili biriminizle iletişime geçiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
