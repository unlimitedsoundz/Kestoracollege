/**
 * Utility to upload files to the Hostinger server via a PHP script.
 * Used for static exports where Supabase Storage/API routes are unavailable.
 */
export async function uploadToHosting(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
        // In development, Next.js dev server cannot handle POST to .php files
        // We use a internal API route for dev, and the PHP script for production (Hostinger)
        const endpoint = process.env.NODE_ENV === 'development' ? '/api/upload' : '/upload.php';

        const response = await fetch(endpoint, {
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
