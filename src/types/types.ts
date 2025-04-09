import { DivIcon } from "leaflet";

export interface Place {
  name: string;
  coords: [number, number];
  imageLink?: string;
  type: "visited" | "planned" | "searched" | "clicked";
  icon: DivIcon;
}
