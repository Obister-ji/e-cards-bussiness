import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface SimpleImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
}

const SimpleImageUpload: React.FC<SimpleImageUploadProps> = ({
  onImageUpload,
  currentImage,
  className = ""
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 File selected:', file.name, file.type, file.size);

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert to data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            resolve(result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      console.log('✅ File converted to data URL:', dataUrl.substring(0, 50) + '...');

      setPreviewUrl(dataUrl);
      onImageUpload(dataUrl);

      toast({
        title: "Upload Successful",
        description: "Image uploaded successfully!",
      });

    } catch (error) {
      console.error('❌ Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Image Removed",
      description: "Image has been removed.",
    });
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5" />
          <span>Upload Logo</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group
            ${isUploading
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 pointer-events-none'
              : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10'
            }
          `}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Logo preview"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300 shadow-md"
                />
                
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <p className="text-sm text-green-600 dark:text-green-400">
                ✅ Image uploaded successfully
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-blue-500"></div>
                ) : (
                  <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
                )}
              </div>

              <div>
                <p className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {isUploading ? 'Processing Image...' : 'Upload Your Logo'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">
                  Click here or drag and drop your image
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  JPG, PNG, GIF up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Supported formats: JPG, PNG, GIF • Max size: 5MB
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleImageUpload;
