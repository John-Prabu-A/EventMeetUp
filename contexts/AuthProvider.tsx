import { Session } from '@supabase/supabase-js';
import { Redirect, useRouter } from 'expo-router';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';

import { supabase } from '~/utils/supabase';

type ProfileDataType = {
  fullName: string;
  username: string;
  website: string;
};

type AuthContextType = {
  session: Session | null;
  user: Session['user'] | null;
  isAuthenticated: boolean;
  profileUrl: string;
  ProfileData: ProfileDataType;
  setGlobalProfileURL: Dispatch<SetStateAction<string>>;
  setGlobalProfileData: Dispatch<
    SetStateAction<{ fullName: string; username: string; website: string }>
  >;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false,
  profileUrl: '',
  ProfileData: { fullName: '', username: '', website: '' },
  setGlobalProfileURL: () => {},
  setGlobalProfileData: () => {},
  logout: () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    website: '',
  });

  const colorScheme = useColorScheme();

  async function getProfile(session: any) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');
      console.log('Session : ', JSON.stringify(session, null, 2));

      const { data, error, status } = await supabase
        .from('profiles')
        .select('username, website, avatar_url, full_name')
        .eq('id', session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfileData({
          fullName: data.full_name || '',
          username: data.username || '',
          website: data.website || '',
        });
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      if (error instanceof Error) {
        // Toast.show({
        //   type: 'error',
        //   text1: 'Error',
        //   text2: error.message,
        //   visibilityTime: 2000,
        //   autoHide: true,
        // });
      }
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    supabase.auth.signOut().then((error) => {
      setLoading(false);
    });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      getProfile(session);
      setIsReady(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      getProfile(session);
    });
  }, []);

  useEffect(() => {
    getProfile(session);
  }, [session]);

  if (!isReady || loading) {
    return (
      <View
        className={`flex-1 items-center justify-center px-4 ${colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'}`}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        isAuthenticated: !!session?.user,
        profileUrl: avatarUrl,
        ProfileData: profileData,
        setGlobalProfileURL: setAvatarUrl,
        setGlobalProfileData: setProfileData,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
