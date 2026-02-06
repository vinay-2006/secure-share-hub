// File validation constants and utilities

export const MAX_FILE_SIZE = 52428800; // 50MB in bytes
export const MAX_FILE_SIZE_MB = 50;

// Allowed file types with their MIME types
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
  'text/markdown': ['.md'],
  
  // Archives
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
  'application/x-tar': ['.tar'],
  'application/gzip': ['.gz'],
  
  // Code files
  'application/json': ['.json'],
  'application/xml': ['.xml'],
  'text/html': ['.html'],
  'text/css': ['.css'],
  'text/javascript': ['.js'],
  'application/javascript': ['.js'],
  
  // Audio
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  
  // Video
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogv'],
};

// Dangerous file extensions that should be blocked
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', 
  '.vbs', '.vbe', '.js', '.jse', '.wsf', '.wsh',
  '.msi', '.dll', '.app', '.deb', '.dmg', '.pkg'
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Validate file type based on MIME type and extension
 */
export function validateFileType(file: File): FileValidationResult {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  // Check for dangerous extensions
  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File type ${extension} is not allowed for security reasons`,
    };
  }
  
  // Check if MIME type is in allowed list
  const allowedExtensions = ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];
  if (!allowedExtensions) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported`,
    };
  }
  
  // Verify extension matches MIME type
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension ${extension} does not match the detected file type`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate file size
 */
export function validateFileSize(file: File): FileValidationResult {
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE_MB}MB`,
    };
  }
  
  const warnings: string[] = [];
  
  // Warn for very large files (over 20MB)
  if (file.size > 20971520) {
    warnings.push('Large file size may take longer to upload');
  }
  
  return { valid: true, warnings: warnings.length > 0 ? warnings : undefined };
}

/**
 * Validate file name
 */
export function validateFileName(file: File): FileValidationResult {
  const fileName = file.name;
  
  // Check file name length
  if (fileName.length === 0) {
    return {
      valid: false,
      error: 'File name is empty',
    };
  }
  
  if (fileName.length > 255) {
    return {
      valid: false,
      error: 'File name is too long (max 255 characters)',
    };
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"|?*\x00-\x1f]/g;
  if (invalidChars.test(fileName)) {
    return {
      valid: false,
      error: 'File name contains invalid characters',
    };
  }
  
  // Check for reserved names (Windows)
  const reservedNames = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\.|$)/i;
  if (reservedNames.test(fileName)) {
    return {
      valid: false,
      error: 'File name is reserved by the system',
    };
  }
  
  return { valid: true };
}

/**
 * Comprehensive file validation
 */
export function validateFile(file: File): FileValidationResult {
  // Validate file name
  const nameValidation = validateFileName(file);
  if (!nameValidation.valid) {
    return nameValidation;
  }
  
  // Validate file type
  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) {
    return typeValidation;
  }
  
  // Validate file size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }
  
  // Combine warnings
  const allWarnings = [
    ...(nameValidation.warnings || []),
    ...(typeValidation.warnings || []),
    ...(sizeValidation.warnings || []),
  ];
  
  return {
    valid: true,
    warnings: allWarnings.length > 0 ? allWarnings : undefined,
  };
}

/**
 * Get file category from MIME type
 */
export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Spreadsheet';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentation';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || mimeType.includes('7z')) return 'Archive';
  if (mimeType.includes('text')) return 'Text';
  return 'File';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if file is an image that can be previewed
 */
export function isPreviewableImage(file: File): boolean {
  return file.type.startsWith('image/') && file.type !== 'image/svg+xml';
}

/**
 * Check if file is a PDF
 */
export function isPDF(file: File): boolean {
  return file.type === 'application/pdf';
}
