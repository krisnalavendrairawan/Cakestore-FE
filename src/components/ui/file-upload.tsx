import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"

interface FileUploadProps {
  onChange: (file: File | null) => void;
  value?: string;
  error?: boolean;
}

export function FileUpload({ onChange, value, error }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onChange(null);
      setPreview(null);
    }
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <Input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className={`cursor-pointer ${error ? 'border-red-500' : ''}`}
      />
      {preview && (
        <div className="relative">
          <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}