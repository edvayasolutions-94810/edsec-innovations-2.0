export interface DownloadImage {
  url: string;
  filename: string;
}

export const downloadImages = async (images: DownloadImage[]) => {
  if (!images || images.length === 0) {
    return;
  }

  for (const image of images) {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
};
