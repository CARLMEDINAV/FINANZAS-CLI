import React from 'react'
import { createRoot } from 'react-dom/client'

const theme = {
  bg: '#0b0b0c',
  panel: '#111113',
  border: '#374151',
  inputBg: '#1F2937',
  text: '#F9FAFB',
  muted: '#9CA3AF',
  head: '#D1D5DB',
  yellow: '#FACC15',
  green: '#22C55E',
  red: '#EF4444'
}

const styles = {
  app:{fontFamily:'Inter,system-ui,sans-serif',background:theme.bg,color:theme.text,minHeight:'100vh',padding:28},
  header:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24},
  h1:{margin:0,fontSize:28,letterSpacing:-.4},
  sub:{color:theme.muted,fontSize:13},
  grid3:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24},
  card:{background:theme.panel,border:`1px solid ${theme.border}`,borderRadius:16,padding:20},
  label:{color:theme.muted,fontSize:12,textTransform:'uppercase',letterSpacing:'.08em'},
  value:{fontSize:32,fontWeight:700,marginTop:6},
  formCard:{background:theme.panel,border:`1px solid ${theme.border}`,borderRadius:16,padding:16,marginBottom:24},
  form:{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,alignItems:'end'},
  input:{background:theme.inputBg,color:theme.text,border:`1px solid ${theme.border}`,padding:'10px 12px',borderRadius:10,outline:'none'},
  btn:{background:theme.yellow,color:'#000',fontWeight:800,border:'none',padding:'12px 24px',borderRadius:12,cursor:'pointer'},
  panels:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,margin:'24px 0'},
  panel:{background:theme.panel,border:`1px solid ${theme.border}`,borderRadius:16,padding:16},
  tableWrap:{background:theme.panel,border:`1px solid ${theme.border}`,borderRadius:16,padding:16},
  th:{color:theme.head,textAlign:'left',fontWeight:600,padding:10,borderBottom:`1px solid ${theme.border}`},
  td:{padding:10,borderBottom:`1px solid ${theme.border}`},
  badge:{padding:'2px 8px',borderRadius:999,fontSize:12,fontWeight:700,color:'#000'}
}

function App(){
  const [movs,setMovs]=React.useState(()=>{
    const s=localStorage.getItem('finanzas_movs')
    if(s) return JSON.parse(s)
    return [
      {id:1,fecha:'2026-10-07',tipo:'ingreso',categoria:'Salario',descripcion:'Sueldo septiembre',monto:3000},
      {id:2,fecha:'2026-10-07',tipo:'gasto',categoria:'Alimentación',descripcion:'Mercado',monto:120.5}
    ]
  })
  React.useEffect(()=>{localStorage.setItem('finanzas_movs',JSON.stringify(movs))},[movs])
  const today=React.useMemo(()=>new Date().toISOString().slice(0,10),[])
  const [form,setForm]=React.useState({tipo:'gasto',categoria:'',monto:'',descripcion:'',fecha:today})

  const add=e=>{e.preventDefault();const n={id:Date.now(),fecha:form.fecha,tipo:form.tipo,categoria:form.categoria,descripcion:form.descripcion,monto:parseFloat(form.monto)||0};setMovs(m=>[n,...m]);setForm({tipo:'gasto',categoria:'',monto:'',descripcion:'',fecha:today})}
  const del=id=>setMovs(m=>m.filter(x=>x.id!==id))

  const ingresos=movs.filter(m=>m.tipo==='ingreso').reduce((a,b)=>a+b.monto,0)
  const gastos=movs.filter(m=>m.tipo==='gasto').reduce((a,b)=>a+b.monto,0)
  const saldo=ingresos-gastos
  const saldoColor=saldo>=0?theme.green:theme.red

  const byCat=tipo=>{const map={};movs.filter(m=>m.tipo===tipo).forEach(m=>{map[m.categoria]=(map[m.categoria]||0)+m.monto});return Object.entries(map)}

  const Pie=({data,title})=>{
    const d=data||[]
    if(!d.length) return <div style={{color:theme.muted,textAlign:'center',padding:32,border:`1px dashed ${theme.border}`,borderRadius:12}}>Sin datos registrados</div>
    const total=d.reduce((a,[,v])=>a+v,0)||1
    return <div><div style={{color:theme.yellow,fontWeight:700,marginBottom:8}}>{title}</div>{d.map(([l,v])=>{const p=(v/total*100).toFixed(1);return <div key={l} style={{margin:'4px 0'}}>{l}: <b>${v.toFixed(2)}</b> ({p}%)</div>})}</div>
  }

  return <div style={styles.app}>
    <header style={styles.header}><h1 style={styles.h1}>Finanzas<span style={{color:theme.yellow}}>•</span>CLI</h1><div style={styles.sub}>Monitor • Contraste AA</div></header>
    <section style={styles.grid3}>
      <div style={styles.card}><div style={styles.label}>Ingresos</div><div style={{...styles.value,color:theme.green}}>${ingresos.toFixed(2)}</div></div>
      <div style={styles.card}><div style={styles.label}>Gastos</div><div style={{...styles.value,color:theme.red}}>${gastos.toFixed(2)}</div></div>
      <div style={styles.card}><div style={styles.label}>Saldo</div><div style={{...styles.value,color:saldoColor}}>${saldo.toFixed(2)}</div></div>
    </section>
    <section style={styles.formCard}><h3 style={{margin:'0 0 12px',color:theme.yellow}}>Nuevo movimiento</h3>
      <form onSubmit={add} style={styles.form}>
        <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})} style={styles.input}><option value="gasto">Gasto</option><option value="ingreso">Ingreso</option></select>
        <input placeholder="Categoría" value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})} required style={styles.input}/>
        <input placeholder="Monto" type="number" step="0.01" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})} required style={styles.input}/>
        <input placeholder="Descripción" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} style={styles.input}/>
        <input type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})} style={styles.input}/>
        <div style={{gridColumn:'1/-1',display:'flex',justifyContent:'flex-end'}}><button style={styles.btn}>Añadir movimiento</button></div>
      </form>
    </section>
    <section style={styles.panels}>
      <div style={styles.panel}><Pie data={byCat('gasto')} title="Gastos por categoría"/></div>
      <div style={styles.panel}><Pie data={byCat('ingreso')} title="Ingresos por categoría"/></div>
    </section>
    <section style={styles.tableWrap}><h3 style={{margin:'0 0 12px',color:theme.yellow}}>Movimientos</h3>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:14}}>
        <thead><tr><th style={styles.th}>Fecha</th><th style={styles.th}>Tipo</th><th style={styles.th}>Categoría</th><th style={styles.th}>Monto</th><th style={styles.th}>Descripción</th><th></th></tr></thead>
        <tbody>{movs.length===0?<tr><td colSpan="6" style={{textAlign:'center',padding:24,color:theme.muted}}>No hay movimientos registrados aún</td></tr>:movs.map(m=>(
          <tr key={m.id}><td style={styles.td}>{m.fecha}</td><td style={styles.td}><span style={{...styles.badge,background:m.tipo==='ingreso'?theme.green:theme.red}}>{m.tipo}</span></td><td style={styles.td}>{m.categoria}</td><td style={styles.td}>${m.monto.toFixed(2)}</td><td style={styles.td}>{m.descripcion}</td><td style={styles.td}><button onClick={()=>del(m.id)} style={{background:'transparent',border:`1px solid ${theme.border}`,color:theme.muted,borderRadius:8,padding:'4px 8px',cursor:'pointer'}}>eliminar</button></td></tr>
        ))}</tbody>
      </table>
    </section>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>)
