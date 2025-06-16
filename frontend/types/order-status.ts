export enum OrderStatus {
  ОФОРМЛЕН = 'оформлен',
  ГОТОВИТСЯ = 'готовится',
  В_ДОСТАВКЕ = 'в доставке',
  ДОСТАВЛЕН = 'доставлен',
}

export const statusColors: { [key in OrderStatus]: string } = {
  [OrderStatus.ОФОРМЛЕН]: '#D9D9D9',
  [OrderStatus.ГОТОВИТСЯ]: '#2C3BA9',
  [OrderStatus.В_ДОСТАВКЕ]: '#EE3686',
  [OrderStatus.ДОСТАВЛЕН]: '#5EC4BA',
};

export const statusOptions: { value: OrderStatus; label: string; color: string }[] = Object.values(OrderStatus).map(status => ({
  value: status,
  label: status,
  color: statusColors[status],
}));

export type StatusOption = {
  value: OrderStatus;
  label: string;
  color: string;
};