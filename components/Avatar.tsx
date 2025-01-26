import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { View, Image, Pressable, ActivityIndicator } from 'react-native';
import { supabase } from '~/utils/supabase';
import Toast from 'react-native-toast-message';

type Props = {
  size?: number;
  url: string | null;
  onUpload: (filePath: string) => void;
  type: 'profile' | 'event';
};

export default function Avatar({ url, size = 150, onUpload, type = 'profile' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);

  const avatarSize = { height: size, width: size };
  const defaultImages = {
    profile: require('~/assets/defaultProfilePic.png'),
    event: require('~/assets/defaultEventPic.jpeg'),
  };

  useEffect(() => {
    if (url) {
      downloadImage(url);
    } else {
      setAvatarUrl(null);
    }
  }, [url]);

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) throw error;

      const fileReader = new FileReader();
      fileReader.onload = () => setAvatarUrl(fileReader.result as string);
      fileReader.readAsDataURL(data);
    } catch (error) {
      console.error('Error downloading image:', error);
      setAvatarUrl(null);
    }
  };

  const uploadAvatar = async () => {
    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'Upload cancelled',
          text2: 'No image was selected.',
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 20,
        });
        return;
      }

      const image = result.assets[0];
      if (!image.uri) throw new Error('Invalid image URI.');

      const fileExt = image.uri.split('.').pop() || 'jpeg';
      const filePath = `${Date.now()}.${fileExt}`;
      const fileData = await fetch(image.uri).then((res) => res.arrayBuffer());

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, fileData, { contentType: image.type || 'image/jpeg' });

      if (error) throw error;
      setAvatarUrl(image.uri);
      onUpload(data.path);
      Toast.show({
        type: 'success',
        text1: 'Upload successful',
        text2: 'Your image has been uploaded.',
        visibilityTime: 2000,
        autoHide: true,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: error instanceof Error ? error.message : 'Unknown error occurred.',
        visibilityTime: 2000,
        autoHide: true,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Pressable onPress={uploadAvatar} disabled={uploading} className="relative my-4 self-center">
      <View
        style={{ ...avatarSize }}
        className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 border border-[#666] dark:bg-[#333]">
        {uploading ? (
          <ActivityIndicator size="large" color="#FF4500" className="self-center" />
        ) : (
          <Image
            source={avatarUrl ? { uri: avatarUrl } : defaultImages[type]}
            style={{ ...avatarSize }}
            className="h-full w-full object-cover"
            accessibilityLabel={`User's ${type === 'profile' ? 'profile' : 'event'} avatar`}
          />
        )}
      </View>

      {!uploading && (
        <FontAwesome
          name="pencil-square-o"
          size={24}
          color="#FF4500"
          style={{
            position: 'absolute',
            bottom: 5,
            right: 5,
            backgroundColor: '#FFF',
            borderRadius: 12,
            padding: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        />
      )}
    </Pressable>
  );
}
