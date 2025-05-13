import {createClient} from "@supabase/supabase-js";
import {Database} from "@/lib/database.types";


export const AdminClient = () =>
    createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            },
            db: {
                schema: 'public',
            },
        }
    );