import { supabase } from './supabase';

// Supabase Storage Bucket Names
export const STORAGE_BUCKETS = {
  PROFILE_IMAGES: 'profile-images',
  DOCUMENTS: 'documents',
  SHIPMENT_PHOTOS: 'shipment-photos',
  VEHICLE_PHOTOS: 'vehicle-photos',
  INVOICES: 'invoices',
};

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param file - The file to upload
 * @param path - Optional path within the bucket (e.g., 'users/123/')
 * @returns Object with public URL and file path
 */
export async function uploadFile(
  bucket: string,
  file: File,
  path: string = ''
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload profile image for a user
 * @param userId - The user ID
 * @param file - The image file
 * @returns Object with public URL
 */
export async function uploadProfileImage(
  userId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadFile(STORAGE_BUCKETS.PROFILE_IMAGES, file, `${userId}/`);
}

/**
 * Upload document (license, ID, etc.)
 * @param userId - The user ID
 * @param file - The document file
 * @param documentType - Type of document (e.g., 'license', 'id_proof')
 * @returns Object with public URL
 */
export async function uploadDocument(
  userId: string,
  file: File,
  documentType: string
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
  return uploadFile(STORAGE_BUCKETS.DOCUMENTS, file, `${userId}/${documentType}/`);
}

/**
 * Upload shipment photo
 * @param bookingId - The booking ID
 * @param file - The photo file
 * @returns Object with public URL
 */
export async function uploadShipmentPhoto(
  bookingId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadFile(STORAGE_BUCKETS.SHIPMENT_PHOTOS, file, `${bookingId}/`);
}

/**
 * Upload vehicle photo
 * @param driverId - The driver ID
 * @param file - The photo file
 * @returns Object with public URL
 */
export async function uploadVehiclePhoto(
  driverId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadFile(STORAGE_BUCKETS.VEHICLE_PHOTOS, file, `${driverId}/`);
}

/**
 * Upload invoice PDF
 * @param invoiceNumber - The invoice number
 * @param file - The PDF file
 * @returns Object with public URL
 */
export async function uploadInvoice(
  invoiceNumber: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadFile(STORAGE_BUCKETS.INVOICES, file, `${invoiceNumber}/`);
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param filePath - The path to the file
 * @returns Success status
 */
export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get public URL for a file
 * @param bucket - The storage bucket name
 * @param filePath - The path to the file
 * @returns Public URL
 */
export function getPublicUrl(bucket: string, filePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * List files in a bucket path
 * @param bucket - The storage bucket name
 * @param path - The path to list files from
 * @returns List of files
 */
export async function listFiles(
  bucket: string,
  path: string = ''
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(path);

    if (error) {
      console.error('List error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      files: data,
    };
  } catch (error) {
    console.error('List error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a signed URL for private file access
 * @param bucket - The storage bucket name
 * @param filePath - The path to the file
 * @param expiresIn - Expiration time in seconds (default: 3600)
 * @returns Signed URL
 */
export async function createSignedUrl(
  bucket: string,
  filePath: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('Signed URL error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      url: data.signedUrl,
    };
  } catch (error) {
    console.error('Signed URL error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update user profile image
 * @param userId - The user ID
 * @param file - The new image file
 * @param oldPath - Optional old image path to delete
 * @returns Object with public URL
 */
export async function updateProfileImage(
  userId: string,
  file: File,
  oldPath?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  // Delete old image if exists
  if (oldPath) {
    await deleteFile(STORAGE_BUCKETS.PROFILE_IMAGES, oldPath);
  }

  // Upload new image
  return uploadProfileImage(userId, file);
}

/**
 * Validate file type
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns Validation result
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB
 * @returns Validation result
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Common file type validators
 */
export const FILE_VALIDATORS = {
  IMAGE: {
    types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 5, // MB
  },
  DOCUMENT: {
    types: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSize: 10, // MB
  },
  PDF: {
    types: ['application/pdf'],
    maxSize: 10, // MB
  },
};

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!validateFileType(file, FILE_VALIDATORS.IMAGE.types)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)',
    };
  }

  if (!validateFileSize(file, FILE_VALIDATORS.IMAGE.maxSize)) {
    return {
      valid: false,
      error: `Image size must be less than ${FILE_VALIDATORS.IMAGE.maxSize}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate document file
 */
export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  if (!validateFileType(file, FILE_VALIDATORS.DOCUMENT.types)) {
    return {
      valid: false,
      error: 'Please upload a valid document (PDF, JPEG, or PNG)',
    };
  }

  if (!validateFileSize(file, FILE_VALIDATORS.DOCUMENT.maxSize)) {
    return {
      valid: false,
      error: `Document size must be less than ${FILE_VALIDATORS.DOCUMENT.maxSize}MB`,
    };
  }

  return { valid: true };
}
