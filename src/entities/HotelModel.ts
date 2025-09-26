import {CityModel} from "entities/CityModel";

export type HotelModel = {
    id: number;
    name: string;
    description: string;
    action: string;
    address: string;
    city: CityModel;
    officialRating: number;
    needsInspection: boolean;
    inspectionReason: string;
    lastInspection: number | null;
    secretGreetAvgTail: number; // Бл что это)
}
