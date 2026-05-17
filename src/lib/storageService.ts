import { supabase } from './supabase';

/**
 * Supabase Storage Service
 * Helper functions for file uploads and management
 */

export type BucketName =
  | 'delivery-proofs'
  | 'signatures'
  | 'invoices'
  | 'profile-images'
  | 'vehicle-images'
  | 'documents';

interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  bucket: BucketName,
  filePath: string,
  file: File | Blob
): Promise<UploadResult> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Upload delivery proof photo
 */
export async function uploadDeliveryProof(
  bookingId: string,
  photoFile: File
): Promise<UploadResult> {
  const fileName = `${Date.now()}.${photoFile.name.split('.').pop()}`;
  const filePath = `${bookingId}/${fileName}`;

  return uploadFile('delivery-proofs', filePath, photoFile);
}

/**
 * Upload customer signature
 */
export async function uploadSignature(
  bookingId: string,
  signatureBlob: Blob
): Promise<UploadResult> {
  const fileName = `signature_${Date.now()}.png`;
  const filePath = `${bookingId}/${fileName}`;

  return uploadFile('signatures', filePath, signatureBlob);
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(
  userId: string,
  imageFile: File
): Promise<UploadResult> {
  const fileName = `avatar_${Date.now()}.${imageFile.name.split('.').pop()}`;
  const filePath = `${userId}/${fileName}`;

  return uploadFile('profile-images', filePath, imageFile);
}

/**
 * Upload vehicle image
 */
export async function uploadVehicleImage(
  driverId: string,
  imageFile: File
): Promise<UploadResult> {
  const fileName = `vehicle_${Date.now()}.${imageFile.name.split('.').pop()}`;
  const filePath = `${driverId}/${fileName}`;

  return uploadFile('vehicle-images', filePath, imageFile);
}

/**
 * Upload invoice PDF
 */
export async function uploadInvoice(
  invoiceNumber: string,
  pdfBlob: Blob
): Promise<UploadResult> {
  const fileName = `${invoiceNumber}.pdf`;
  const filePath = `invoices/${fileName}`;

  return uploadFile('invoices', filePath, pdfBlob);
}

/**
 * Upload document
 */
export async function uploadDocument(
  category: string,
  file: File
): Promise<UploadResult> {
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `${category}/${fileName}`;

  return uploadFile('documents', filePath, file);
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: BucketName, filePath: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Download file from private bucket
 */
export async function downloadFile(
  bucket: BucketName,
  filePath: string
): Promise<Blob | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath);

    if (error) {
      console.error('Download error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Download failed:', error);
    return null;
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(
  bucket: BucketName,
  filePath: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
}

/**
 * List files in a folder
 */
export async function listFiles(
  bucket: BucketName,
  folder: string = ''
): Promise<any[]> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);

    if (error) {
      console.error('List error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('List failed:', error);
    return [];
  }
}

/**
 * Update booking with delivery proof URLs
 */
export async function saveDeliveryProof(
  bookingId: string,
  photoUrl: string,
  signatureUrl: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        delivery_photo_url: photoUrl,
        signature_url: signatureUrl
      })
      .eq('id', bookingId);

    if (error) {
      console.error('Save proof error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Save proof failed:', error);
    return false;
  }
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  maxSizeMB: number,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Compress image before upload
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          file.type,
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generate unique file name
 */
export function generateFileName(originalName: string, prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();

  return prefix
    ? `${prefix}_${timestamp}_${random}.${extension}`
    : `${timestamp}_${random}.${extension}`;
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  return !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Example usage in components:
 *
 * // Upload delivery proof
 * const result = await uploadDeliveryProof(bookingId, photoFile);
 * if (result.success) {
 *   console.log('Photo uploaded:', result.url);
 * }
 *
 * // Upload with validation
 * const validation = validateFile(file, 5, ['image/jpeg', 'image/png']);
 * if (validation.valid) {
 *   const compressed = await compressImage(file);
 *   const result = await uploadDeliveryProof(bookingId, compressed);
 * }
 *
 * // Download invoice
 * const pdfBlob = await downloadFile('invoices', 'invoices/INV-001.pdf');
 * if (pdfBlob) {
 *   const url = URL.createObjectURL(pdfBlob);
 *   window.open(url);
 * }
 */
