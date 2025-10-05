import {GroupModel} from "entities/GroupModel";

export type UserModel = {
    id: number;
    username: string;
    groups: GroupModel[];
}