import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import imageCompression from 'browser-image-compression';
import Image from 'next/image';

const supabase = createClientComponentClient()

interface AvatarProps {
  url: string;
  size: number;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>, filePath: string) => void;
}

export default function Avatar({ url, size, onUpload }: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image:');
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 500,
        useWebWorker: true,
        fileType: 'image/webp',
      };
      const compressedFile = await imageCompression(file, options);
      const fileBuffer = await compressedFile.arrayBuffer();
      const detectedMimeType = compressedFile.type;
      const originalFileName = compressedFile.name;
      const uniqueFileName = `${Date.now()}-${originalFileName}`;
      const storagePath = `avatars/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(storagePath, fileBuffer, {
          contentType: detectedMimeType,
          cacheControl: '3600',
        });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(event, storagePath);
    } catch (error) {
      alert(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}