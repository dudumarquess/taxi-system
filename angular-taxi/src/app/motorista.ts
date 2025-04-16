import { Pessoa } from './pessoa';
import { Morada } from './morada'
export interface Motorista extends Pessoa {
    anoNascimento: number;
    numeroCartaConducao: number;
    morada: Morada;
    createdAt?: Date;
}