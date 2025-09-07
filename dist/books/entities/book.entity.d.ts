export declare class Book {
    id: string;
    title: string;
    author: string;
    publisher: string;
    price: number;
    availability: boolean;
    genre: string;
    imageUrl?: string;
    description?: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
