import { supabase } from "./supabase";

export default async function downloadImage(bucket: string, path: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) {
      throw error;
    }

    const fr = new FileReader();
    return new Promise((resolve, reject) => {
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = () => reject(new Error('Failed to read the file as a data URL'));
      fr.readAsDataURL(data);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error downloading image: ', error.message);
    }
    return null;
  }
}
