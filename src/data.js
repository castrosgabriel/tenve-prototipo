// ---- dados mock do protótipo ----

export const STATUS = {
  andamento: { label: 'Em andamento', cls: 'pill-andamento', group: 'Em andamento' },
  expirado:  { label: 'Pagamento expirado', cls: 'pill-expirado', group: 'Pagamento expirado' },
  arealizar: { label: 'A realizar', cls: 'pill-arealizar', group: 'A realizar' },
  concluida: { label: 'Concluída', cls: 'pill-concluida', group: 'Concluídas' },
}

export const GROUP_ORDER = ['andamento', 'expirado', 'arealizar', 'concluida']

export const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'andamento', label: 'Em andamento' },
  { id: 'expirado', label: 'Expirados' },
  { id: 'arealizar', label: 'A realizar' },
  { id: 'concluida', label: 'Concluídas' },
]

export const VISTORIAS = [
  { id: 'v1', placa: 'ECO6E44', valor: 'R$ 32,50', data: '04/05/2026, 21:00', uf: 'RS',
    laudo: 'Laudo completo', status: 'andamento', tipo: 'Entrada · Com pintura',
    vistoriador: 'Miguel Henrique', etapas: 5, total: 7, solicitante: 'Andréa Lopes' },
  { id: 'v2', placa: 'MRT2K19', valor: 'R$ 32,50', data: '04/05/2026, 18:30', uf: 'RS',
    laudo: 'Laudo completo', status: 'andamento', tipo: 'Saída · Sem pintura',
    vistoriador: 'Miguel Henrique', etapas: 3, total: 7, solicitante: 'Carlos Bento' },
  { id: 'v3', placa: 'ABC1234', valor: 'R$ 32,50', data: '02/05/2026, 09:15', uf: 'MG',
    laudo: 'Laudo completo', status: 'expirado', tipo: 'Entrada · Com pintura',
    vistoriador: 'Miguel Henrique', etapas: 7, total: 7, solicitante: 'Juliana Reis' },
  { id: 'v4', placa: 'QIX4G55', valor: 'R$ 32,50', data: '06/05/2026, 14:00', uf: 'SP',
    laudo: 'Laudo simples', status: 'arealizar', tipo: 'Entrada · Com pintura',
    vistoriador: 'Miguel Henrique', etapas: 0, total: 7, solicitante: 'Pedro Assis' },
  { id: 'v5', placa: 'KOQ5D58', valor: 'R$ 32,50', data: '28/04/2026, 11:40', uf: 'MG',
    laudo: 'Laudo completo', status: 'concluida', tipo: 'Entrada · Com pintura',
    vistoriador: 'Miguel Henrique', etapas: 7, total: 7, solicitante: 'Marina Duarte' },
  { id: 'v6', placa: 'IVK9H85', valor: 'R$ 45,00', data: '24/04/2026, 16:20', uf: 'RS',
    laudo: 'Laudo completo', status: 'concluida', tipo: 'Saída · Com pintura',
    vistoriador: 'Miguel Henrique', etapas: 7, total: 7, solicitante: 'Rafael Nunes' },
]

export const PESQUISAS = [
  { id: 'p1', placa: 'KOQ5D58', valor: 'R$ 65,00', servico: 'R$ 30,00', data: '31/08/2026, 21:00',
    numero: '192', status: 'concluida', solicitante: 'Miguel Henrique',
    hist: [['Buscando dados', '01/09/2026, 09:06'], ['Concluída', '01/09/2026, 09:07']] },
  { id: 'p2', placa: 'QIX4G55', valor: 'R$ 65,00', servico: 'R$ 30,00', data: '25/08/2026, 21:00',
    numero: '183', status: 'concluida', solicitante: 'Miguel Henrique',
    hist: [['Buscando dados', '25/08/2026, 21:00'], ['Concluída', '25/08/2026, 21:02']] },
  { id: 'p3', placa: 'IVK9H85', valor: 'R$ 65,00', servico: 'R$ 30,00', data: '24/08/2026, 21:00',
    numero: '182', status: 'concluida', solicitante: 'Miguel Henrique',
    hist: [['Buscando dados', '24/08/2026, 21:00'], ['Concluída', '24/08/2026, 21:03']] },
]

// ---- fluxo de nova vistoria ----
export const FOTOS = [
  'Frente', 'Traseira', 'Lateral esquerda', 'Lateral direita',
  'Painel', 'Hodômetro', 'Chassi', 'Motor',
]

export const PONTOS_PINTURA = [
  'Para-choque dianteiro', 'Capô', 'Para-lama dianteiro esq.', 'Para-lama dianteiro dir.',
  'Porta dianteira esq.', 'Porta dianteira dir.', 'Porta traseira esq.', 'Porta traseira dir.',
  'Teto', 'Coluna esq.', 'Coluna dir.', 'Para-lama traseiro esq.',
  'Para-lama traseiro dir.', 'Tampa traseira', 'Para-choque traseiro',
]

export const MICRONS = [
  { faixa: '0-99',    cor: '#0b5cff' },
  { faixa: '100-199', cor: '#58d02a' },
  { faixa: '200-299', cor: '#ffdd07' },
  { faixa: '300-399', cor: '#ff8027' },
  { faixa: '400+',    cor: '#ff3954' },
]

export const CHECKLIST = [
  'Luz do airbag acesa',
  'Veículo blindado',
  'Kit gás (GNV) instalado',
  'Vidros com película',
  'Sinais de sinistro na estrutura',
  'Estepe e ferramentas presentes',
]

export const SUGESTOES = [
  'Pneus com desgaste irregular',
  'Risco na porta traseira direita',
  'Para-choque dianteiro com amassado',
]

export const CATEGORIAS_EXTRA = ['Estrutura', 'Lataria', 'Pintura', 'Interior', 'Pneus', 'Motor']

export const ETAPAS = [
  { id: 'veiculo',   n: 1, titulo: 'Dados iniciais',      obrig: true,  tela: 'nv-veiculo' },
  { id: 'fotos',     n: 2, titulo: 'Fotos do veículo',    obrig: true,  tela: 'nv-fotos' },
  { id: 'pintura',   n: 3, titulo: 'Teste de pintura',    obrig: true,  tela: 'nv-pintura' },
  { id: 'extras',    n: 4, titulo: 'Fotos extras',        obrig: false, tela: 'nv-extras' },
  { id: 'checklist', n: 5, titulo: 'Checklist',           obrig: true,  tela: 'nv-checklist' },
  { id: 'obs',       n: 6, titulo: 'Observações gerais',  obrig: false, tela: 'nv-obs' },
]

export function novoRascunho() {
  return {
    solicitante: { nome: '', telefone: '', email: '' },
    veiculo: { placa: '', chassi: '', renavam: '', marca: '', km: '', tipo: 'Entrada', pintura: 'Com pintura' },
    fotos: Array(FOTOS.length).fill(false),
    pintura: Array(PONTOS_PINTURA.length).fill(null),
    extras: [],
    checklist: {},
    obs: '',
    feito: { veiculo: false, fotos: false, pintura: false, extras: false, checklist: false, obs: false },
  }
}

// dados do laudo cautelar (tela de relatório)
export const LAUDO = {
  identificacao: [
    ['UF (emplacado)', 'MG'], ['Município (emplacado)', 'CARANDAI'], ['Renavam', '00451229266'],
    ['Chassi', '9BWKB05UXCP162797'], ['Número do motor', 'CCRA03803'],
  ],
  especificacoes: [
    ['Tipo', 'Comercial Leve'], ['Marca', 'VOLKSWAGEN'], ['Modelo', 'SAVEIRO 16 CS'], ['Categoria', 'Carga'],
    ['Combustível', 'Álcool/Gasolina'], ['Ano fabricação', '2011'], ['Ano modelo', '2012'], ['Cor', 'BRANCA'],
    ['Cilindrada', '1598 cc'], ['Situação', 'Circulação'], ['Origem', 'Não disponível'], ['Lic. IPVA', 'Não disponível'],
  ],
  financeira: [
    { t: 'SEM RESTRIÇÃO', c: '#1f9d3c' },
    { t: 'COM RESTRIÇÃO', c: '#a2ada7' },
  ],
  restricoes: [
    { t: 'SEM RESTRIÇÃO', c: '#1f9d3c' },
    { t: 'ADMINISTRATIVA · COMUNICADO DE VENDA', c: '#f2415a' },
    { t: 'RESTRIÇÃO 01 · RECUPERADO SINISTRO', c: '#f2415a' },
    { t: 'RESTRIÇÃO 03 · COMUNICADO DE VENDA', c: '#f2415a' },
  ],
  financiamento: [
    ['Financiador', 'Não disponível'], ['Doc. financiador', 'Não disponível'],
    ['Agente', 'Não disponível'], ['Validade', 'Não disponível'],
  ],
  debitos: [
    ['IPVA', 'R$ 1.334,83', 'Com débito', true],
    ['DPVAT / Seguro', 'R$ 0,00', 'Sem débito', false],
  ],
  categorias: [
    { t: 'IDENTIFICAÇÃO DO VEÍCULO', c: '#1f9d3c' },
    { t: 'RESTRIÇÕES & INFO. FINANCEIRAS', c: '#f2415a' },
    { t: 'INDICADORES', c: '#f2415a' },
    { t: 'SINISTRO / ACIDENTE', c: '#f2415a' },
    { t: 'PASSAGEM POR LEILÃO', c: '#f2415a' },
  ],
}

export function proximoId(prefixo, lista) {
  return prefixo + (lista.length + 1) + '-' + Math.random().toString(36).slice(2, 6)
}

export function agora() {
  const d = new Date()
  const p = n => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`
}
