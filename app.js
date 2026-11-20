const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const initialConfigs=[
 {id:1,name:"نمونه آزمایشی ۱",type:"VLESS",description:"اطلاعات نمونه؛ فاقد لینک اتصال",status:"فعال",date:"۱۴۰۵/۰۸/۱۸"},
 {id:2,name:"نمونه آزمایشی ۲",type:"WireGuard",description:"مورد نمایشی برای رابط کاربری",status:"فعال",date:"۱۴۰۵/۰۸/۱۷"},
 {id:3,name:"نمونه آزمایشی ۳",type:"OpenVPN",description:"برای تست جدول و فیلتر",status:"غیرفعال",date:"۱۴۰۵/۰۸/۱۶"}
];
let configs;
try{configs=JSON.parse(localStorage.getItem("iranPanelConfigs"))||initialConfigs}catch{configs=initialConfigs}
const users=[
 ["علی رضایی","ali@example.test","کاربر","فعال"],["سارا محمدی","sara@example.test","مدیر","فعال"],["امیر کریمی","amir@example.test","کاربر","فعال"],["نگار احمدی","negar@example.test","کاربر","غیرفعال"],["پارسا حسینی","parsa@example.test","کاربر","فعال"]
];
const activities=[["افزودن مورد آزمایشی","یک کانفیگ نمایشی به فهرست اضافه شد","امروز · ۱۰:۲۴"],["ورود به داشبورد","ورود نمایشی مدیر به پنل","امروز · ۰۹:۴۰"],["به‌روزرسانی تنظیمات","تنظیمات ظاهری پنل بررسی شد","دیروز · ۱۸:۱۲"],["ایجاد حساب نمونه","یک حساب نمایشی ایجاد شد","دیروز · ۱۵:۰۵"]];
const faDate=new Intl.DateTimeFormat("fa-IR",{dateStyle:"full"});$("#today").textContent=faDate.format(new Date());
function persist(){localStorage.setItem("iranPanelConfigs",JSON.stringify(configs))}
function badge(status){return `<span class="status ${status==="فعال"?"on":"off"}">${status}</span>`}
function render(){
 $("#configCount").textContent=configs.length.toLocaleString("fa-IR");
 $("#activeCount").textContent=configs.filter(x=>x.status==="فعال").length.toLocaleString("fa-IR");
 $("#recentRows").innerHTML=configs.slice().reverse().slice(0,4).map(c=>`<tr><td>${esc(c.name)}</td><td>${esc(c.type)}</td><td>${badge(c.status)}</td><td>${c.date}</td></tr>`).join("");
 renderConfigs();
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderConfigs(){
 const q=$("#configSearch").value.trim().toLowerCase(),st=$("#statusFilter").value;
 const list=configs.filter(c=>(c.name+" "+c.type).toLowerCase().includes(q)&&(st==="all"||c.status===st));
 $("#configRows").innerHTML=list.map(c=>`<tr><td>${esc(c.name)}</td><td>${esc(c.type)}</td><td>${esc(c.description||"—")}</td><td>${badge(c.status)}</td><td><button class="action-btn" data-toggle="${c.id}">${c.status==="فعال"?"غیرفعال‌کردن":"فعال‌کردن"}</button> <button class="action-btn" data-delete="${c.id}">حذف</button></td></tr>`).join("");
 $("#emptyConfigs").hidden=list.length>0;
}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function navigate(page){$$(".page").forEach(p=>p.classList.toggle("active",p.id===page));$$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));$("#crumb").textContent=({overview:"نمای کلی",configs:"کانفیگ‌ها",users:"کاربران",activity:"گزارش فعالیت",settings:"تنظیمات"})[page];$("#sidebar").classList.remove("open")}
$$("[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
$$("[data-goto]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.goto)));
$("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#configSearch").addEventListener("input",renderConfigs);$("#statusFilter").addEventListener("change",renderConfigs);
$("#configRows").addEventListener("click",e=>{
 const del=e.target.dataset.delete,tog=e.target.dataset.toggle;
 if(del){configs=configs.filter(c=>c.id!==Number(del));persist();render();showToast("مورد حذف شد.");}
 if(tog){const c=configs.find(x=>x.id===Number(tog));c.status=c.status==="فعال"?"غیرفعال":"فعال";persist();render();showToast("وضعیت به‌روزرسانی شد.");}
});
const dialog=$("#configDialog");
$("#addOpen").addEventListener("click",()=>dialog.showModal());
$("#dialogClose").addEventListener("click",()=>dialog.close());
$("#cancelAdd").addEventListener("click",()=>dialog.close());
$("#configForm").addEventListener("submit",e=>{
 e.preventDefault();const fd=new FormData(e.currentTarget);
 configs.push({id:Date.now(),name:fd.get("name").trim(),type:fd.get("type"),description:fd.get("description").trim(),status:fd.get("status"),date:new Intl.DateTimeFormat("fa-IR").format(new Date())});
 persist();render();e.currentTarget.reset();dialog.close();showToast("مورد جدید ذخیره شد.");
});
$("#userRows").innerHTML=users.map(u=>`<tr><td>${u[0]}</td><td>${u[1]}</td><td>${u[2]}</td><td>${badge(u[3])}</td></tr>`).join("");
$("#userSearch").addEventListener("input",e=>{$$("#userRows tr").forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(e.target.value.toLowerCase()))});
$("#activityList").innerHTML=activities.map(a=>`<div class="activity-item"><span class="activity-mark">◷</span><div><b>${a[0]}</b><small>${a[1]} · ${a[2]}</small></div></div>`).join("");
render();