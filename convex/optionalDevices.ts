export type OptionalDeviceId = "room_scheduling" | "whiteboard_camera" | "additional_connectivity";

export type OptionalDevice = {
  id: OptionalDeviceId;
  name: string;
  description: string;
  low?: number;
  high?: number;
  compatibility?: string;
};

export const optionalDevices: OptionalDevice[] = [
  {
    id: "room_scheduling",
    name: "Room scheduling device",
    description: "Shows availability outside the room.",
    low: 90_000,
    high: 120_000,
    compatibility: "Compatible with the recommended system.",
  },
  { id: "whiteboard_camera", name: "Whiteboard camera", description: "Shares a physical whiteboard with remote participants." },
  { id: "additional_connectivity", name: "Additional connectivity device", description: "Adds connection options beyond the recommended core system." },
];
