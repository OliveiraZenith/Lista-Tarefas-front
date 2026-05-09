/** Extrai mensagem amigável de erros do Axios (API ou rede). */
export function formatRequestError(error, fallback = 'Algo deu errado.') {
  const status = error.response?.status
  const raw = error.response?.data?.message

  let apiMsg = raw
  if (Array.isArray(apiMsg)) apiMsg = apiMsg.filter(Boolean).join(' ')
  if (typeof apiMsg !== 'string') apiMsg = ''

  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Tempo da requisição esgotado. Tente de novo.'
    }
    return 'Não foi possível conectar à API. Verifique sua internet e se o endereço em VITE_API_URL está correto.'
  }

  if (status >= 500 && status < 600) {
    const hint =
      'Isso indica falha no servidor (por exemplo banco de dados desconectado ou variável de ambiente ausente no Render). Confira os logs da API no painel do Render.'
    if (apiMsg && apiMsg !== 'Erro interno do servidor') {
      return `${apiMsg} ${hint}`
    }
    return `Erro interno no servidor. ${hint}`
  }

  if (status === 429) {
    return apiMsg || 'Muitas tentativas. Aguarde um momento e tente de novo.'
  }

  if (apiMsg) return apiMsg

  if (typeof error.message === 'string' && error.message) {
    return error.message
  }

  return fallback
}
