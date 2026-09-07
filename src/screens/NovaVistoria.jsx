import { useState } from 'react'
import Icon from '../icons'
import {
  CATEGORIAS_EXTRA, CHECKLIST, ETAPAS, FOTOS, MICRONS, PONTOS_PINTURA, SUGESTOES,
} from '../data'
import {
  ActionBar, Bar, Button, Card, ContextBar, DataRow, Field, Note, StepBar,
} from '../ui'

const TOTAL = 7

function Etapa({ nav, store, n, titulo, opcional, children, onContinuar, rotulo = 'Continuar', podeContinuar = true }) {
  const d = store.rascunho
  return (
    <>
      <StepBar title={titulo} onBack={() => nav.go('nv-hub', {}, 'pop')}
        sub={`Etapa ${n} de ${TOTAL}${opcional ? ' · opcional' : ''}`} progresso={n / TOTAL} />
      <ContextBar placa={d.veiculo.placa} tipo={`${d.veiculo.tipo} · ${d.veiculo.pintura}`} />
      <div className="scroll pad scroll--topo">{children}</div>
      <ActionBar>
        <Button onClick={onContinuar} disabled={!podeContinuar}>{rotulo}</Button>
      </ActionBar>
    </>
  )
}

// ---------------- Etapa 1 · Solicitante ----------------
export function Solicitante({ nav, store }) {
  const d = store.rascunho.solicitante
  const [erro, setErro] = useState({})
  const set = (k, v) => store.setRascunho(r => ({ ...r, solicitante: { ...r.solicitante, [k]: v } }))

  function continuar() {
    const e = {}
    if (!d.nome.trim()) e.nome = 'Informe quem está solicitando.'
    if (!d.telefone.trim()) e.telefone = 'Informe um telefone de contato.'
    if (!d.email.includes('@')) e.email = 'Informe um e-mail válido.'
    setErro(e)
    if (Object.keys(e).length) return
    nav.go('nv-hub', {}, 'pop')
  }

  return (
    <>
      <StepBar title="Solicitante" onBack={() => nav.back()}
        sub={`Etapa 1 de ${TOTAL}`} progresso={1 / TOTAL} />
      <div className="scroll pad scroll--topo">
        <p className="intro">
          Quem está pedindo a vistoria. Usamos esses dados para contato e envio do laudo.
        </p>
        <Field label="Nome completo" required icon="user" error={erro.nome}
          value={d.nome} placeholder="Nome de quem solicita" onChange={e => set('nome', e.target.value)} />
        <Field label="Telefone" required icon="phone" error={erro.telefone}
          value={d.telefone} placeholder="(00) 00000-0000" onChange={e => set('telefone', e.target.value)} />
        <Field label="E-mail" required icon="mail" error={erro.email}
          value={d.email} placeholder="email@exemplo.com" onChange={e => set('email', e.target.value)} />
        <Note tone="info">O laudo final é enviado para este e-mail assim que a vistoria for concluída.</Note>
      </div>
      <ActionBar><Button onClick={continuar}>Continuar</Button></ActionBar>
    </>
  )
}

// ---------------- Hub de progresso ----------------
export function Hub({ nav, store }) {
  const d = store.rascunho
  const feitas = 1 + ETAPAS.filter(e => d.feito[e.id]).length
  const obrigOk = ETAPAS.filter(e => e.obrig).every(e => d.feito[e.id])

  return (
    <>
      <StepBar title="Vistoria" onBack={() => nav.reset('vistorias', {}, 'fade')}
        sub={`${d.veiculo.pintura} · ${feitas} de ${TOTAL} concluídas`} progresso={feitas / TOTAL} />
      <div className="scroll scroll--topo">
        <div className="hubgrid">
          <button className="hubcard done" onClick={() => nav.go('nv-solicitante')}>
            <span className="num"><Icon name="check" size={15} strokeWidth={3} /></span>
            <span className="t">Dados do solicitante</span>
            <span className="s">Concluída</span>
          </button>
          {ETAPAS.map(e => {
            const done = d.feito[e.id]
            return (
              <button key={e.id} className={`hubcard${done ? ' done' : e.obrig ? '' : ' opt'}`}
                onClick={() => nav.go(e.tela)}>
                <span className="num">{done ? <Icon name="check" size={15} strokeWidth={3} /> : e.n}</span>
                <span className="t">{e.titulo}</span>
                <span className="s">{done ? 'Concluída' : e.obrig ? 'Obrigatória' : 'Opcional'}</span>
              </button>
            )
          })}
        </div>
      </div>
      <ActionBar>
        <Button variant="ghost" icon={null} auto onClick={() => { store.salvarRascunho(); nav.reset('vistorias', {}, 'fade') }}>
          Salvar
        </Button>
        <Button disabled={!obrigOk} icon={null}
          onClick={() => nav.go('nv-enviada', { numero: store.finalizarVistoria() })}>
          Finalizar vistoria
        </Button>
      </ActionBar>
    </>
  )
}

// ---------------- Etapa 2 · Dados do veículo ----------------
export function Veiculo({ nav, store }) {
  const d = store.rascunho.veiculo
  const [erro, setErro] = useState({})
  const set = (k, v) => store.setRascunho(r => ({ ...r, veiculo: { ...r.veiculo, [k]: v } }))
  const placaOk = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(d.placa.toUpperCase())

  function continuar() {
    const e = {}
    if (!placaOk) e.placa = 'Placa inválida. Use o formato ABC1234 ou ABC1D23.'
    if (!d.chassi.trim()) e.chassi = 'Informe o chassi.'
    if (!d.marca.trim()) e.marca = 'Informe marca e modelo.'
    setErro(e)
    if (Object.keys(e).length) return
    store.concluirEtapa('veiculo')
    nav.go('nv-hub', {}, 'pop')
  }

  return (
    <Etapa nav={nav} store={store} n={2} titulo="Dados do veículo" onContinuar={continuar}>
      <div className="secao">Identificação</div>
      <Field label="Placa" required icon="car" error={erro.placa} ok={placaOk}
        value={d.placa} placeholder="ABC1234"
        onChange={e => set('placa', e.target.value.toUpperCase().slice(0, 7))} />
      <Field label="Chassi" required icon="file-text" error={erro.chassi}
        value={d.chassi} placeholder="9BWKB05UXCP162797"
        onChange={e => set('chassi', e.target.value.toUpperCase())} />
      <Field label="Renavam" icon="file-text"
        value={d.renavam} placeholder="00451229266" onChange={e => set('renavam', e.target.value)} />

      <div className="secao secao--espacada">Características</div>
      <Field label="Marca e modelo" required icon="car" error={erro.marca}
        value={d.marca} placeholder="VOLKSWAGEN SAVEIRO" onChange={e => set('marca', e.target.value)} />
      <Field label="Quilometragem" icon="clipboard"
        value={d.km} placeholder="Não visível" onChange={e => set('km', e.target.value)} />

      <div className="secao secao--espacada">Tipo de vistoria</div>
      <div className="chips chips--mb12">
        {['Entrada', 'Saída'].map(t => (
          <button key={t} className={`chip${d.tipo === t ? ' on' : ''}`} onClick={() => set('tipo', t)}>{t}</button>
        ))}
      </div>
      <div className="chips chips--mb20">
        {['Com pintura', 'Sem pintura'].map(t => (
          <button key={t} className={`chip${d.pintura === t ? ' on' : ''}`} onClick={() => set('pintura', t)}>{t}</button>
        ))}
      </div>
    </Etapa>
  )
}

// ---------------- Etapa 3 · Fotos do veículo ----------------
export function Fotos({ nav, store }) {
  const d = store.rascunho
  const n = d.fotos.filter(Boolean).length
  const toggle = i => store.setRascunho(r => {
    const fotos = [...r.fotos]; fotos[i] = !fotos[i]; return { ...r, fotos }
  })

  return (
    <Etapa nav={nav} store={store} n={3} titulo="Fotos do veículo" podeContinuar={n === FOTOS.length}
      rotulo={n === FOTOS.length ? 'Continuar' : `Faltam ${FOTOS.length - n} fotos`}
      onContinuar={() => { store.concluirEtapa('fotos'); nav.go('nv-hub', {}, 'pop') }}>
      <div className="metercount">
        <b>{n} de {FOTOS.length} capturadas</b>
        <span>{Math.round((n / FOTOS.length) * 100)}%</span>
      </div>
      <Bar value={n / FOTOS.length} />
      <div className="photogrid">
        {FOTOS.map((label, i) => (
          <div key={label}>
            <button className={`slot${d.fotos[i] ? ' filled' : ''}`} onClick={() => toggle(i)}
              aria-label={`Foto ${label}`}>
              <span className="idx mono">{String(i + 1).padStart(2, '0')}</span>
              {!d.fotos[i] && <Icon name="camera" size={26} />}
              {d.fotos[i] && <span className="ck"><Icon name="check" size={14} strokeWidth={3} color="#fff" /></span>}
            </button>
            <p className="slotlabel">{label}</p>
          </div>
        ))}
      </div>
      <div className="espaco12" />
      <Note tone="info" icon="camera">Toque no quadro para simular a captura da foto.</Note>
    </Etapa>
  )
}

// ---------------- Etapa 4 · Teste de pintura ----------------
export function Pintura({ nav, store }) {
  const d = store.rascunho
  const n = d.pintura.filter(x => x !== null).length
  const escolher = (p, f) => store.setRascunho(r => {
    const pintura = [...r.pintura]; pintura[p] = f; return { ...r, pintura }
  })

  return (
    <Etapa nav={nav} store={store} n={4} titulo="Teste de pintura" podeContinuar={n > 0}
      rotulo={n === PONTOS_PINTURA.length ? 'Continuar' : n ? `Continuar (${n}/${PONTOS_PINTURA.length})` : 'Meça ao menos 1 ponto'}
      onContinuar={() => { store.concluirEtapa('pintura'); nav.go('nv-hub', {}, 'pop') }}>
      <div className="metercount">
        <b>{n} de {PONTOS_PINTURA.length} medidos</b>
        <span>{Math.round((n / PONTOS_PINTURA.length) * 100)}%</span>
      </div>
      <Bar value={n / PONTOS_PINTURA.length} />
      <Note tone="info">Meça a espessura com o medidor e toque na faixa de mícrons correspondente.</Note>
      {PONTOS_PINTURA.map((ponto, p) => {
        const sel = d.pintura[p]
        return (
          <div className="mpoint" key={ponto}>
            <div className="hd">
              <span className="n">{String(p + 1).padStart(2, '0')}</span>
              <span className="nm">{ponto}</span>
              <Icon name="palette" size={18} color="#6b7a72" />
            </div>
            <div className="swatches">
              {MICRONS.map((m, f) => (
                <div key={m.faixa}>
                  <button className={`sw${sel === f ? ' sel' : ''}`} onClick={() => escolher(p, f)}
                    aria-label={`${ponto}: ${m.faixa} mícrons`}
                    style={{ background: m.cor, opacity: sel === null || sel === f ? 1 : .38 }} />
                  <div className="swlabel">{m.faixa}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </Etapa>
  )
}

// ---------------- Etapa 5 · Fotos extras ----------------
export function Extras({ nav, store }) {
  const d = store.rascunho
  const [form, setForm] = useState(null)

  function adicionar() {
    if (!form.local.trim()) return
    store.setRascunho(r => ({ ...r, extras: [...r.extras, { ...form, id: Date.now() }] }))
    setForm(null)
  }

  return (
    <Etapa nav={nav} store={store} n={5} titulo="Fotos extras" opcional
      onContinuar={() => { store.concluirEtapa('extras'); nav.go('nv-hub', {}, 'pop') }}>
      {!form && (
        <button className="adddash" onClick={() => setForm({ categoria: 'Estrutura', local: '', descricao: '' })}>
          <Icon name="plus" size={20} strokeWidth={2.5} />Adicionar foto extra
        </button>
      )}

      {form && (
        <Card title="Nova foto extra">
          <div className="slot filled slot--novo">
            <span className="idx mono">NOVA</span>
          </div>
          <div className="secao secao--mb8">Categoria</div>
          <div className="chips chips--mb16">
            {CATEGORIAS_EXTRA.map(c => (
              <button key={c} className={`chip${form.categoria === c ? ' on' : ''}`}
                onClick={() => setForm(f => ({ ...f, categoria: c }))}>{c}</button>
            ))}
          </div>
          <Field label="Local" required value={form.local} placeholder="Porta traseira direita"
            onChange={e => setForm(f => ({ ...f, local: e.target.value }))} />
          <Field label="Descrição" value={form.descricao} placeholder="Risco na pintura"
            onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
          <div className="acoes-lado">
            <Button variant="ghost" icon={null} onClick={() => setForm(null)}>Cancelar</Button>
            <Button icon={null} onClick={adicionar} disabled={!form.local.trim()}>Adicionar</Button>
          </div>
        </Card>
      )}

      <div className="secao">
        Adicionadas {d.extras.length ? `(${d.extras.length})` : ''}
      </div>
      {!d.extras.length && (
        <div className="empty empty--curto">
          <Icon name="camera" size={30} /><br />Nenhuma foto extra ainda.
        </div>
      )}
      {d.extras.map(x => (
        <div className="extrarow" key={x.id}>
          <div className="extrathumb" />
          <div className="body">
            <div className="cat">{x.categoria}</div>
            <div className="ti">{x.local}</div>
            <div className="de">{x.descricao || 'Sem descrição'}</div>
          </div>
          <button className="sqbtn" onClick={() => setForm({ ...x })} aria-label="Editar"><Icon name="square-pen" size={17} /></button>
          <button className="sqbtn danger" aria-label="Excluir"
            onClick={() => store.setRascunho(r => ({ ...r, extras: r.extras.filter(e => e.id !== x.id) }))}>
            <Icon name="trash" size={17} />
          </button>
        </div>
      ))}
    </Etapa>
  )
}

// ---------------- Etapa 6 · Checklist ----------------
export function Checklist({ nav, store }) {
  const d = store.rascunho
  const respondidos = Object.keys(d.checklist).length
  const set = (item, val) => store.setRascunho(r => ({ ...r, checklist: { ...r.checklist, [item]: val } }))

  return (
    <Etapa nav={nav} store={store} n={6} titulo="Checklist" podeContinuar={respondidos === CHECKLIST.length}
      rotulo={respondidos === CHECKLIST.length ? 'Continuar' : `Faltam ${CHECKLIST.length - respondidos} itens`}
      onContinuar={() => { store.concluirEtapa('checklist'); nav.go('nv-hub', {}, 'pop') }}>
      <Note tone="warn" icon="alert-triangle" title="Confira antes de marcar">
        Verifique fisicamente cada item — estas respostas entram no laudo.
      </Note>
      <div className="secao secao--mb8">Resumo</div>
      <Card>
        <DataRow k="Placa" v={d.veiculo.placa || '—'} mono />
        <DataRow k="Quilometragem" v={d.veiculo.km || 'Não visível'} />
        <DataRow k="Tipo de vistoria" v={d.veiculo.tipo} />
      </Card>
      <div className="secao secao--mt16">Itens de verificação</div>
      {CHECKLIST.map(item => (
        <div className="checkrow" key={item}>
          <div className="q"><Icon name="info" size={17} color="#6b7a72" />{item}</div>
          <div className="yn">
            {['Sim', 'Não'].map(op => (
              <button key={op} className={`ynbtn${d.checklist[item] === op ? ' on' : ''}`} onClick={() => set(item, op)}>
                <span className="dot">{d.checklist[item] === op && <Icon name="check" size={12} strokeWidth={3} color="#fff" />}</span>
                {op}
              </button>
            ))}
          </div>
        </div>
      ))}
    </Etapa>
  )
}

// ---------------- Etapa 7 · Observações ----------------
export function Observacoes({ nav, store }) {
  const d = store.rascunho
  const obrigOk = ETAPAS.filter(e => e.obrig).every(e => d.feito[e.id])
  const add = s => store.setRascunho(r => ({ ...r, obs: (r.obs ? r.obs + '\n' : '') + s }))

  return (
    <Etapa nav={nav} store={store} n={7} titulo="Observações gerais" opcional
      rotulo={obrigOk ? 'Finalizar vistoria' : 'Salvar e voltar'}
      onContinuar={() => {
        store.concluirEtapa('obs')
        if (obrigOk) nav.go('nv-enviada', { numero: store.finalizarVistoria() })
        else nav.go('nv-hub', {}, 'pop')
      }}>
      <textarea className="ta" value={d.obs} maxLength={500}
        onChange={e => store.setRascunho(r => ({ ...r, obs: e.target.value }))}
        placeholder="Descreva o que for relevante sobre o estado do veículo." />
      <div className="mono contador">
        {d.obs.length} / 500
      </div>
      <div className="secao secao--linha">
        <span>Sugestões do sistema</span><span>{SUGESTOES.length}</span>
      </div>
      <div className="chips chips--coluna">
        {SUGESTOES.map(s => (
          <button key={s} className="chip" onClick={() => add(s)}>
            <Icon name="plus" size={16} strokeWidth={2.5} />{s}
          </button>
        ))}
      </div>
    </Etapa>
  )
}

// ---------------- Enviada ----------------
export function Enviada({ nav, store, params }) {
  return (
    <>
      <StepBar title="Vistoria enviada" onBack={() => nav.reset('vistorias', {}, 'fade')}
        sub={`Laudo #${params?.numero || store.ultimoLaudo}`} />
      <div className="scroll pad scroll--topo">
        <div className="note note-lime aviso-sucesso">
          <span className="successicon"><Icon name="check" size={22} strokeWidth={3} color="#fff" /></span>
          <div>
            <b>Vistoria liberada</b>
            Sem pagamento nesta etapa — a cobrança é feita na conta da franquia.
            O laudo já entrou na fila de análise.
          </div>
        </div>
        <Card>
          <DataRow k="Status" v="Buscando dados do veículo" strong />
          <DataRow k="Modalidade" v="Conta da franquia" />
          <DataRow k="Placa" v={store.rascunho.veiculo.placa || '—'} mono />
        </Card>
      </div>
      <ActionBar><Button onClick={() => nav.reset('vistorias')}>Concluir</Button></ActionBar>
    </>
  )
}
