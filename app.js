const KEY="bw_calorie_log_v2";
const form=document.getElementById("entryForm");
const dateEl=document.getElementById("date");
const weightEl=document.getElementById("weight");
const caloriesEl=document.getElementById("calories");
const tbody=document.getElementById("tbody");
const stats=document.getElementById("stats");

function today(){
  const d=new Date();
  return d.toISOString().slice(0,10);
}

function load(){
  return JSON.parse(localStorage.getItem(KEY)||"[]");
}

function save(d){
  localStorage.setItem(KEY,JSON.stringify(d));
}

function calcMaintenance(data){
  if(data.length<14) return null;
  const sorted=[...data].sort((a,b)=>a.date<b.date?1:-1).slice(0,14);
  const avgCal=sorted.reduce((s,x)=>s+x.calories,0)/14;
  const dw=sorted[0].weight-sorted[13].weight;
  return Math.round(avgCal-(dw*7700/14));
}

function render(){
  const data=load();
  tbody.innerHTML="";
  data.forEach(r=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${r.date}</td><td>${r.weight}</td><td>${r.calories}</td><td></td>`;
    tbody.appendChild(tr);
  });
  const m=calcMaintenance(data);
  stats.textContent=m?`推定メンテナンス: ${m} kcal`:"14日分入力してください";
}

form.addEventListener("submit",e=>{
  e.preventDefault();
  const data=load().filter(x=>x.date!==dateEl.value);
  data.push({date:dateEl.value,weight:+weightEl.value,calories:+caloriesEl.value});
  save(data);
  render();
});

dateEl.value=today();
render();
