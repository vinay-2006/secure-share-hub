// File validation utilities for frontend

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export const ALLOWED_FILE_TYPES = {
  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  
  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  
  // Archives
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
  'application/x-tar': ['.tar'],
  'application/gzip': ['.gz'],
} as const;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file size
 */
export const validateFileSize = (file: File): FileValidationResult => {
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = Math.floor(MAX_FILE_SIZE / (1024 * 1024));
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${fileSizeMB}MB) exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }
  return { valid: true };
};

/**
 * Validates file type/MIME type
 */
export const validateFileType = (file: File): FileValidationResult => {
  const allowedTypes = Object.keys(ALLOWED_FILE_TYPES);
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed. Please upload images, documents, or archives.`,
    };
  }
  
  return { valid: true };
};

/**
 * Validates file extension
 */
export const validateFileExtension = (file: File): FileValidationResult => {
  const fileName = file.name.toLowerCase();
  const lastDotIndex = fileName.lastIndexOf('.');
  
  // Check if file has an extension
  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return {
      valid: false,
      error: 'File must have a valid extension.',
    };
  }
  
  const extension = fileName.substring(lastDotIndex);
  
  const allowedExtensions = Object.values(ALLOWED_FILE_TYPES).flat();
  
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension "${extension}" is not allowed.`,
    };
  }
  
  return { valid: true };
};

/**
 * Validates file name
 */
export const validateFileName = (file: File): FileValidationResult => {
  const fileName = file.name.trim(); // Trim leading/trailing whitespace
  
  // Check file name length
  if (fileName.length > 255) {
    return {
      valid: false,
      error: 'File name is too long (max 255 characters)',
    };
  }
  
  // Check if filename is empty after trimming
  if (fileName.length === 0) {
    return {
      valid: false,
      error: 'File name cannot be empty',
    };
  }
  
  // Check for special characters (allow letters, numbers, spaces, dots, hyphens, underscores)
  const invalidChars = /[^a-zA-Z0-9\s.\-_]/g;
  if (invalidChars.test(fileName)) {
    return {
      valid: false,
      error: 'File name contains invalid characters. Only letters, numbers, spaces, dots, hyphens, and underscores are allowed.',
    };
  }
  
  // Check for consecutive spaces
  if (/\s{2,}/.test(fileName)) {
    return {
      valid: false,
      error: 'File name contains consecutive spaces',
    };
  }
  
  return { valid: true };
};

/**
 * Validates a file against all validation rules
 */
export const validateFile = (file: File): FileValidationResult => {
  // Validate file name
  const nameValidation = validateFileName(file);
  if (!nameValidation.valid) return nameValidation;
  
  // Validate file size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) return sizeValidation;
  
  // Validate file type
  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) return typeValidation;
  
  // Validate file extension
  const extensionValidation = validateFileExtension(file);
  if (!extensionValidation.valid) return extensionValidation;
  
  return { valid: true };
};

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Gets file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
};

/**
 * Checks if file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Checks if file is a PDF
 */
export const isPDFFile = (file: File): boolean => {
  return file.type === 'application/pdf';
};

/**
 * Gets a user-friendly category for a file type
 */
export const getFileCategory = (file: File): string => {
  if (file.type.startsWith('image/')) return 'Image';
  if (file.type === 'application/pdf') return 'PDF';
  if (file.type.includes('word') || file.type.includes('document')) return 'Document';
  if (file.type.includes('sheet') || file.type.includes('excel')) return 'Spreadsheet';
  if (file.type.includes('presentation') || file.type.includes('powerpoint')) return 'Presentation';
  if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar') || file.type.includes('7z')) return 'Archive';
  if (file.type.startsWith('text/')) return 'Text';
  return 'File';
};
