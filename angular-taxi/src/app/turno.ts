import { Motorista } from './motorista';
import { Taxi } from './taxi';

export interface Turno {
    motoristaId: Motorista;
    inicio: Date;
    fim: Date;
    taxi: Taxi;
}