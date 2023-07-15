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
import { UpdateUserDto } from 'src/users/dto/update.user.dto';
import { verify } from './dto/verify.post.dto';
import { CreateCommentDto } from './dto/create.comment.dto';
export type PostDocument = Posts & Document;
export declare class Posts extends Model<Posts> {
    title: string;
    description: string;
    category: string;
    img: string;
    favorite: Array<string>;
    owner: UpdateUserDto;
    price: number;
    verify: verify;
    views: number;
    comments: [CreateCommentDto];
    toExchange: [{
        data: string;
        agree: boolean;
    }];
}
export declare const PostSchema: import("mongoose").Schema<Posts, Model<Posts, any, any, any, import("mongoose").Document<unknown, any, Posts> & Omit<Posts & {
    _id: import("mongoose").Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Posts, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Posts>> & Omit<import("mongoose").FlatRecord<Posts> & {
    _id: import("mongoose").Types.ObjectId;
}, never>>;
