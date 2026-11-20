const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const initialConfigs=[
 {name:"Instagram Demo 01",id:"IR-8F2A1",type:"اینستاگرام",duration:"30 روز",active:true},
 {name:"Personal Demo",id:"IR-4B7C9",type:"شخصی",duration:"7 روز",active:true},
 {name:"General Demo",id:"IR-1D6E3",type:"عمومی",duration:"90 روز",active:false},
 {name:"Instagram Demo 02",id:"IR-9A3D2",type:"اینستاگرام",duration:"30 روز",active:true}
];
let configs=JSON.parse(localStorage.getItem("ip_configs")||"null")||initialConfigs;
let users=JSON.parse(localStorage.getItem("ip_users")||"null")||[
 {name:"مدیر اصلی",id:"USR-001",date:"1405/08/01",active:true},
 {name:"کاربر نمونه ۱",id:"USR-002",date:"1405/08/04",active:true},
 {name:"کاربر نمونه ۲",id:"USR-003",date:"1405/08/09",active:true},
 {name:"کاربر آزمایشی",id:"USR-004",date:"1405/08/12",active:false}
];
let activity=JSON.parse(localStorage.getItem("ip_activity")||"null")||["پنل آزمایشی باز شد","اطلاعات نمونه بارگذاری شد"];
function save(){localStorage.setItem("ip_configs",JSON.stringify(configs));localStorage.setItem("ip_users",JSON.stringify(users));localStorage.setItem("ip_activity",JSON.stringify(activity))}
function log(s){activity.unshift(s);activity=activity.slice(0,30);save();renderActivity()}
function toast(s){let t=$("#toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function renderConfigs(){
 const q=($("#configSearch")?.value||"").toLowerCase(),f=$("#configFilter")?.value||"all";
 const list=configs.filter(c=>(c.name+c.id).toLowerCase().includes(q)&&(f==="all"||(f==="active"?c.active:!c.active)));
 $("#configRows").innerHTML=list.map((c)=>`<tr><td><b>${esc(c.name)}</b></td><td>${c.id}</td><td>${c.type}</td><td>${c.duration}</td><td><span class="state ${c.active?"on":"off"}">${c.active?"فعال":"غیرفعال"}</span></td><td><button class="copy-btn" data-copy="${c.id}">کپی شناسه</button> <button class="mini-btn" data-toggle="${c.id}">${c.active?"غیرفعال":"فعال"}</button> <button class="mini-btn danger" data-delete="${c.id}">حذف</button></td></tr>`).join("")||'<tr><td colspan="6">موردی پیدا نشد.</td></tr>';
 $("#recentConfigs").innerHTML=configs.slice(0,4).map(c=>`<tr><td>${esc(c.name)}</td><td>${c.type}</td><td><span class="state ${c.active?"on":"off"}">${c.active?"فعال":"غیرفعال"}</span></td><td>${c.duration}</td></tr>`).join("");
 $("#configCount").textContent=String(configs.length).padStart(2,"0");$("#activeCount").textContent=String(configs.filter(c=>c.active).length).padStart(2,"0");
}
function renderUsers(){$("#userRows").innerHTML=users.map(u=>`<tr><td>${esc(u.name)}</td><td>${u.id}</td><td>${u.date}</td><td><span class="state ${u.active?"on":"off"}">${u.active?"فعال":"غیرفعال"}</span></td></tr>`).join("");$("#userCount").textContent=users.length}
function renderActivity(){const html=activity.slice(0,7).map(a=>`<div class="event"><i class="event-dot"></i><div>${esc(a)}<small>همین مرورگر</small></div></div>`).join("");$("#recentActivity").innerHTML=html;$("#allActivity").innerHTML=activity.map(a=>`<div class="event"><i class="event-dot"></i><div>${esc(a)}<small>ثبت‌شده در محیط محلی</small></div></div>`).join("")}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function go(p){$$(".page").forEach(x=>x.classList.remove("active"));$("#page-"+p).classList.add("active");$$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===p));$("#pageTitle").textContent=({dashboard:"داشبورد",configs:"کانفیگ‌ها",users:"کاربران",activity:"فعالیت‌ها",settings:"تنظیمات"})[p];$("#sidebar").classList.remove("open")}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));$$("[data-goto]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.goto)));
$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
$("#newConfig").onclick=()=>$("#modal").classList.add("show");$("#closeModal").onclick=()=>$("#modal").classList.remove("show");
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")$("#modal").classList.remove("show")});
$("#createConfig").onclick=()=>{let name=$("#cfgName").value.trim();if(!name){toast("نام کانفیگ را وارد کنید");return}let c={name,id:"IR-"+Math.random().toString(36).slice(2,7).toUpperCase(),type:$("#cfgType").value,duration:$("#cfgDuration").value,active:true};configs.unshift(c);save();renderConfigs();log("کانفیگ آزمایشی "+name+" ساخته شد");$("#cfgName").value="";$("#modal").classList.remove("show");toast("کانفیگ نمونه ساخته شد")};
$("#configRows").addEventListener("click",e=>{let id=e.target.dataset.copy;if(id){navigator.clipboard?.writeText(id).then(()=>toast("شناسه کپی شد")).catch(()=>toast("شناسه: "+id));return}id=e.target.dataset.toggle;if(id){let c=configs.find(x=>x.id===id);c.active=!c.active;save();renderConfigs();log("وضعیت "+c.name+" تغییر کرد");return}id=e.target.dataset.delete;if(id&&confirm("این مورد حذف شود؟")){let c=configs.find(x=>x.id===id);configs=configs.filter(x=>x.id!==id);save();renderConfigs();log("کانفیگ "+c.name+" حذف شد") }});
$("#configSearch").oninput=renderConfigs;$("#configFilter").onchange=renderConfigs;
$("#addUser").onclick=()=>{let name=prompt("نام کاربر جدید:");if(!name?.trim())return;users.push({name:name.trim(),id:"USR-"+String(Date.now()).slice(-5),date:"1405/08/29",active:true});save();renderUsers();log("کاربر "+name+" اضافه شد");toast("کاربر نمونه اضافه شد")};
$("#saveSettings").onclick=()=>{let n=$("#panelName").value.trim();if(n){document.title=n+" | مدیریت سرویس";$(".brand b").textContent=n;log("تنظیمات پنل ذخیره شد");toast("تنظیمات در همین مرورگر ذخیره شد")}};
renderConfigs();renderUsers();renderActivity();save();
