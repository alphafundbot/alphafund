(function(){
  const providers = ['stripe','upwork','gumroad'];
  const intervalMs = 30000;

  function getToken(){
    return localStorage.getItem('dashboard_token') || '';
  }
  function saveToken(v){ localStorage.setItem('dashboard_token', v); }

  document.getElementById('saveToken').addEventListener('click', ()=>{
    const v = document.getElementById('token').value.trim();
    saveToken(v);
    alert('Token saved to localStorage for this browser session.');
    fetchAndRender();
  });

  async function fetchTotal(p){
    const token = getToken();
    const headers = token ? {'Authorization': 'Bearer '+token} : {};
    const res = await fetch(`/totals/${p}`, {headers});
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }

  async function fetchAndRender(){
    const rows = [];
    let grand = 0;
    let lastUpdated = null;
    for (const p of providers){
      try{
        const t = await fetchTotal(p);
        rows.push({provider:p, total:t.total_formatted || t.total_usd || '$0.00', rows:t.rows||0, seal:t.sealed_hash||t.sealedHash||''});
        const cents = t.total_cents || Math.round((parseFloat(t.total_usd||0))*100);
        grand += cents;
        lastUpdated = new Date().toISOString();
      }catch(e){
        rows.push({provider:p, total:'ERROR', rows:0, seal:'-'});
      }
    }
    document.getElementById('grandTotal').textContent = '$' + (grand/100).toFixed(2);
    document.getElementById('lastUpdated').textContent = 'Last updated: ' + (lastUpdated||'—');
    const tb = document.getElementById('sealsTable'); tb.innerHTML = '';
    for (const r of rows){
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.provider}</td><td>${r.total}</td><td>${r.rows}</td><td style="font-family: monospace;">${r.seal}</td>`;
      tb.appendChild(tr);
    }
    // draw chart
    drawChart(rows.map(x=>x.provider), rows.map(x=>{ const v = x.total==='ERROR' ? 0 : Number(x.total.replace(/[^0-9\.\-]/g,'')); return v; }));
  }

  let chart = null;
  function drawChart(labels, data){
    const ctx = document.getElementById('totalsChart').getContext('2d');
    if (chart) { chart.data.labels = labels; chart.data.datasets[0].data = data; chart.update(); return; }
    chart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label:'Totals (USD)', data, backgroundColor:['#4e79a7','#f28e2b','#e15759'] }] },
      options: { responsive:true }
    });
  }

  // initial fetch
  fetchAndRender();
  setInterval(fetchAndRender, intervalMs);
})();
