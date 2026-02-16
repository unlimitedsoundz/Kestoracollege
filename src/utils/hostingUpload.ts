/**
 * Utility to upload files to the Hostinger server via a PHP script.
 * Used for static exports where Supabase Storage/API routes are unavailable.
 */
export async function uploadToHosting(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
        // The upload.php script lives in /public, so it will be available at root /upload.php
        const response = await fetch('/upload.php', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.url) {
            return data.url;
        } else {
            throw new Error(data.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Hosting Upload Error:', error);
        throw error;
    }
}
