declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface BarcodeDetectorResult {
    format: string;
    rawValue: string;
    boundingBox: DOMRectReadOnly;
    cornerPoints: { x: number; y: number }[];
  }

  interface BarcodeDetectorOptions {
    formats: string[];
  }

  class BarcodeDetector {
    constructor(options?: BarcodeDetectorOptions);
    detect(source: CanvasImageSource): Promise<BarcodeDetectorResult[]>;
    static getSupportedFormats(): Promise<string[]>;
  }

  interface PeriodicSyncManager {
    register(tag: string, options?: { minInterval?: number }): Promise<void>;
    unregister(tag: string): Promise<void>;
  }

  interface ServiceWorkerRegistration {
    readonly periodicSync?: PeriodicSyncManager;
  }

  interface Window {
    BarcodeDetector?: typeof BarcodeDetector;
  }
}

export {};
