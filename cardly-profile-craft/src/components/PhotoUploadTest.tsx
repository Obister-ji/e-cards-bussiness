import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedProfileUpload from './AnimatedProfileUpload';
import SimpleImageUpload from './SimpleImageUpload';
import { useToast } from '@/hooks/use-toast';

const PhotoUploadTest: React.FC = () => {
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isAnimated, setIsAnimated] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const handleImageUpload = (imageUrl: string, animated?: boolean) => {
    console.log('📸 Image uploaded:', { imageUrl: imageUrl.substring(0, 50) + '...', animated });

    setUploadedImage(imageUrl);
    setIsAnimated(animated || false);

    const result = `✅ Upload successful: ${animated ? 'Animated' : 'Static'} image (${imageUrl.length} chars)`;
    setTestResults(prev => [...prev, result]);

    toast({
      title: "Upload Test Successful",
      description: `Image uploaded successfully! ${animated ? 'Animated GIF' : 'Static image'}`,
    });
  };

  const testFileUpload = () => {
    // Create a test file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const result = `📁 File selected: ${file.name} (${file.size} bytes, ${file.type})`;
        setTestResults(prev => [...prev, result]);

        // Test file reading
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            handleImageUpload(dataUrl, file.type === 'image/gif');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const clearResults = () => {
    setTestResults([]);
    setUploadedImage('');
    setIsAnimated(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📸 Photo Upload Test Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Test Methods:</h3>

              <Button onClick={testFileUpload} className="w-full">
                Test File Upload (Direct)
              </Button>

              <Button onClick={clearResults} variant="outline" className="w-full">
                Clear Results
              </Button>

              <div className="space-y-2">
                <Label>Upload Status:</Label>
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {uploadedImage ? (
                    <div className="space-y-2">
                      <div className="text-green-600 font-medium">✅ Image Uploaded Successfully</div>
                      <div className="text-sm">
                        Type: {isAnimated ? 'Animated GIF' : 'Static Image'}
                      </div>
                      <div className="text-sm">
                        Size: {uploadedImage.length} characters
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No image uploaded yet</div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Image Preview:</h3>
              {uploadedImage ? (
                <div className="space-y-2">
                  <img
                    src={uploadedImage}
                    alt="Uploaded preview"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300"
                  />
                  <div className="text-sm text-gray-600">
                    {isAnimated && '🎬 Animated GIF'}
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No Preview</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧪 SimpleImageUpload Component Test</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleImageUpload
            onImageUpload={(imageUrl) => handleImageUpload(imageUrl, false)}
            currentImage={uploadedImage}
            className="max-w-2xl mx-auto"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧪 AnimatedProfileUpload Component Test</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedProfileUpload
            onImageUpload={handleImageUpload}
            currentImage={uploadedImage}
            className="max-w-2xl mx-auto"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📋 Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {testResults.length > 0 ? (
              testResults.map((result, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm font-mono"
                >
                  {result}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                No test results yet. Try uploading an image!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ℹ️ Test Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div><strong>1. Test Direct Upload:</strong> Click "Test File Upload" to select and upload a file directly</div>
            <div><strong>2. Test Component Upload:</strong> Use the AnimatedProfileUpload component above</div>
            <div><strong>3. Test Different Formats:</strong> Try JPEG, PNG, and GIF files</div>
            <div><strong>4. Test Large Files:</strong> Try files close to the 5MB limit</div>
            <div><strong>5. Test Drag & Drop:</strong> Drag files onto the upload area</div>
            <div><strong>6. Check Console:</strong> Open browser console for detailed logs</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoUploadTest;
