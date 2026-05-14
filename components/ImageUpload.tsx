import { useState, useRef } from 'react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  existingImage?: string;
}

export default function ImageUpload({ onUpload, existingImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB');
      return;
    }

    // 显示预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 上传文件
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        onUpload(data.url);
      } else {
        alert(data.error || '上传失败');
      }
    } catch (err) {
      console.error('上传失败:', err);
      alert('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-stone-100">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleClick}
            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">
              {uploading ? '上传中...' : '更换'}
            </span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={uploading}
          className="w-32 h-32 rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center hover:border-brand-orange transition-colors"
        >
          <span className="text-2xl mb-2">📷</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-stone">
            {uploading ? '上传中...' : '上传照片'}
          </span>
        </button>
      )}
    </div>
  );
}
