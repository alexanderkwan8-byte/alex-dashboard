// Mock Supabase client for development/demo without real Supabase setup
// Replace with real Supabase client when you have credentials

interface MockSupabaseResponse<T> {
  data: T | null;
  error: any;
}

class MockSupabaseClient {
  private mockData = {
    tasks: [] as any[],
    agents: [] as any[],
    activity_log: [] as any[],
  };

  from(table: string) {
    return {
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: async (): Promise<MockSupabaseResponse<any>> => {
            const item = (this.mockData as any)[table].find((item: any) => item[column] === value);
            return { data: item || null, error: item ? null : { code: 'PGRST116' } };
          },
          then: async (resolve: any) => {
            const items = (this.mockData as any)[table].filter((item: any) => item[column] === value);
            return resolve({ data: items, error: null });
          }
        }),
        order: (column: string, opts?: any) => ({
          limit: (n: number) => ({
            then: async (resolve: any) => {
              const sorted = [...(this.mockData as any)[table]].sort((a, b) => {
                if (opts?.ascending) return a[column] > b[column] ? 1 : -1;
                return a[column] < b[column] ? 1 : -1;
              });
              return resolve({ data: sorted.slice(0, n), error: null });
            }
          }),
          then: async (resolve: any) => {
            const sorted = [...(this.mockData as any)[table]].sort((a, b) => {
              if (opts?.ascending) return a[column] > b[column] ? 1 : -1;
              return a[column] < b[column] ? 1 : -1;
            });
            return resolve({ data: sorted, error: null });
          }
        }),
        then: async (resolve: any) => resolve({ data: (this.mockData as any)[table], error: null })
      }),
      insert: (rows: any[]) => ({
        select: () => ({
          single: async (): Promise<MockSupabaseResponse<any>> => {
            (this.mockData as any)[table].push(rows[0]);
            return { data: rows[0], error: null };
          },
          then: async (resolve: any) => {
            (this.mockData as any)[table].push(...rows);
            return resolve({ data: rows, error: null });
          }
        }),
        then: async (resolve: any) => {
          (this.mockData as any)[table].push(...rows);
          return resolve({ data: rows, error: null });
        }
      }),
      update: (updates: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: async (): Promise<MockSupabaseResponse<any>> => {
              const item = (this.mockData as any)[table].find((item: any) => item[column] === value);
              if (item) Object.assign(item, updates);
              return { data: item || null, error: item ? null : { code: 'PGRST116' } };
            }
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (resolve: any) => {
            const idx = (this.mockData as any)[table].findIndex((item: any) => item[column] === value);
            if (idx !== -1) (this.mockData as any)[table].splice(idx, 1);
            return resolve({ data: null, error: null });
          }
        })
      })
    };
  }
}

// Use mock client for now - replace with real Supabase when ready:
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const supabase = new MockSupabaseClient() as any;
