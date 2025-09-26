import {UserModel} from "entities/UserModel";
import {ProfileStatusModel} from "entities/ProfileStatusModel";
import {CityModel} from "entities/CityModel";

export type ProfileModel = {
    id: number;
    user: UserModel;
    firstName: string;
    lastName: string;
    patronymic: string;
    phone: string;
    city: CityModel;
    travelInterests: string;
    tgId: string;
    status: ProfileStatusModel;
    rating: number;
}
