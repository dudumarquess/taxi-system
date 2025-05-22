import { Motorista } from './motorista';
import { Taxi } from './taxi';

export interface Turno {
    motorista: Motorista;
    inicio: Date;
    fim: Date;
    taxi: Taxi;
}