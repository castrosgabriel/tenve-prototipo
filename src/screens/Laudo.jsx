import { LAUDO } from '../data'
import { ActionBar, Button, StepBar } from '../ui'
import qrLaudo from '../assets/img/qr-laudo.png'

function Sec({ titulo, children }) {
  return (
    <div className="sec">
      <div className="sechd">{titulo}</div>
      {children}
    </div>
  )
}

function Grid({ itens }) {
  return (
    <div className="grid4">
      {itens.map(([k, v]) => (
        <div key={k}><div className="k">{k}</div><div className="v">{v}</div></div>
      ))}
    </div>
  )
}

export default function Laudo({ nav, params }) {
  const { placa, numero, origem } = params
  return (
    <>
      <StepBar title={origem === 'Pesquisa' ? 'Pesquisa' : 'Laudo'} onBack={nav.back}
        sub={<span className="mono">{placa}</span>} />
      <div className="scroll pad" style={{ paddingTop: 8 }}>
        <div className="laudo">
          <div className="lhead">
            <div>
              <div className="wm">TENVÊ</div>
              <div className="sb">LAUDO CAUTELAR<br />VISTORIA VEICULAR</div>
            </div>
            <div className="rt">
              <div className="k">RELATÓRIO OFICIAL</div>
              <div className="n">Nº {numero}</div>
              <div className="s">Status: CONCLUÍDO</div>
              <div className="s">Emitido em: 01/09/2026</div>
            </div>
            <img className="qr" src={qrLaudo} alt="" width={46} height={46} />
          </div>
          <div className="limebar" />

          <div className="lstrip">
            <div className="platebadge">
              <div className="k">PLACA</div>
              <div className="p">{placa}</div>
            </div>
            <div className="cell"><div className="k">SERVIÇO</div><div className="v">{origem === 'Pesquisa' ? 'Pesquisa Veicular' : 'Vistoria Cautelar'}</div></div>
            <div className="cell"><div className="k">CLIENTE</div><div className="v">Miguel Henrique</div></div>
            <div className="cell"><div className="k">SOLICITAÇÃO</div><div className="v">01/09/2026</div></div>
            <div className="cell"><div className="k">EMISSÃO</div><div className="v">01/09/2026</div></div>
            <div className="cell"><div className="k">VÁLIDO ATÉ</div><div className="v">11/09/2026</div></div>
          </div>

          <div className="cats">
            {LAUDO.categorias.map(c => (
              <div className="cat" key={c.t} style={{ background: c.c }}>
                <span className="box" />{c.t}
              </div>
            ))}
          </div>

          <Sec titulo="IDENTIFICAÇÃO DO VEÍCULO">
            <Grid itens={[['Placa', placa], ...LAUDO.identificacao]} />
          </Sec>

          <Sec titulo="ESPECIFICAÇÕES DO VEÍCULO">
            <Grid itens={LAUDO.especificacoes} />
          </Sec>

          <Sec titulo="RESTRIÇÕES & INFORMAÇÕES FINANCEIRAS">
            <div className="restr">
              <div>
                <div className="rk">RESTRIÇÃO FINANCEIRA</div>
                {LAUDO.financeira.map(r => (
                  <span className="tagline2" key={r.t} style={{ background: r.c }}>
                    <span className="sq" />{r.t}
                  </span>
                ))}
              </div>
              <div>
                <div className="rk">OUTRAS RESTRIÇÕES</div>
                {LAUDO.restricoes.map(r => (
                  <span className="tagline2" key={r.t} style={{ background: r.c }}>
                    <span className="sq" />{r.t}
                  </span>
                ))}
              </div>
            </div>
            <Grid itens={LAUDO.financiamento} />
            <table>
              <thead><tr><th>DÉBITO</th><th>VALOR</th><th>SITUAÇÃO</th></tr></thead>
              <tbody>
                {LAUDO.debitos.map(([d, v, s, ruim]) => (
                  <tr key={d}>
                    <td>{d}</td><td>{v}</td>
                    <td style={{ color: ruim ? '#d01836' : '#3f7a10' }}>{s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Sec>

          <div style={{ fontSize: 9, color: '#a2ada7', padding: '12px 2px 4px', lineHeight: '14px' }}>
            Documento gerado eletronicamente pela plataforma Tenvê. Protótipo — dados ilustrativos.
          </div>
        </div>
      </div>
      <ActionBar>
        <Button icon="arrow-right" onClick={() => alert('Protótipo: aqui o PDF seria compartilhado.')}>
          Compartilhar laudo
        </Button>
      </ActionBar>
    </>
  )
}
