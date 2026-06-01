// db.ts - No-op shim for backward compatibility during migration
// All database operations now use Supabase via src/lib/supabase.ts

const connectDb = async () => {
    // MongoDB replaced by Supabase - this function is a no-op
    return;
};

export default connectDb;