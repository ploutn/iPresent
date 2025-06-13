// src/utils/pdfExporter.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PresentationTemplate, Slide } from '../types';

/**
 * PDF Exporter
 * 
 * This utility provides functionality to export presentations to PDF format.
 * It renders slides as HTML elements and converts them to PDF pages.
 */

export interface PDFExportOptions {
  format?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  quality?: number; // 0.1 to 1.0
  includeNotes?: boolean;
  slideSpacing?: number;
  margin?: number;
}

export interface PDFExportProgress {
  currentSlide: number;
  totalSlides: number;
  stage: 'preparing' | 'rendering' | 'generating' | 'complete';
}

export class PDFExporter {
  private defaultOptions: PDFExportOptions = {
    format: 'a4',
    orientation: 'landscape',
    quality: 0.8,
    includeNotes: false,
    slideSpacing: 10,
    margin: 20,
  };

  /**
   * Export a presentation template to PDF
   */
  async exportToPDF(
    template: PresentationTemplate,
    options: Partial<PDFExportOptions> = {},
    onProgress?: (progress: PDFExportProgress) => void
  ): Promise<Blob> {
    const opts = { ...this.defaultOptions, ...options };
    const slides = template.slides;
    
    if (slides.length === 0) {
      throw new Error('No slides to export');
    }

    // Initialize PDF document
    const pdf = new jsPDF({
      orientation: opts.orientation!,
      unit: 'mm',
      format: opts.format!,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - (opts.margin! * 2);
    const contentHeight = pageHeight - (opts.margin! * 2);

    onProgress?.({
      currentSlide: 0,
      totalSlides: slides.length,
      stage: 'preparing',
    });

    // Process each slide
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      
      onProgress?.({
        currentSlide: i + 1,
        totalSlides: slides.length,
        stage: 'rendering',
      });

      // Create slide element for rendering
      const slideElement = await this.createSlideElement(slide, {
        width: contentWidth * 3.78, // Convert mm to px (approximate)
        height: contentHeight * 3.78,
      });

      // Render slide to canvas
      const canvas = await html2canvas(slideElement, {
        scale: opts.quality! * 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: slide.background?.color || '#ffffff',
      });

      // Add new page (except for first slide)
      if (i > 0) {
        pdf.addPage();
      }

      // Add slide image to PDF
      const imgData = canvas.toDataURL('image/jpeg', opts.quality);
      pdf.addImage(
        imgData,
        'JPEG',
        opts.margin!,
        opts.margin!,
        contentWidth,
        contentHeight
      );

      // Add slide notes if enabled
      if (opts.includeNotes && slide.notes) {
        pdf.addPage();
        this.addNotesPage(pdf, slide.notes, opts);
      }

      // Clean up
      document.body.removeChild(slideElement);
    }

    onProgress?.({
      currentSlide: slides.length,
      totalSlides: slides.length,
      stage: 'generating',
    });

    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
    
    onProgress?.({
      currentSlide: slides.length,
      totalSlides: slides.length,
      stage: 'complete',
    });

    return pdfBlob;
  }

  /**
   * Create a DOM element representing a slide for rendering
   */
  private async createSlideElement(
    slide: Slide,
    dimensions: { width: number; height: number }
  ): Promise<HTMLElement> {
    const slideElement = document.createElement('div');
    slideElement.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: ${dimensions.width}px;
      height: ${dimensions.height}px;
      background: ${slide.background?.color || '#ffffff'};
      font-family: Arial, sans-serif;
      overflow: hidden;
      box-sizing: border-box;
    `;

    // Add background image if present
    if (slide.background?.image) {
      slideElement.style.backgroundImage = `url(${slide.background.image})`;
      slideElement.style.backgroundSize = 'cover';
      slideElement.style.backgroundPosition = 'center';
    }

    // Add slide elements
    for (const element of slide.elements) {
      const elementDiv = await this.createElementDiv(element, dimensions);
      slideElement.appendChild(elementDiv);
    }

    document.body.appendChild(slideElement);
    return slideElement;
  }

  /**
   * Create a DOM element for a slide element
   */
  private async createElementDiv(
    element: any,
    slideDimensions: { width: number; height: number }
  ): Promise<HTMLElement> {
    const elementDiv = document.createElement('div');
    
    // Position and size
    const x = (element.position?.x || 0) * slideDimensions.width / 100;
    const y = (element.position?.y || 0) * slideDimensions.height / 100;
    const width = (element.size?.width || 20) * slideDimensions.width / 100;
    const height = (element.size?.height || 10) * slideDimensions.height / 100;

    elementDiv.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${width}px;
      height: ${height}px;
      box-sizing: border-box;
    `;

    switch (element.type) {
      case 'text':
        this.setupTextElement(elementDiv, element);
        break;
      case 'image':
        await this.setupImageElement(elementDiv, element);
        break;
      case 'shape':
        this.setupShapeElement(elementDiv, element);
        break;
      default:
        elementDiv.textContent = element.content || '';
    }

    return elementDiv;
  }

  /**
   * Setup text element styling
   */
  private setupTextElement(elementDiv: HTMLElement, element: any): void {
    elementDiv.innerHTML = element.content || '';
    elementDiv.style.cssText += `
      font-size: ${element.fontSize || 16}px;
      font-family: ${element.fontFamily || 'Arial, sans-serif'};
      color: ${element.color || '#000000'};
      text-align: ${element.textAlign || 'left'};
      font-weight: ${element.fontWeight || 'normal'};
      font-style: ${element.fontStyle || 'normal'};
      line-height: 1.4;
      padding: 8px;
      word-wrap: break-word;
      overflow: hidden;
    `;
  }

  /**
   * Setup image element
   */
  private async setupImageElement(elementDiv: HTMLElement, element: any): Promise<void> {
    if (element.src) {
      const img = document.createElement('img');
      img.src = element.src;
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: ${element.objectFit || 'contain'};
      `;
      elementDiv.appendChild(img);
    }
  }

  /**
   * Setup shape element
   */
  private setupShapeElement(elementDiv: HTMLElement, element: any): void {
    elementDiv.style.cssText += `
      background-color: ${element.backgroundColor || 'transparent'};
      border: ${element.borderWidth || 0}px solid ${element.borderColor || '#000000'};
      border-radius: ${element.borderRadius || 0}px;
    `;

    if (element.content) {
      elementDiv.innerHTML = element.content;
      elementDiv.style.cssText += `
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 8px;
      `;
    }
  }

  /**
   * Add notes page to PDF
   */
  private addNotesPage(
    pdf: jsPDF,
    notes: string,
    options: PDFExportOptions
  ): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = options.margin!;
    const maxWidth = pageWidth - (margin * 2);

    // Add title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Speaker Notes', margin, margin + 10);

    // Add notes content
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(notes, maxWidth);
    pdf.text(lines, margin, margin + 25);
  }

  /**
   * Get estimated file size for a presentation
   */
  estimateFileSize(
    template: PresentationTemplate,
    options: Partial<PDFExportOptions> = {}
  ): number {
    const opts = { ...this.defaultOptions, ...options };
    const slideCount = template.slides.length;
    const notesPages = opts.includeNotes ? 
      template.slides.filter(slide => slide.notes).length : 0;
    
    // Rough estimation: ~200KB per slide + ~50KB per notes page
    const baseSize = slideCount * 200 * 1024; // 200KB per slide
    const notesSize = notesPages * 50 * 1024; // 50KB per notes page
    const qualityMultiplier = opts.quality || 0.8;
    
    return Math.round((baseSize + notesSize) * qualityMultiplier);
  }
}

// Export singleton instance
export const pdfExporter = new PDFExporter();