'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import Avatar from './avatar';

export default function Profile() {
  const [profile, setProfile] = useState<User | { fullName: string } | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getSessionData = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
      } else {
        setProfile(data?.session?.user);

        if (data?.session?.user) {
          const { user } = data.session;

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, full_name, website, avatar_url, phone')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.warn(profileError);
          } else {
            if (profileData) {
              setProfile((prevProfile) => ({
                ...prevProfile,
                fullName: profileData.full_name,
                website: profileData.website,
                avatarUrl: profileData.avatar_url,
                username: profileData.username,
                userPhone: profileData.phone,
              }));
            }
          }
        }
      }

      setLoading(false);
    };

    getSessionData();
  }, []);

  if (loading) 
  return (
    <>
      <p>Loading...</p>
    </>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>



<div className="grid grid-cols-3 grid-rows-1 gap-4">
    <div>
    <Label>Correo Electronico</Label>
          <Input 
          value={profile?.email}
          disabled
          />

<Label>Website</Label>
          <Input 
          placeholder={profile?.website}
          />
    </div>
    <div >
    <Label>Username</Label>
          <Input 
          placeholder={profile && 'username' in profile && profile.username}
          
          />
    <Label>Telefono</Label>
          <Input 
          placeholder={profile && 'userPhone' in profile && profile.userPhone}
          
          />
          
    </div>
    <div >
    <Label>Nombre</Label>
          <Input 
          placeholder={profile && 'fullName' in profile && profile.fullName}
          />
    </div>
</div>
    

<Avatar
      url={profile.avatarUrl}
      size={150}
      onUpload={(event, url) => {
        updateProfile(event, url)
      }}
    />
          
          {/* {profile && 'avatarUrl' in profile && <p>Avatar URL: {profile.avatarUrl}</p>} */}

          <div className='flex justify-end mt-4'>
            <Button>
              Guardar
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}