import {
    HydratedDocument,
    Model,
    Types,
} from "mongoose";

import {
    ContentStatus,
} from "@/enums";

import { ISeo } from "./seo.types";

export interface IPage {

    title:string;

    slug:string;

    excerpt?:string;

    content?:string;

    featuredImage?:Types.ObjectId | null;

    seo:ISeo;

    status:ContentStatus;

    isHomePage:boolean;

    template:string;

    author:Types.ObjectId;

    publishedAt?:Date | null;

    createdBy?:Types.ObjectId | null;

    updatedBy?:Types.ObjectId | null;

    isDeleted:boolean;

    deletedAt?:Date | null;

}

export type PageMethods = Record<never, never>;

export interface PageStatics{

    findBySlug(slug:string):Promise<PageDocument | null>;

    findPublished():Promise<PageDocument[]>;

    getHomePage():Promise<PageDocument | null>;

}

export type PageDocument =
HydratedDocument<IPage,PageMethods>;

export type PageModel =
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Mongoose uses an empty query-helper type here.
Model<IPage,{},PageMethods> &
PageStatics;
