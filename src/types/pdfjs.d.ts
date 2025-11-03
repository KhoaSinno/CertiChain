declare module 'pdfjs-dist' {
  export interface PageViewport {
    width: number;
    height: number;
  }

  export interface PDFPageProxy {
    getViewport(params: { scale: number }): PageViewport;
    render(renderContext: RenderParameters): {
      promise: Promise<void>;
    };
  }

  export interface PDFDocumentProxy {
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface LoadingTask {
    promise: Promise<PDFDocumentProxy>;
  }

  export interface RenderParameters {
    canvasContext: CanvasRenderingContext2D;
    viewport: PageViewport;
    canvas: HTMLCanvasElement;
  }

  export function getDocument(params: { data: ArrayBuffer }): LoadingTask;

  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export const version: string;
}