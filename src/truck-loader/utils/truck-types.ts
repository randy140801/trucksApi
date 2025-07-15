export const TRUCK_TYPES = {
  TRUCK_53FT: {
    type: 'TRUCK_53FT',
    label: '53 ft Dry Van Trailer',
    width: 100,
    height: 110,
    depth: 631,
  },
  CONTAINER_40HC: {
    type: 'CONTAINER_40HC',
    label: '40 ft High Cube Container',
    width: 92,
    height: 106,
    depth: 474,
  },
};

export const getContainerOptions = () =>
  Object.values(TRUCK_TYPES).map(({ type, label }) => ({ type, label }));

export function getTruckDimensions(type: string) {
  const truck = (Object.values(TRUCK_TYPES) as any).find(
    (t) => t.type === type,
  );
  if (!truck) throw new Error(`Unknown containerType: ${type}`);
  return { width: truck.width, height: truck.height, depth: truck.depth };
}
