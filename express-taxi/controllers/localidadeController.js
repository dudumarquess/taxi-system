const fs = require('fs');
const csvParser = require('csv-parser');

let codigosPostais = {};

const path = require('path');
const filePath = path.join(__dirname, '..', '..', 'data', 'codigos_postais.csv');

fs.createReadStream(filePath)
  .pipe(csvParser({ separator: ',' }))
  .on('data', (row) => {
    const codigoPostal = `${row.num_cod_postal}-${row.ext_cod_postal}`;
    codigosPostais[codigoPostal] = row.desig_postal;
  })
  .on('end', () => {
    console.log('CSV carregado com sucesso!');
});

// Função síncrona
function obterLocalidadePorCodigoPostal(codigoPostal) {
  return codigosPostais[codigoPostal] || null;
}

// Export da rota
exports.getLocalidade = (req, res) => {
  const codigoPostal = req.params.codigoPostal;
  const localidade = obterLocalidadePorCodigoPostal(codigoPostal);

  if (localidade) {
    res.json({ localidade });
  } else {
    res.status(404).json({ erro: 'Código postal não encontrado' });
  }
};

exports.obterLocalidadePorCodigoPostal = obterLocalidadePorCodigoPostal;

