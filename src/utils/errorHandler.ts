/**
 * Centralized Error Handling Utility
 * Replaces 150+ lines of duplicate error handling code
 */

import { toast } from 'sonner';

interface FormData {
  [key: string]: any;
}

/**
 * Check if error is a database-related error
 */
function isDatabaseError(error: any): boolean {
  return (
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('relation') ||
    error?.message?.includes('does not exist') ||
    error?.code === 'PGRST116' ||
    error?.code === '42P01'
  );
}

/**
 * Handle form submission errors with toast notifications
 * @param error - The error object from try/catch
 * @param context - Context about what was being submitted (e.g., "quote request", "contact form")
 * @param formData - Optional form data to show in fallback
 */
export function handleFormError(error: any, context: string = 'form', formData?: FormData) {
  console.error(`Error submitting ${context}:`, error);

  if (isDatabaseError(error)) {
    toast.error('Database Configuration Required', {
      description: 'The backend database is not fully set up. Please contact support.',
      duration: 5000
    });
  } else if (error?.message?.includes('Network')) {
    toast.error('Network Error', {
      description: 'Please check your internet connection and try again.',
      duration: 4000
    });
  } else if (error?.message?.includes('timeout')) {
    toast.error('Request Timeout', {
      description: 'The request took too long. Please try again.',
      duration: 4000
    });
  } else {
    toast.error('Submission Failed', {
      description: error?.message || 'An unexpected error occurred. Please try again.',
      duration: 4000
    });
  }
}

/**
 * Handle successful form submissions
 */
export function handleFormSuccess(context: string, message?: string) {
  toast.success('Success!', {
    description: message || `Your ${context} has been submitted successfully.`,
    duration: 4000
  });
}

/**
 * Show loading toast
 */
export function showLoadingToast(message: string = 'Processing...') {
  return toast.loading(message);
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

/**
 * Handle authentication errors
 */
export function handleAuthError(error: any) {
  console.error('Auth error:', error);

  if (error?.message?.includes('Invalid login credentials')) {
    toast.error('Invalid Credentials', {
      description: 'Email or password is incorrect. Please try again.',
      duration: 4000
    });
  } else if (error?.message?.includes('Email not confirmed')) {
    toast.error('Email Not Confirmed', {
      description: 'Please check your email and confirm your account.',
      duration: 5000
    });
  } else if (isDatabaseError(error)) {
    toast.error('Database Error', {
      description: 'Unable to connect to the database. Please contact support.',
      duration: 5000
    });
  } else {
    toast.error('Authentication Failed', {
      description: error?.message || 'An error occurred during login.',
      duration: 4000
    });
  }
}

/**
 * Show info message
 */
export function showInfo(title: string, description?: string) {
  toast.info(title, {
    description,
    duration: 4000
  });
}

/**
 * Show warning message
 */
export function showWarning(title: string, description?: string) {
  toast.warning(title, {
    description,
    duration: 4000
  });
}
