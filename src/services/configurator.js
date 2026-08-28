import { api } from "./api";

export function normalizeConfiguration(configuration = {}) {
  const normalized = {};

  Object.entries(configuration).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      normalized[key] = value.filter((item) => item !== undefined && item !== null && item !== "");
      return;
    }

    normalized[key] = value;
  });

  return normalized;
}

export async function getConfigurator(productId) {
  if (!productId) {
    throw new Error("productId é obrigatório para obter o configurador.");
  }

  const response = await api.get(`/produtos/${productId}/personalizacao`);
  return response.data || {};
}

export async function calculateConfiguration(productId, configuration) {
  const payload = normalizeConfiguration(configuration);
  const response = await api.post(`/produtos/${productId}/personalizacao/calcular`, {
    configuracao: payload,
    configuration: payload,
  });

  return response.data;
}

export async function validateConfiguration(productId, configuration) {
  const payload = normalizeConfiguration(configuration);
  const response = await api.post(`/produtos/${productId}/personalizacao/validar`, {
    configuracao: payload,
    configuration: payload,
  });

  return response.data;
}

export async function addCustomizedProductToCart(productId, configuration, extra = {}) {
  const payload = {
    produtoId: Number(productId),
    configuracao: normalizeConfiguration(configuration),
    ...extra,
  };

  const response = await api.post("/carrinho", payload);
  return response.data;
}

export default {
  getConfigurator,
  calculateConfiguration,
  validateConfiguration,
  addCustomizedProductToCart,
  normalizeConfiguration,
};
