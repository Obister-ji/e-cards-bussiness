import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, CheckCircle, AlertCircle, Image, Play, Pause } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface AnimatedProfileUploadProps {
  onImageUpload: (imageUrl: string, isAnimated: boolean) => void;
  currentImage?: string;
  className?: string;
}

interface FileValidation {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

const AnimatedProfileUpload: React.FC<AnimatedProfileUploadProps> = ({
  onImageUpload,
  currentImage,
  className = ""
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const [isAnimated, setIsAnimated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
    type: string;
    dimensions?: string;
  } | null>(null);

  const validateFile = (file: File): FileValidation => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/jpg'];
    const warnings: string[] = [];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please upload a GIF, PNG, or JPG/JPEG file.'
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 5MB. Please compress your image.'
      };
    }

    // Add warnings for optimization
    if (file.size > 2 * 1024 * 1024) {
      warnings.push('Large file size may affect loading speed. Consider optimizing.');
    }

    if (file.type === 'image/gif') {
      warnings.push('Ensure your GIF loops smoothly and is 2-4 seconds long.');
    }

    return {
      isValid: true,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file: File) => {
    const validation = validateFile(file);

    if (!validation.isValid) {
      toast({
        title: "Upload Failed",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    if (validation.warnings) {
      validation.warnings.forEach(warning => {
        toast({
          title: "Upload Warning",
          description: warning,
          variant: "default",
        });
      });
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get image dimensions
      const dimensions = await getImageDimensions(file);

      // Convert file to data URL for storage
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            resolve(e.target.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      // Set preview URL
      setPreviewUrl(dataUrl);

      // Determine if animated
      const animated = file.type === 'image/gif';
      setIsAnimated(animated);
      setIsPlaying(true);

      // Set file info
      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type.split('/')[1].toUpperCase(),
        dimensions: `${dimensions.width} × ${dimensions.height}px`
      });

      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsUploading(false);
            onImageUpload(dataUrl, animated);

            toast({
              title: "Upload Successful",
              description: `${animated ? 'Animated' : 'Static'} profile picture uploaded successfully!`,
            });

            return 100;
          }
          return prev + 20; // Faster progress since it's local
        });
      }, 50); // Faster interval

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      console.error('File processing error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreviewUrl('');
    setFileInfo(null);
    setIsAnimated(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Notify parent component that image was removed
    onImageUpload('', false);

    toast({
      title: "Image Removed",
      description: "Profile picture has been removed.",
    });
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            🌀
          </div>
          <span>Animated Profile Picture Upload</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Specifications */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2 text-sm">
              <div><strong>Recommended:</strong> 500×500px, Max 5MB</div>
              <div><strong>Formats:</strong> GIF (animated), PNG (transparency), JPG (static)</div>
              <div><strong>Animation:</strong> 2-4 seconds, 10-15 FPS, gentle movements</div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/gif,image/png,image/jpeg,image/jpg"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  style={{
                    animationPlayState: isAnimated && isPlaying ? 'running' : 'paused'
                  }}
                />

                {isAnimated && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAnimation();
                    }}
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {fileInfo && (
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{fileInfo.name}</span>
                  </div>
                  <div>{fileInfo.type} • {fileInfo.size} • {fileInfo.dimensions}</div>
                  {isAnimated && <div className="text-purple-600 dark:text-purple-400">✨ Animated GIF</div>}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Upload Your Profile Picture
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Drag and drop your file here, or click to browse
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Quality Tips */}
        <Alert>
          <Image className="h-4 w-4" />
          <AlertDescription>
            <div className="text-sm">
              <strong>Quality Tips:</strong> Ensure animations enhance your professional image,
              test on both light and dark backgrounds, and keep facial features clearly visible.
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AnimatedProfileUpload;
