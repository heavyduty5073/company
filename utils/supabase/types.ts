import {Database} from "@/lib/database.types";

export type Posts = Database['public']['Tables']['posts']['Row'];

export interface States<T=unknown> {
    success: boolean;
    data: T | null;
    error: string | null;
}