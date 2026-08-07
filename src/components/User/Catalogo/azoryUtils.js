import { api } from "../../../services/api"

// Junta classes ignorando valores falsy.
export function cn(...args) {
  return args.flat().filter(Boolean).join(" ")
}

// Preço em Real brasileiro.
export function formatPrice(value) {
  const number = Number(value) || 0
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

// Numeração editorial "N° 01".
export function pieceNumber(n) {
  return `N° ${String(n).padStart(2, "0")}`
}

// Resolve a URL da imagem vinda do backend (mesma base do axios).
export function resolveImage(imagem) {
  if (!imagem) return "/placeholder.svg"
  if (/^https?:\/\//i.test(imagem)) return imagem
  const base = api?.defaults?.baseURL || ""
  return `${base}${imagem}`
}

// Opções de ordenação (client-side, sobre os dados reais do banco).
export const SORT_OPTIONS = [
  { value: "recentes", label: "Mais recentes" },
  { value: "preco-asc", label: "Menor preço" },
  { value: "preco-desc", label: "Maior preço" },
  { value: "nome", label: "Nome (A–Z)" },
]
