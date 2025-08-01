import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PixelData {
  id: number;
  adopted: boolean;
  color: string;
  adopter: string;
  emoji: string;
  adopted_at?: string;
}

// Database operations
export const pixelOperations = {
  // Get all pixels
  async getAllPixels(): Promise<PixelData[]> {
    const { data, error } = await supabase
      .from('pixels')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching pixels:', error);
      return [];
    }
    
    return data || [];
  },

  // Adopt a pixel
  async adoptPixel(id: number, adopter: string, color: string, emoji: string): Promise<boolean> {
    const { error } = await supabase
      .from('pixels')
      .upsert({
        id,
        adopted: true,
        adopter,
        color,
        emoji,
        adopted_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error adopting pixel:', error);
      return false;
    }

    return true;
  },

  // Reset all pixels
  async resetAllPixels(): Promise<boolean> {
    const { error } = await supabase
      .from('pixels')
      .update({
        adopted: false,
        adopter: '',
        color: '#E5E7EB',
        emoji: '',
        adopted_at: null,
      })
      .neq('id', -1); // Update all rows

    if (error) {
      console.error('Error resetting pixels:', error);
      return false;
    }

    return true;
  },

  // Initialize pixels if they don't exist
  async initializePixels(totalPixels: number): Promise<boolean> {
    const existingPixels = await this.getAllPixels();
    
    if (existingPixels.length === totalPixels) {
      return true; // Already initialized
    }

    // Create all pixels
    const pixels = Array.from({ length: totalPixels }, (_, index) => ({
      id: index,
      adopted: false,
      color: '#E5E7EB',
      adopter: '',
      emoji: '',
    }));

    const { error } = await supabase
      .from('pixels')
      .upsert(pixels);

    if (error) {
      console.error('Error initializing pixels:', error);
      return false;
    }

    return true;
  },

  // Subscribe to pixel changes
  subscribeToPixelChanges(callback: (payload: any) => void) {
    return supabase
      .channel('pixels')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pixels' }, 
        callback
      )
      .subscribe();
  }
};