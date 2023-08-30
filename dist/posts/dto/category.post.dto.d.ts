interface categoryList {
    [key: string]: string;
}
declare const categoryList: Record<string, string>;
export declare const categoriesArray: string[];
export declare class CategoryPostDto {
    readonly category: categoryList;
}
export {};
