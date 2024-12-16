import { Session } from '@supabase/supabase-js';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Tables } from '~/types/supabase';
import { supabase } from '~/utils/supabase';

type AuthData = {
  session: Session | null;
  profile: Tables<'profiles'> | null;
  loading: boolean;
  updateAuth: () => void;
  insertProfile: (userId: string, userEmail: string) => void;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  updateAuth: () => {},
  insertProfile: (userId: string, userEmail: string) => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionChanged, setIsSessionChanged] = useState(false);

  const updateAuth = () => {
    setIsSessionChanged((prev) => !prev);
  };

  const insertProfile = async (userId: string, userEmail: string) => {
    console.log('Inside insert : ', userId, userEmail);
    const { data: userData, error } = await supabase
      .from('profiles')
      .insert({ id: userId, created_at: new Date().toISOString(), username: userEmail })
      .select()
      .single();

    console.log('UserPofileInsertedData : ', userData);
    if (error) {
      console.error('Error creating User:', error.message);
    }
  };

  useEffect(() => {
    // console.log("session : ", session);
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        // fetch profile
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data || null);
      }
    };

    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    // console.log("session : ", session);
  }, [isSessionChanged]);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profile,
        updateAuth,
        insertProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
