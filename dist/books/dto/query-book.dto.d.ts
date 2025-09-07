export declare enum SortDirection {
    ASC = "ASC",
    DESC = "DESC"
}
export declare enum SortField {
    TITLE = "title",
    AUTHOR = "author",
    PUBLISHER = "publisher",
    PRICE = "price",
    GENRE = "genre",
    CREATED_AT = "createdAt"
}
export declare class QueryBookDto {
    search?: string;
    genre?: string;
    publisher?: string;
    author?: string;
    availability?: boolean;
    sortBy?: SortField;
    sortDir?: SortDirection;
    page?: number;
    limit?: number;
}
