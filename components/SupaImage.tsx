import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import downloadImage from '~/utils/DownloadImage';

type SupaImageProps = {
  path: string;
  className: string;
};

export default function SupaImage({ path, className }: SupaImageProps) {
  const [uri, setUri] = useState('');

  useEffect(() => {
    if (path) {
      downloadImage('avatars', path).then(data => setUri(String(data))).catch(error => console.error('Error downloading image: ', error.message));
    }
  }, [path]);

  if (!uri) {
    return <View className={`${className} bg-slate-200`} />;
  }

  return <Image source={{ uri }} className={className} />;
}
