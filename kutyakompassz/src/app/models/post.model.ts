export interface Post {
    id?: number;
    title: string;
    date?: string;
    description: string;
    location: string;
    images: string[];
    type: string;
    userId?: string;
}