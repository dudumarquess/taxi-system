import { Pessoa } from './pessoa';
import { Morada } from './morada'
export interface Motorista extends Pessoa {
    anoNascimento: number;
    numeroCartaConducao: string;
    morada: Morada;
    createdAt?: Date;
    updatedAt?: Date;
    jaRequisitou?: boolean;
}