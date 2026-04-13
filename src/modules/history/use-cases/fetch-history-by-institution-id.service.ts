import { Inject, Injectable } from '@nestjs/common';
import { GetPresignedUrlService } from 'src/modules/aws/get-presigned-url.service';
import {
  IHistoryRepository,
  IHistoryWithDetails,
} from '../repositories/interfaces/history-repository.interface';

interface FetchHistoryByInstitutionIdRequest {
  institutionId: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class FetchHistoryByInstitutionIdService {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
    private readonly getPresignedUrlService: GetPresignedUrlService,
  ) {}

  async exec({
    institutionId,
    dateFrom,
    dateTo,
  }: FetchHistoryByInstitutionIdRequest): Promise<IHistoryWithDetails[]> {
    const history =
      await this.historyRepository.findByInstitutionId(institutionId);

    let filtered = history;

    if (dateFrom || dateTo) {
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;

      if (to) {
        to.setHours(23, 59, 59, 999);
      }

      filtered = history.filter((entry) => {
        const createdAt = new Date(entry.createdAt);
        if (from && createdAt < from) return false;
        if (to && createdAt > to) return false;
        return true;
      });
    }

    const resolved = await Promise.all(
      filtered.map(async (entry) => {
        const [childPicture, responsiblePicture] = await Promise.all([
          entry.child.picture
            ? this.getPresignedUrlService.exec(entry.child.picture)
            : null,
          entry.responsible.picture
            ? this.getPresignedUrlService.exec(entry.responsible.picture)
            : null,
        ]);

        return {
          ...entry,
          child: { ...entry.child, picture: childPicture },
          responsible: { ...entry.responsible, picture: responsiblePicture },
        };
      }),
    );

    return resolved;
  }
}
