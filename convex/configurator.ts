export type RoomMode = "native" | "byod";
export type RoomTier = "small" | "medium" | "large";

export type BomItem = {
  name: string;
  category: string;
  quantity: number;
  unitLow: number;
  unitHigh: number;
  low: number;
  high: number;
};

export type RoomConfiguration = {
  tier: RoomTier;
  areaSqFt: number;
  displaySizeInches: number;
  items: BomItem[];
  totalLow: number;
  totalHigh: number;
};

type ItemInput = Omit<BomItem, "low" | "high">;

function item(input: ItemInput): BomItem {
  return {
    ...input,
    low: input.quantity * input.unitLow,
    high: input.quantity * input.unitHigh,
  };
}

function roomTier(areaSqFt: number, seats: number): RoomTier {
  if (areaSqFt <= 180 && seats <= 6) return "small";
  if (areaSqFt <= 350 && seats <= 14) return "medium";
  return "large";
}

export function presentationDisplaySize(lengthFt: number): number {
  const verticalImageHeightInches = (lengthFt * 12) / 6;
  const diagonalRatioForSixteenByTen = Math.sqrt(16 ** 2 + 10 ** 2) / 10;
  return Math.ceil((verticalImageHeightInches * diagonalRatioForSixteenByTen) / 5) * 5;
}

function displayItem(displaySizeInches: number, quantity = 1): BomItem {
  const [unitLow, unitHigh] = displaySizeInches <= 55
    ? [45_000, 80_000]
    : displaySizeInches <= 65
      ? [70_000, 130_000]
      : displaySizeInches <= 85
        ? [120_000, 220_000]
        : displaySizeInches <= 120
          ? [200_000, 400_000]
          : [450_000, 900_000];
  return item({ name: `${displaySizeInches}-inch commercial display`, category: "Display", quantity, unitLow, unitHigh });
}

function smallRoom(mode: RoomMode, displaySizeInches: number): BomItem[] {
  const common = [displayItem(displaySizeInches)];

  if (mode === "byod") {
    return [
      ...common,
      item({ name: "USB video bar", category: "Video", quantity: 1, unitLow: 75_000, unitHigh: 160_000 }),
      item({ name: "USB-C conferencing dock", category: "Connectivity", quantity: 1, unitLow: 20_000, unitHigh: 45_000 }),
      item({ name: "Mounting, cabling and installation kit", category: "Infrastructure", quantity: 1, unitLow: 15_000, unitHigh: 35_000 }),
    ];
  }

  return [
    ...common,
    item({ name: "Native room compute and camera kit", category: "Video", quantity: 1, unitLow: 160_000, unitHigh: 320_000 }),
    item({ name: "Touch room controller", category: "Control", quantity: 1, unitLow: 45_000, unitHigh: 90_000 }),
    item({ name: "Mounting, cabling and installation kit", category: "Infrastructure", quantity: 1, unitLow: 20_000, unitHigh: 45_000 }),
  ];
}

function mediumRoom(mode: RoomMode, displaySizeInches: number, longestSideFt: number): BomItem[] {
  const common = [displayItem(displaySizeInches)];
  const needsExpansionMicrophone = longestSideFt > 20;

  if (mode === "byod") {
    return [
      ...common,
      item(needsExpansionMicrophone
        ? { name: "USB video bar with expansion microphone", category: "Video", quantity: 1, unitLow: 150_000, unitHigh: 300_000 }
        : { name: "USB video bar", category: "Video", quantity: 1, unitLow: 75_000, unitHigh: 160_000 }),
      item({ name: "USB-C conferencing dock", category: "Connectivity", quantity: 1, unitLow: 25_000, unitHigh: 55_000 }),
      item({ name: "Mounting, cabling and installation kit", category: "Infrastructure", quantity: 1, unitLow: 30_000, unitHigh: 75_000 }),
    ];
  }

  return [
    ...common,
    item({ name: "Native room compute and camera kit", category: "Video", quantity: 1, unitLow: 250_000, unitHigh: 500_000 }),
    item({ name: "Touch room controller", category: "Control", quantity: 1, unitLow: 45_000, unitHigh: 90_000 }),
    ...(needsExpansionMicrophone ? [item({ name: "Expansion microphone", category: "Audio", quantity: 1, unitLow: 30_000, unitHigh: 70_000 })] : []),
    item({ name: "Mounting, cabling and installation kit", category: "Infrastructure", quantity: 1, unitLow: 30_000, unitHigh: 75_000 }),
  ];
}

function largeRoom(mode: RoomMode, seats: number, displaySizeInches: number): BomItem[] {
  return [
    displayItem(displaySizeInches, 2),
    item({
      name: mode === "native" ? "Native room compute" : "BYOD conferencing interface",
      category: "Compute",
      quantity: 1,
      unitLow: mode === "native" ? 180_000 : 45_000,
      unitHigh: mode === "native" ? 350_000 : 100_000,
    }),
    item({ name: "PTZ conference camera", category: "Video", quantity: 1, unitLow: 160_000, unitHigh: 350_000 }),
    ...(mode === "native"
      ? [item({ name: "Touch room controller", category: "Control", quantity: 1, unitLow: 45_000, unitHigh: 90_000 })]
      : []),
    item({ name: "Audio DSP", category: "Audio", quantity: 1, unitLow: 180_000, unitHigh: 400_000 }),
    item({ name: "Ceiling microphone array", category: "Audio", quantity: Math.ceil(seats / 12), unitLow: 120_000, unitHigh: 280_000 }),
    item({ name: "Installed loudspeaker", category: "Audio", quantity: 4, unitLow: 20_000, unitHigh: 50_000 }),
    item({ name: "Mounting, cabling and installation kit", category: "Infrastructure", quantity: 1, unitLow: 60_000, unitHigh: 150_000 }),
  ];
}

export function configureRoom({
  lengthFt,
  widthFt,
  seats,
  mode,
}: {
  lengthFt: number;
  widthFt: number;
  seats: number;
  mode: RoomMode;
}): RoomConfiguration {
  const areaSqFt = lengthFt * widthFt;
  const tier = roomTier(areaSqFt, seats);
  const displaySizeInches = presentationDisplaySize(lengthFt);
  const items = tier === "small" ? smallRoom(mode, displaySizeInches) : tier === "medium" ? mediumRoom(mode, displaySizeInches, Math.max(lengthFt, widthFt)) : largeRoom(mode, seats, displaySizeInches);

  return {
    tier,
    areaSqFt,
    displaySizeInches,
    items,
    totalLow: items.reduce((total, current) => total + current.low, 0),
    totalHigh: items.reduce((total, current) => total + current.high, 0),
  };
}
