import { Injectable } from '@nestjs/common';
import { Bin, Item, Packer } from 'bin-packing-3d';
import { TruckLoadDto } from './dto/truck-load.dto';
import { getTruckDimensions } from './utils/truck-types';

const DEFAULT_PALLET_SIZE = { width: 48, height: 50, depth: 40 };
const DEFAULT_PALLET_WEIGHT = 40;

@Injectable()
export class TruckLoaderService {
  private createBin(
    id: number,
    width: number,
    height: number,
    depth: number,
  ): Bin {
    return new Bin(`Truck-${id + 1}`, width, height, depth, 10000);
  }

  private getItemsPerPallet(item: {
    width: number;
    height: number;
    depth: number;
  }): number {
    const fitW = Math.floor(DEFAULT_PALLET_SIZE.width / item.width);
    const fitH = Math.floor(DEFAULT_PALLET_SIZE.height / item.height);
    const fitD = Math.floor(DEFAULT_PALLET_SIZE.depth / item.depth);
    return Math.max(1, fitW * fitH * fitD);
  }

  private processPacking(
    items: Item[],
    width: number,
    height: number,
    depth: number,
  ) {
    const totalVolume = width * height * depth;
    const bins: Bin[] = [];
    let remaining = [...items];
    let truckId = 0;

    while (remaining.length > 0) {
      const bin = this.createBin(truckId++, width, height, depth);
      const packer = new Packer();
      packer.add_bin(bin);
      remaining.forEach((item) => packer.add_item(item));
      packer.pack();

      const packedNames = new Set(bin.items.map((i) => i.name));
      remaining = remaining.filter((i) => !packedNames.has(i.name));

      bins.push(bin);
    }

    return bins.map((bin) => {
      const usedVolume = bin.items.reduce(
        (sum, i) => sum + i.width * i.height * i.depth,
        0,
      );
      const totalWeight = bin.items.reduce(
        (sum, i) => sum + (i.weight || 0),
        0,
      );

      return {
        id: bin.name,
        containerDimensions: {
          width: bin.width,
          height: bin.height,
          depth: bin.depth,
        },
        totalVolume,
        usedVolume,
        wastedVolume: totalVolume - usedVolume,
        percentFull: Number(((usedVolume / totalVolume) * 100).toFixed(2)),
        totalItems: bin.items.length,
        totalWeight, // ✅ Nuevo campo
        packedItems: bin.items.map((i) => ({
          id: i.name,
          weight: i.weight,
          position: i.position,
          dimension: { w: i.width, h: i.height, d: i.depth },
        })),
        unfittedItems: bin.unfitted_items.map((i) => i.name),
      };
    });
  }

  packItems({ items, containerType }: TruckLoadDto) {
    const { width, height, depth } = getTruckDimensions(containerType);
    const allItems: Item[] = [];

    for (const {
      itemId,
      width: w,
      height: h,
      length: d,
      quantity,
      weight,
    } of items) {
      for (let i = 0; i < quantity; i++) {
        const item = new Item(`${itemId}-${i}`, w, h, d, 1);
        item.weight = weight; // ✅ guardar peso
        allItems.push(item);
      }
    }

    return this.processPacking(allItems, width, height, depth);
  }

  packPallets({ items, containerType }: TruckLoadDto) {
    const { width, height, depth } = getTruckDimensions(containerType);
    const pallets: Item[] = [];
    let palletIndex = 0;

    for (const {
      itemId,
      width: w,
      height: h,
      length: d,
      quantity,
      weight,
    } of items) {
      const perPallet = this.getItemsPerPallet({
        width: w,
        height: h,
        depth: d,
      });
      const palletCount = Math.ceil(quantity / perPallet);
      const weightPerItem = weight;

      for (let i = 0; i < palletCount; i++) {
        const itemsInThisPallet =
          i === palletCount - 1 ? quantity % perPallet || perPallet : perPallet;

        const totalPalletWeight =
          DEFAULT_PALLET_WEIGHT + itemsInThisPallet * weightPerItem;

        const pallet = new Item(
          `Pallet-${itemId}-${palletIndex++}`,
          DEFAULT_PALLET_SIZE.width,
          DEFAULT_PALLET_SIZE.height,
          DEFAULT_PALLET_SIZE.depth,
          1,
        );
        pallet.weight = totalPalletWeight;

        pallets.push(pallet);
      }
    }

    return this.processPacking(pallets, width, height, depth);
  }
}
