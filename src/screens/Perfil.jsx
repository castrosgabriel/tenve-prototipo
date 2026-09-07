import Icon from '../icons'
import { AppBar, Card } from '../ui'

const MENU = [
  ['user', 'Meus dados'],
  ['alert-circle', 'Notificações'],
  ['shield-check', 'Termos e privacidade'],
  ['message-square', 'Ajuda e suporte'],
  ['info', 'Sobre o app'],
]

export default function Perfil({ store }) {
  const u = store.usuario
  const iniciais = (u?.nome || 'MH').split(' ').map(p => p[0]).slice(0, 2).join('')

  return (
    <>
      <AppBar title="Perfil" />
      <div className="scroll pad">
        <div className="card profcard">
          <div className="avatar">{iniciais}</div>
          <div>
            <div className="perfil-nome">{u?.nome}</div>
            <div className="perfil-papel">Vistoriador · {u?.franquia}</div>
          </div>
        </div>

        <Card>
          {MENU.map(([ic, label]) => (
            <button className="menurow" key={label} onClick={() => alert(`Protótipo: "${label}" ainda não tem tela.`)}>
              <Icon name={ic} size={20} />
              {label}
              <span className="arrow"><Icon name="chevron-right" size={18} /></span>
            </button>
          ))}
        </Card>

        <div className="espaco4" />
        <button className="logout" onClick={store.sair}>
          <Icon name="log-out" size={19} />Sair da conta
        </button>

        <div className="perfil-rodape">
          Tenvê · protótipo navegável · build {__BUILD__}
        </div>
      </div>
    </>
  )
}
