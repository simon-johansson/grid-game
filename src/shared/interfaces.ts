
export type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & { length: TLength };

export type Tuple5<T> = Tuple<T, 5>;

export type Board5x5<P> = Tuple5<Tuple5<P>>;
