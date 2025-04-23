const fs = require('fs');
const csvParser = require('csv-parser');

let codigosPostais = {};

// Carregar o CSV e passar os dados do cod postal associado a uma localidade
fs.createReadStream('c:\\Users\\ravia\\Downloads\\projeto_taxis_psi\\data\\codigos_postais.csv')
  .pipe(csvParser({ separator: ',' }))
  .on('data', (row) => {
    const codigoPostal = `${row.num_cod_postal}-${row.ext_cod_postal}`;
    codigosPostais[codigoPostal] = row.desig_postal;
  })
  .on('end', () => {
    console.log('CSV carregado com sucesso!');
  });

exports.obterLocalidadePorCodigoPostal = async (codigoPostal) => {
  return codigosPostais[codigoPostal] || null;
};
