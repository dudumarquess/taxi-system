//traduzir o codigo postal para a localidade
exports.obterLocalidadePorCodigoPostal = async (codigoPostal) => {
    // Simulação de base de dados externa
    const mockCodigos = {
      "1000-001": "Lisboa",
      "4000-002": "Porto",
      "1234-567": "Coimbra",
      "2675-411": "Odivelas"
    };
  
    return mockCodigos[codigoPostal] || null;
  };