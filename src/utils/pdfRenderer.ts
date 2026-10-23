import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up the local bundled worker for pdfjs
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

export interface RenderedPdfPage {
  pageNumber: number;
  width: number;
  height: number;
  blob: Blob;
  url: string;
}

export interface RenderPdfOptions {
  scale?: number; // default 2.0 for crisp retina resolution
  format?: 'image/png' | 'image/jpeg';
  quality?: number; // 0.92 for jpeg
}

/**
 * Renders all or specified pages of a PDF File into genuine canvas bitmaps and exports as images.
 */
export async function renderPdfPages(
  pdfFile: File | Blob,
  options: RenderPdfOptions = {}
): Promise<{
  totalPages: number;
  pages: RenderedPdfPage[];
  fileName: string;
}> {
  const scale = options.scale || 2.0;
  const format = options.format || 'image/png';
  const quality = options.quality ?? 0.92;
  const fileName = pdfFile instanceof File ? pdfFile.name : 'document.pdf';

  const arrayBuffer = await pdfFile.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: undefined,
    cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;
  const pages: RenderedPdfPage[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext('2d', { alpha: format === 'image/png' });
    if (!ctx) {
      throw new Error(`Failed to create 2D canvas context for page ${pageNum}`);
    }

    // Fill white background for JPEG exports or clean presentation
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const renderContext = {
      canvasContext: ctx,
      viewport,
      canvas,
    };

    // Render genuine PDF vector and raster content onto canvas
    await page.render(renderContext).promise;

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error(`Failed to encode PDF page ${pageNum} to ${format}`));
        },
        format,
        quality
      );
    });

    const url = URL.createObjectURL(blob);
    pages.push({
      pageNumber: pageNum,
      width: canvas.width,
      height: canvas.height,
      blob,
      url,
    });
  }

  return {
    totalPages,
    pages,
    fileName,
  };
}
