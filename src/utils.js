const MESES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

/** "2024-03-15" -> "mar 2024" (sin pasar por Date para evitar desfases de zona horaria). */
export function formatoMes(iso) {
  if (!iso) return '';
  const [y, m] = iso.split('-');
  const mes = MESES[Number(m) - 1];
  return mes ? `${mes} ${y}` : iso;
}

export function rangoFechas(inicio, fin) {
  return `${formatoMes(inicio)} – ${fin ? formatoMes(fin) : 'Actualidad'}`;
}
