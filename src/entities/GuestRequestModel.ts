import {HotelInspectionRequestModel} from "entities/HotelInspectionRequestModel";

export type GuestRequestModel = {
    id: number;
    hotelInspectionRequest: HotelInspectionRequestModel;
    dateStart: number;
    dateFinish: number;
}
