import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { m4aToAudioProfile, validateM4aFile, AudioProfile } from '@/utils/audioConverter';

export function M4aUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<AudioProfile | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validation = validateM4aFile(selectedFile);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setProcessing(true);
    try {
      const profile = await m4aToAudioProfile(file);
      setResult(profile);
      toast.success('Audio analysis complete!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process audio');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>M4A Audio Analyzer</CardTitle>
        <CardDescription>
          Upload an m4a audio file for vectorization analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="file"
            accept=".m4a,audio/mp4,audio/x-m4a"
            onChange={handleFileChange}
            disabled={processing}
          />
          <Button
            onClick={handleUpload}
            disabled={!file || processing}
            className="shrink-0"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>

        {file && !processing && !result && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}

        {result && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <h3 className="font-semibold">Analysis Result</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Sample Rate:</span>{' '}
                <span className="font-mono">{result.sr} Hz</span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>{' '}
                <span className="font-mono">{result.duration_sec.toFixed(2)}s</span>
              </div>
              <div>
                <span className="text-muted-foreground">RMS:</span>{' '}
                <span className="font-mono">{result.rms.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ZCR:</span>{' '}
                <span className="font-mono">{result.zcr.toFixed(6)}</span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Spectral Features (64 bins):</span>
              <div className="mt-2 max-h-32 overflow-y-auto rounded bg-background p-2 font-mono text-xs">
                {JSON.stringify(result.spec64_logmag.map(v => v.toFixed(4)), null, 2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
