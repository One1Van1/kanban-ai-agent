import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as PDFDocument from 'pdfkit';
import { Flow } from '../../../entities/flow.entity';
import { ExportFlowPdfQueryDto } from './export-flow-pdf.query.dto';

@Injectable()
export class ExportFlowPdfService {
  private readonly logger = new Logger(ExportFlowPdfService.name);

  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  async execute(queryDto: ExportFlowPdfQueryDto): Promise<Buffer> {
    this.logger.log(`Exporting flow to PDF: ${queryDto.id}`);

    try {
      const flow = await this.flowRepository.findOne({
        where: { id: queryDto.id },
      });

      if (!flow) {
        throw new NotFoundException(`Flow with ID ${queryDto.id} not found`);
      }

      this.logger.log(`Flow "${flow.name}" found, generating PDF...`);

      const pdfBuffer = await this.generatePDF(flow);

      this.logger.log(`PDF generated successfully for flow: ${flow.name}`);

      return pdfBuffer;
    } catch (error) {
      this.logger.error(
        `Failed to export flow to PDF: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new NotFoundException('Failed to export flow to PDF');
    }
  }

  private async generatePDF(flow: Flow): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc
          .fontSize(24)
          .font('Helvetica-Bold')
          .text('Flow Export Document', { align: 'center' })
          .moveDown();

        // Flow Information
        doc
          .fontSize(18)
          .text('Flow Information', { underline: true })
          .moveDown(0.5);

        doc.fontSize(12).font('Helvetica');

        doc.font('Helvetica-Bold').text('Name: ', { continued: true });
        doc.font('Helvetica').text(flow.name);

        if (flow.description) {
          doc.font('Helvetica-Bold').text('Description: ', { continued: true });
          doc.font('Helvetica').text(flow.description);
        }

        doc.font('Helvetica-Bold').text('Status: ', { continued: true });
        doc.font('Helvetica').text(flow.status.toUpperCase());

        doc.font('Helvetica-Bold').text('Flow ID: ', { continued: true });
        doc.font('Helvetica').text(flow.id);

        doc.font('Helvetica-Bold').text('Created By: ', { continued: true });
        doc.font('Helvetica').text(flow.createdBy);

        doc.font('Helvetica-Bold').text('Created At: ', { continued: true });
        doc.font('Helvetica').text(new Date(flow.createdAt).toLocaleString());

        doc.font('Helvetica-Bold').text('Updated At: ', { continued: true });
        doc.font('Helvetica').text(new Date(flow.updatedAt).toLocaleString());

        doc.moveDown(2);

        // Flow Definition
        doc
          .fontSize(18)
          .font('Helvetica-Bold')
          .text('Flow Structure', { underline: true })
          .moveDown(0.5);

        const definition = flow.definition || {};
        const blocks = definition.blocks || [];
        const connections = definition.connections || [];

        // Blocks Section
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`Blocks (${blocks.length})`, { underline: true })
          .moveDown(0.5);

        if (blocks.length > 0) {
          blocks.forEach((block: any, index: number) => {
            doc
              .fontSize(12)
              .font('Helvetica-Bold')
              .text(`${index + 1}. ${block.type || 'Unknown Block'}`, {
                continued: true,
              });
            if (block.id) {
              doc
                .font('Helvetica')
                .fontSize(10)
                .text(` (ID: ${block.id})`, { align: 'left' });
            } else {
              doc.text('');
            }

            if (block.data) {
              doc
                .fontSize(10)
                .font('Helvetica')
                .text(
                  `   Configuration: ${JSON.stringify(block.data, null, 2).substring(0, 100)}...`,
                );
            }

            doc.moveDown(0.3);
          });
        } else {
          doc
            .fontSize(12)
            .font('Helvetica')
            .text('No blocks defined')
            .moveDown();
        }

        doc.moveDown();

        // Connections Section
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(`Connections (${connections.length})`, { underline: true })
          .moveDown(0.5);

        if (connections.length > 0) {
          connections.forEach((connection: any, index: number) => {
            doc
              .fontSize(12)
              .font('Helvetica')
              .text(
                `${index + 1}. ${connection.source || 'Unknown'} → ${connection.target || 'Unknown'}`,
              );
            doc.moveDown(0.3);
          });
        } else {
          doc
            .fontSize(12)
            .font('Helvetica')
            .text('No connections defined')
            .moveDown();
        }

        // Metadata Section
        if (flow.metadata && Object.keys(flow.metadata).length > 0) {
          doc.moveDown(2);
          doc
            .fontSize(18)
            .font('Helvetica-Bold')
            .text('Metadata', { underline: true })
            .moveDown(0.5);
          doc
            .fontSize(10)
            .font('Helvetica')
            .text(JSON.stringify(flow.metadata, null, 2));
        }

        // Footer
        doc.moveDown(3);
        doc
          .fontSize(8)
          .font('Helvetica')
          .text(
            `Generated on ${new Date().toLocaleString()} | Export Format Version 1.0.0`,
            { align: 'center' },
          );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
