Grupo PSI24

Este documento descreve o desenho lógico da base de dados para o protótipo da aplicação web de gestão de táxis, com base no modelo documental do MongoDB.

# Desenho Lógico da Base de Dados - Sistema de Táxis (MongoDB)

## Coleção: motoristas
- `_id`: ObjectId
- `nome`: String
- `nif`: String (9 dígitos, positivo)
- `genero`: String ("Masculino" ou "Feminino")
- `anoNascimento`: Number (>= 18 anos antes do ano atual)
- `numeroCartaConducao`: String (único)
- `morada_id`: ObjectId (referencia a `moradas`)
- `createdAt`: Date

--- 

## Coleção: moradas
- `_id`: ObjectId
- `rua`: String
- `numeroPorta`: Number
- `codigoPostal`: String
- `localidade`: String

---

## Coleção: taxis
- `_id`: ObjectId
- `matricula`: String (unica)
- `marca`: String
- `modelo`: String
- `ano_compra`: Number (anterior ou igual ao ano de qualquer turno)
- `nivel_conforto`: String ("Basico" ou "Luxuoso")
- `quilometragem_total`: Number (opcional e positiva)
- `createdAt`: Date 

## Coleção: precos
- `_id`: ObjectId
- `nivelConforto`: String ()
- `precoPorMinuto`: Number (>= 0)
- `acrescimoNoturno`: Number (>= 0)

--- 

## Coleção: viagens
- `_id`: ObjectId
- `turno_id`: ObjectId (referencia a `turnos`)
- `numero_sequencia`: Number (inicia em 1 para cada turno)
- `data_inicio`: Date
- `data_fim`: Date
- `numero_pessoas`: Number (>= 1)
- `quilometros`: Number (> 0)
- `valor_pago`: Number (> 0)

---

## Coleção: faturas
- `_id`: ObjectId
- `numero`: Number (unico e crescente, começa em 1)
- `data_emissao`: Date (posterior a `viagem.data_inicio`)
- `viagem_id`: ObjectId (referencia a `viagens`)
- `valor_total`: Number (> 0)

---


- Uma fatura é única no sistema (não existem filiais).
