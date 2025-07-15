export class ItemDto {
  itemId: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
  weight: number;
}

export class TruckLoadDto {
  containerType: string;
  usePalletDimensions: boolean;
  items: ItemDto[];
}
