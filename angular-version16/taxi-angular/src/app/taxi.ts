export interface Taxi {
    _id?: string;
    matricula: string;
    marca: string;
    modelo: string;
    ano_compra: number;
    nivel_conforto: 'básico' | 'luxuoso';
    createdAt?: Date;
    updatedAt?: Date;
    temViagem?: boolean;
    temTurno?: boolean;
}
