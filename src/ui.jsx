import Icon from './icons'
import { STATUS } from './data'
import logoTenve from './assets/img/logo-tenve.png'

export function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 10.5 6 8.5a2.8 2.8 0 0 1 4 0zM8 6.2c-1.4 0-2.7.5-3.7 1.5L2.9 6.3A7.3 7.3 0 0 1 8 4.2c1.9 0 3.7.7 5.1 2.1l-1.4 1.4A5.3 5.3 0 0 0 8 6.2M8 2.2c-2.4 0-4.7 1-6.5 2.7L0 3.4A11.3 11.3 0 0 1 8 .2c3 0 5.9 1.2 8 3.2l-1.5 1.5A9.3 9.3 0 0 0 8 2.2" />
        </svg>
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
          <rect x=".5" y=".5" width="22" height="12" rx="3.5" stroke="currentColor" opacity=".4" />
          <rect x="2" y="2" width="19" height="9" rx="2" fill="currentColor" />
          <path d="M24 4.5v4a2.4 2.4 0 0 0 0-4" fill="currentColor" opacity=".5" />
        </svg>
      </span>
    </div>
  )
}

export function HomeIndicator() {
  return <div className="homeind"><span /></div>
}

export function Logo({ size = 30 }) {
  return <img className="logo" src={logoTenve} width={size} height={size} alt="Tenvê" />
}

export function AppBar({ title, onSearch }) {
  return (
    <div className="appbar">
      <Logo />
      <h1>{title}</h1>
      {onSearch && <button className="iconbtn" onClick={onSearch} aria-label="Buscar"><Icon name="search" size={22} /></button>}
    </div>
  )
}

export function StepBar({ title, sub, onBack, progresso, right }) {
  return (
    <div className="stepbar">
      <div className="row">
        {onBack && <button className="backbtn" onClick={onBack} aria-label="Voltar"><Icon name="arrow-left" size={18} /></button>}
        <h1>{title}</h1>
        {right}
      </div>
      {sub && <div className="sub">{sub}</div>}
      {progresso !== undefined && (
        <div className="progress-line"><i style={{ width: `${Math.round(progresso * 100)}%` }} /></div>
      )}
    </div>
  )
}

export function ContextBar({ placa, tipo }) {
  return (
    <div className="ctxbar">
      <Icon name="car" size={18} color="#04662b" />
      <span className="plate">{placa || '—'}</span>
      <span>·</span>
      <span>{tipo}</span>
    </div>
  )
}

export function ActionBar({ children }) {
  return <div className="actionbar">{children}</div>
}

export function Button({ variant = 'primary', children, icon = 'arrow-right', auto, ...rest }) {
  return (
    <button className={`btn btn-${variant}${auto ? ' btn-auto' : ''}`} {...rest}>
      {children}
      {icon && <Icon name={icon} size={19} />}
    </button>
  )
}

export function Pill({ status }) {
  const s = STATUS[status]
  return <span className={`pill ${s.cls}`}>{s.label}</span>
}

export function Field({ label, required, icon, error, ok, children, ...rest }) {
  return (
    <div className="field">
      {label && <label>{label} {required && <i>*</i>}</label>}
      <div className={`inputwrap${error ? ' err' : ok ? ' ok' : ''}`}>
        {icon && <Icon name={icon} size={20} />}
        {children || <input {...rest} />}
        {ok && <Icon name="check" size={20} color="#04662b" />}
      </div>
      {error && <div className="errtext">{error}</div>}
    </div>
  )
}

export function Card({ title, children, style }) {
  return (
    <div className="card" style={style}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  )
}

export function DataRow({ k, v, mono, strong }) {
  return (
    <div className="drow">
      <span className="k">{k}</span>
      <span className={`v${mono ? ' mono' : ''}`} style={strong ? { color: '#04662b' } : undefined}>{v}</span>
    </div>
  )
}

// linha com ícone + rótulo e valor empilhados (detalhes da pesquisa)
export function IconRow({ icon, k, v, mono }) {
  return (
    <div className="irow">
      <Icon name={icon} size={18} color="#04662b" />
      <div>
        <div className="ik">{k}</div>
        <div className={`iv${mono ? ' mono' : ''}`}>{v}</div>
      </div>
    </div>
  )
}

export function Note({ tone = 'info', icon = 'info', title, children }) {
  const colors = { info: '#04662b', lime: '#04662b', warn: '#ff8027' }
  return (
    <div className={`note note-${tone}`}>
      <Icon name={icon} size={18} color={colors[tone]} />
      <div>{title && <b>{title}</b>}{children}</div>
    </div>
  )
}

export function GroupHeader({ label, count }) {
  return <div className="grouphdr"><span>{label}</span><span>{count}</span></div>
}

export function Bar({ value }) {
  return <div className="bar"><i style={{ width: `${Math.round(value * 100)}%` }} /></div>
}

export function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'vistorias', label: 'Vistorias', icon: 'clipboard-list' },
    { id: 'pesquisas', label: 'Pesquisa', icon: 'car' },
    { id: 'perfil', label: 'Perfil', icon: 'user' },
  ]
  return (
    <div className="tabbar">
      {tabs.map(t => (
        <button key={t.id} className={`tab${active === t.id ? ' on' : ''}`} onClick={() => onChange(t.id)}>
          <span className="bubble"><Icon name={t.icon} size={21} /></span>
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function Fab({ children, onClick }) {
  return (
    <button className="fab" onClick={onClick}>
      <Icon name="plus" size={20} strokeWidth={2.5} />{children}
    </button>
  )
}

// destaca o trecho buscado dentro do texto
export function Highlight({ text, query }) {
  if (!query) return <>{text}</>
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i < 0) return <>{text}</>
  return (
    <span className="match">
      {text.slice(0, i)}<b>{text.slice(i, i + query.length)}</b>{text.slice(i + query.length)}
    </span>
  )
}
