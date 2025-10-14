import { ApiProperty } from '@nestjs/swagger';

export interface JiraColumn {
  id: string;
  name: string;
  statusIds: string[];
  maxItems?: number;
  isFirst?: boolean;
  isLast?: boolean;
}

export interface JiraBoardInfo {
  id: string;
  name: string;
  type: string;
  projectKey: string;
}

export class GetBoardColumnsResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Board ID' })
  boardId: string;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({
    description: 'Board information',
    example: {
      id: '123',
      name: 'Project Board',
      type: 'scrum',
      projectKey: 'PROJ',
    },
  })
  boardInfo: JiraBoardInfo;

  @ApiProperty({
    description: 'Board columns',
    example: [
      {
        id: 'col-1',
        name: 'To Do',
        statusIds: ['1', '10001'],
        isFirst: true,
      },
      {
        id: 'col-2',
        name: 'In Progress',
        statusIds: ['3'],
      },
      {
        id: 'col-3',
        name: 'Done',
        statusIds: ['10002'],
        isLast: true,
      },
    ],
  })
  columns: JiraColumn[];

  @ApiProperty({ description: 'Total columns count' })
  totalColumns: number;

  constructor(
    boardId: string,
    boardInfo: JiraBoardInfo,
    columns: JiraColumn[],
    message: string = 'Board columns retrieved successfully',
  ) {
    this.success = true;
    this.boardId = boardId;
    this.message = message;
    this.boardInfo = boardInfo;
    this.columns = columns;
    this.totalColumns = columns.length;
  }
}
