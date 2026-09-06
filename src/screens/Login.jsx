import { useEffect, useState } from 'react'
import Icon from '../icons'
import { Button, Field } from '../ui'
import wordmark from '../assets/img/wordmark-tenve.png'

export function Splash({ nav }) {
  useEffect(() => {
    const t = setTimeout(() => nav.reset('login'), 1800)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="splash" onClick={() => nav.reset('login')}>
      <div className="acesso-marca">
        <img className="wordmark" src={wordmark} alt="Tenvê" />
        <div className="tagline">Vistoria veicular inteligente</div>
      </div>
      <div className="splashbar"><i /></div>
    </div>
  )
}

export function Login({ nav, store }) {
  const [email, setEmail] = useState('vistoriador@tenve.com')
  const [senha, setSenha] = useState('tenve2026')
  const [ver, setVer] = useState(false)
  const [erro, setErro] = useState({})

  function entrar() {
    const e = {}
    if (!email.trim()) e.email = 'Informe o e-mail liberado pela franquia.'
    else if (!email.includes('@')) e.email = 'E-mail inválido.'
    if (!senha.trim()) e.senha = 'Informe sua senha.'
    setErro(e)
    if (Object.keys(e).length) return
    store.setUsuario({ nome: 'Miguel Henrique', email, franquia: 'Franquia Carandaí' })
    nav.reset('vistorias')
  }

  return (
    <div className="login">
      <div className="login-topo">
        <div className="acesso-marca">
          <img className="wordmark" src={wordmark} alt="Tenvê" />
          <div className="tagline">Vistoria veicular inteligente</div>
        </div>
      </div>

      <div className="folha">
        <h2 className="logintitle">Entre com o acesso liberado pela sua franquia.</h2>

        <Field label="E-mail" required icon="mail" error={erro.email}
          type="email" value={email} placeholder="voce@tenve.com"
          onChange={e => setEmail(e.target.value)} />

        <div className="field">
          <label>Senha <i>*</i></label>
          <div className={`inputwrap${erro.senha ? ' err' : ''}`}>
            <Icon name="lock" size={20} />
            <input type={ver ? 'text' : 'password'} value={senha} placeholder="Sua senha"
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && entrar()} />
            <button className="iconbtn" style={{ width: 28, height: 28 }} onClick={() => setVer(v => !v)}
              aria-label={ver ? 'Ocultar senha' : 'Mostrar senha'}>
              <Icon name={ver ? 'eye' : 'eye-off'} size={20} color="#6b7a72" />
            </button>
          </div>
          {erro.senha && <div className="errtext">{erro.senha}</div>}
        </div>

        <button className="linkr" onClick={() => alert('Protótipo: um link de redefinição seria enviado por e-mail.')}>
          Esqueci minha senha
        </button>

        <Button onClick={entrar}>Entrar</Button>

        <div className="loginfoot">Problemas para entrar? Fale com a sua franquia.</div>
      </div>
    </div>
  )
}
