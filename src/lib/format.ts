export function formatBRL(valor?: number | null) {
  if (valor == null) return '';
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}
