/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { verify } from './dto/verify.post.dto';
import { Comment } from './utils/comment.interface';
import { Exchange } from './utils/exchange.interface';
import { category } from './dto/category.post.dto';
export type PostDocument = Posts & Document;
export declare class Posts extends Model<Posts> {
    title: string;
    description: string;
    category: category;
    location: string;
    img: string;
    favorite: Array<string>;
    owner: object;
    price: number;
    verify: verify;
    isActive: boolean;
    views: number;
    comments: Comment[];
    toExchange: Exchange[];
}
export declare const PostSchema: import("mongoose").Schema<Posts, Model<Posts, any, any, any, import("mongoose").Document<unknown, any, Posts> & Posts & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Posts, import("mongoose").Document<unknown, {}, Posts> & Posts & {
    _id: import("mongoose").Types.ObjectId;
}>;
