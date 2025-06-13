// src/utils/powerPointImporter.ts
import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
import { v4 as uuidv4 } from 'uuid';
import { PresentationTemplate, Slide, SlideElement } from '../types';

/**
 * PowerPoint PPTX Importer
 * 
 * This utility provides functionality to import PowerPoint PPTX files
 * and convert them to our internal presentation format.
 * 
 * PPTX files are essentially ZIP archives containing XML files that define
 * the presentation structure, slides, and content.
 */

interface PPTXSlideContent {
  title?: string;
  content?: string;
  textElements: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: number;
    fontFamily?: string;
    fontColor?: string;
  }>;
  images: Array<{
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

interface PPTXParseResult {
  success: boolean;
  error?: string;
  presentation?: {
    title: string;
    slides: PPTXSlideContent[];
    theme?: {
      backgroundColor: string;
      textColor: string;
      fontFamily: string;
    };
  };
}

export class PowerPointImporter {
  private xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
      trimValues: true,
    });
  }

  /**
   * Import a PowerPoint PPTX file and convert it to our presentation format
   */
  async importPPTX(file: File): Promise<PresentationTemplate | null> {
    try {
      const parseResult = await this.parsePPTXFile(file);
      
      if (!parseResult.success || !parseResult.presentation) {
        console.error('Failed to parse PPTX file:', parseResult.error);
        return null;
      }

      return this.convertToTemplate(parseResult.presentation, file.name);
    } catch (error) {
      console.error('Error importing PPTX file:', error);
      return null;
    }
  }

  /**
   * Parse the PPTX file structure
   */
  private async parsePPTXFile(file: File): Promise<PPTXParseResult> {
    try {
      const zip = await JSZip.loadAsync(file);
      
      // Get presentation structure
      const presentationXml = await this.getFileContent(zip, 'ppt/presentation.xml');
      if (!presentationXml) {
        return { success: false, error: 'Invalid PPTX file: missing presentation.xml' };
      }

      const presentation = this.xmlParser.parse(presentationXml);
      const slideIds = this.extractSlideIds(presentation);
      
      if (slideIds.length === 0) {
        return { success: false, error: 'No slides found in presentation' };
      }

      // Parse each slide
      const slides: PPTXSlideContent[] = [];
      for (const slideId of slideIds) {
        const slideContent = await this.parseSlide(zip, slideId);
        if (slideContent) {
          slides.push(slideContent);
        }
      }

      // Extract theme information
      const theme = await this.extractTheme(zip);

      return {
        success: true,
        presentation: {
          title: file.name.replace('.pptx', ''),
          slides,
          theme,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error parsing PPTX',
      };
    }
  }

  /**
   * Extract slide IDs from presentation.xml
   */
  private extractSlideIds(presentation: any): string[] {
    try {
      const slideIdList = presentation?.['p:presentation']?.['p:sldIdLst']?.['p:sldId'];
      if (!slideIdList) return [];

      const slides = Array.isArray(slideIdList) ? slideIdList : [slideIdList];
      return slides.map((slide: any, index: number) => `slide${index + 1}`);
    } catch (error) {
      console.error('Error extracting slide IDs:', error);
      return [];
    }
  }

  /**
   * Parse individual slide content
   */
  private async parseSlide(zip: JSZip, slideId: string): Promise<PPTXSlideContent | null> {
    try {
      const slideXml = await this.getFileContent(zip, `ppt/slides/${slideId}.xml`);
      if (!slideXml) return null;

      const slide = this.xmlParser.parse(slideXml);
      const shapes = this.extractShapes(slide);
      
      const textElements: PPTXSlideContent['textElements'] = [];
      const images: PPTXSlideContent['images'] = [];
      let title = '';
      let content = '';

      // Process shapes to extract text and images
      for (const shape of shapes) {
        if (shape.type === 'text') {
          textElements.push({
            text: shape.text,
            x: shape.x || 0,
            y: shape.y || 0,
            width: shape.width || 100,
            height: shape.height || 50,
            fontSize: shape.fontSize,
            fontFamily: shape.fontFamily,
            fontColor: shape.fontColor,
          });

          // Use first text element as title, rest as content
          if (!title) {
            title = shape.text;
          } else {
            content += shape.text + '\n';
          }
        } else if (shape.type === 'image') {
          images.push({
            src: shape.src || '',
            x: shape.x || 0,
            y: shape.y || 0,
            width: shape.width || 100,
            height: shape.height || 100,
          });
        }
      }

      return {
        title: title || `Slide ${slideId}`,
        content: content.trim(),
        textElements,
        images,
      };
    } catch (error) {
      console.error(`Error parsing slide ${slideId}:`, error);
      return null;
    }
  }

  /**
   * Extract shapes from slide XML
   */
  private extractShapes(slide: any): Array<any> {
    try {
      const shapes: Array<any> = [];
      const spTree = slide?.['p:sld']?.['p:cSld']?.['p:spTree'];
      
      if (!spTree) return shapes;

      // Extract text shapes (p:sp)
      const textShapes = spTree['p:sp'];
      if (textShapes) {
        const shapeArray = Array.isArray(textShapes) ? textShapes : [textShapes];
        for (const shape of shapeArray) {
          const textContent = this.extractTextFromShape(shape);
          if (textContent) {
            shapes.push({
              type: 'text',
              text: textContent,
              ...this.extractShapePosition(shape),
              ...this.extractTextFormatting(shape),
            });
          }
        }
      }

      // Extract image shapes (p:pic)
      const imageShapes = spTree['p:pic'];
      if (imageShapes) {
        const imageArray = Array.isArray(imageShapes) ? imageShapes : [imageShapes];
        for (const image of imageArray) {
          shapes.push({
            type: 'image',
            src: this.extractImageSource(image),
            ...this.extractShapePosition(image),
          });
        }
      }

      return shapes;
    } catch (error) {
      console.error('Error extracting shapes:', error);
      return [];
    }
  }

  /**
   * Extract text content from a shape
   */
  private extractTextFromShape(shape: any): string {
    try {
      const txBody = shape?.['p:txBody'];
      if (!txBody) return '';

      const paragraphs = txBody['a:p'];
      if (!paragraphs) return '';

      const pArray = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
      const textParts: string[] = [];

      for (const paragraph of pArray) {
        const runs = paragraph['a:r'];
        if (runs) {
          const runArray = Array.isArray(runs) ? runs : [runs];
          for (const run of runArray) {
            const text = run['a:t'];
            if (text) {
              textParts.push(typeof text === 'string' ? text : text['#text'] || '');
            }
          }
        }
      }

      return textParts.join(' ').trim();
    } catch (error) {
      console.error('Error extracting text from shape:', error);
      return '';
    }
  }

  /**
   * Extract shape position and dimensions
   */
  private extractShapePosition(shape: any): { x: number; y: number; width: number; height: number } {
    try {
      const spPr = shape?.['p:spPr'] || shape?.['p:spPr'];
      const xfrm = spPr?.['a:xfrm'];
      
      if (!xfrm) {
        return { x: 0, y: 0, width: 100, height: 50 };
      }

      const off = xfrm['a:off'];
      const ext = xfrm['a:ext'];

      // Convert EMU (English Metric Units) to percentages
      // 1 inch = 914400 EMU, assuming 10 inch slide width
      const slideWidth = 9144000; // 10 inches in EMU
      const slideHeight = 6858000; // 7.5 inches in EMU

      return {
        x: off ? Math.round((parseInt(off['@_x']) / slideWidth) * 100) : 0,
        y: off ? Math.round((parseInt(off['@_y']) / slideHeight) * 100) : 0,
        width: ext ? Math.round((parseInt(ext['@_cx']) / slideWidth) * 100) : 100,
        height: ext ? Math.round((parseInt(ext['@_cy']) / slideHeight) * 100) : 50,
      };
    } catch (error) {
      console.error('Error extracting shape position:', error);
      return { x: 0, y: 0, width: 100, height: 50 };
    }
  }

  /**
   * Extract text formatting from shape
   */
  private extractTextFormatting(shape: any): { fontSize?: number; fontFamily?: string; fontColor?: string } {
    try {
      const txBody = shape?.['p:txBody'];
      const paragraph = txBody?.['a:p'];
      const pArray = Array.isArray(paragraph) ? paragraph : [paragraph];
      
      if (pArray.length === 0) return {};

      const run = pArray[0]?.['a:r'];
      const runArray = Array.isArray(run) ? run : [run];
      
      if (runArray.length === 0) return {};

      const rPr = runArray[0]?.['a:rPr'];
      if (!rPr) return {};

      return {
        fontSize: rPr['@_sz'] ? parseInt(rPr['@_sz']) / 100 : undefined, // Convert from points*100
        fontFamily: rPr['a:latin']?.['@_typeface'] || undefined,
        fontColor: this.extractColor(rPr),
      };
    } catch (error) {
      console.error('Error extracting text formatting:', error);
      return {};
    }
  }

  /**
   * Extract color from formatting
   */
  private extractColor(rPr: any): string | undefined {
    try {
      const solidFill = rPr?.['a:solidFill'];
      if (!solidFill) return undefined;

      const srgbClr = solidFill['a:srgbClr'];
      if (srgbClr?.['@_val']) {
        return `#${srgbClr['@_val']}`;
      }

      return undefined;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Extract image source from image shape
   */
  private extractImageSource(image: any): string {
    try {
      // This would need to extract the actual image from the PPTX archive
      // For now, return a placeholder
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZTwvdGV4dD48L3N2Zz4=';
    } catch (error) {
      return '';
    }
  }

  /**
   * Extract theme information
   */
  private async extractTheme(zip: JSZip): Promise<{ backgroundColor: string; textColor: string; fontFamily: string } | undefined> {
    try {
      const themeXml = await this.getFileContent(zip, 'ppt/theme/theme1.xml');
      if (!themeXml) return undefined;

      // Basic theme extraction - this could be expanded
      return {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'Arial',
      };
    } catch (error) {
      console.error('Error extracting theme:', error);
      return undefined;
    }
  }

  /**
   * Convert parsed PPTX to our presentation template format
   */
  private convertToTemplate(presentation: PPTXParseResult['presentation']!, fileName: string): PresentationTemplate {
    const slides: Partial<Slide>[] = presentation.slides.map((slideContent, index) => {
      const elements: SlideElement[] = [];
      
      // Convert text elements
      slideContent.textElements.forEach((textEl, textIndex) => {
        elements.push({
          id: uuidv4(),
          type: 'text',
          content: textEl.text,
          x: textEl.x,
          y: textEl.y,
          width: textEl.width,
          height: textEl.height,
          fontSize: textEl.fontSize || 16,
          fontFamily: textEl.fontFamily || 'Arial',
          fontColor: textEl.fontColor || '#000000',
          textAlign: 'left',
        });
      });

      // Convert image elements
      slideContent.images.forEach((imageEl) => {
        elements.push({
          id: uuidv4(),
          type: 'image',
          src: imageEl.src,
          x: imageEl.x,
          y: imageEl.y,
          width: imageEl.width,
          height: imageEl.height,
        });
      });

      return {
        id: uuidv4(),
        title: slideContent.title || `Slide ${index + 1}`,
        content: slideContent.content || '',
        type: 'presentation' as const,
        order: index,
        backgroundColor: presentation.theme?.backgroundColor || '#ffffff',
        textColor: presentation.theme?.textColor || '#000000',
        fontSize: 16,
        fontFamily: presentation.theme?.fontFamily || 'Arial',
        textAlign: 'left' as const,
        elements,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    return {
      id: uuidv4(),
      name: presentation.title,
      description: `Imported from ${fileName}`,
      category: 'imported',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjEwMCIgeT0iODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1wb3J0ZWQgUFBUWDwvdGV4dD48L3N2Zz4=',
      slides,
      settings: {
        autoAdvance: false,
        defaultSlideDuration: 5,
        theme: 'default',
        transition: 'fade',
        loopPresentation: false,
        showSlideNumbers: true,
        showProgressBar: true,
        allowRemoteControl: true,
        backgroundColor: presentation.theme?.backgroundColor || '#ffffff',
        defaultTransition: {
          type: 'fade',
          duration: 500,
          easing: 'ease-in-out',
        },
        aspectRatio: '16:9',
        resolution: {
          width: 1920,
          height: 1080,
        },
      },
      tags: ['imported', 'powerpoint'],
      isBuiltIn: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Helper method to get file content from ZIP
   */
  private async getFileContent(zip: JSZip, path: string): Promise<string | null> {
    try {
      const file = zip.file(path);
      if (!file) return null;
      return await file.async('text');
    } catch (error) {
      console.error(`Error reading file ${path}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const powerPointImporter = new PowerPointImporter();