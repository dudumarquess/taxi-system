export interface Taxi {
    _id?: string;
    matricula: string;
    marca: string;
    modelo: string;
    anoCompra: number;
    conforto: 'basico' | 'luxuoso';
    createdAt?: Date;
}
