export interface Preco {
    nivelConforto: string; // 'básico' ou 'luxuoso'
    precoPorMinuto: number; // Preço em euros por minuto
    acrescimoNoturno: number; // Acréscimo percentual para o período noturno
}