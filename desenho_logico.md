Grupo PSI24

Este documento descreve o desenho lógico da base de dados para o protótipo da aplicação web de gestão de táxis, com base no modelo documental do MongoDB.

# Desenho Lógico da Base de Dados - Sistema de Táxis (MongoDB)

## Coleção: motoristas
- `_id`: ObjectId
- `nome`: String
- `nif`: String (9 dígitos, positivo)
- `genero`: String ("masculino" ou "feminino")
- `ano_nascimento`: Number (>= 18 anos antes do ano atual)
- `carta_conducao`: String (único)
- `morada_id`: ObjectId (referencia a `moradas`)

--- 

## Coleção: moradas
- `_id`: ObjectId
- `rua`: String
- `numero`: Number
- `codigo_postal`: String
- `localidade`: String

---

## Coleção: taxis
- `_id`: ObjectId
- `matricula`: String (unica)
- `marca`: String
- `modelo`: String
- `ano_compra`: Number (anterior ou igual ao ano de qualquer turno)
- `nivel_conforto`: String ("basico" ou "luxuoso")
- `quilometragem_total`: Number (opcional e positiva)

## Coleção: turnos
- `_id`: ObjectId
- `motorista_id`: ObjectId (referencia a `motoristas`)
- `taxi_id`: ObjectId (referencia a `taxis`)
- `inicio`: Date
- `fim`: Date
- `preco_minuto`: Number (> 0)

> - Restrições
> - `inicio` < `fim`
> - O `ano_compra` do taxi tem de ser <= ano do `inicio`
> - Não pode haver interseção de períodos para o mesmo motorista ou taxi

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
