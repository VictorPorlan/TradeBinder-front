// Simple card placeholder as base64 data URL
const CARD_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjZjVmNWY1IiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjE0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DYXJkPC90ZXh0Pgo8L3N2Zz4K';

// Helper function to handle image URLs
export const getImageUrl = (imageUrl?: string): string => {
  // If no image URL provided, return placeholder
  if (!imageUrl) {
    return CARD_PLACEHOLDER;
  }

  // If it's a blob URL, try to handle it gracefully
  if (imageUrl.startsWith('blob:')) {
    // For blob URLs, we'll return a placeholder for now
    // In a real app, you might want to convert blob to base64 or handle differently
    return CARD_PLACEHOLDER;
  }

  // If it's a data URL (base64), return as is
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  // If it's a regular URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative path, return as is
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // For any other case, return placeholder
  return CARD_PLACEHOLDER;
};

// Helper function to check if an image URL is valid
export const isValidImageUrl = (imageUrl?: string): boolean => {
  if (!imageUrl) return false;
  
  // Blob URLs are considered invalid for our purposes
  if (imageUrl.startsWith('blob:')) return false;
  
  return true;
};
