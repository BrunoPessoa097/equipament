export interface PaginacaoInterface<T> {
  dados: T;
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}
