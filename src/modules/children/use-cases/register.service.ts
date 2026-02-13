import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Child } from '@prisma/client';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';
import { IInstitutionsRepository } from 'src/modules/institutions/repositories/interfaces/institutions-repository.interface';
import { IPeriodRepository } from 'src/modules/period/repositories/interfaces/period-repository.interface';
import { IGradeRepository } from 'src/modules/grade/repositories/interfaces/grade-repository.interface';
import { IResponsibleRepository } from 'src/modules/responsible/repositories/interfaces/responsible-repository.interface';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';
import { SavePictureService } from 'src/modules/aws/save-picture.service';
import { DeletePictureService } from 'src/modules/aws/delete-picture.service';

type RegisterChildServiceRequest = {
  name: string;
  cpf: string;
  gradeId: string;
  birthDate: Date;
  picture: Express.Multer.File;
  periodId: string;
  institutionId: string;
  responsibleId: string;
  kinship?: string;
};

type RegisterChildServiceResponse = {
  child: Child;
};

export class RegisterService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IInstitutionsRepository')
    private readonly institutionsRepository: IInstitutionsRepository,
    @Inject('IPeriodRepository')
    private readonly periodRepository: IPeriodRepository,
    @Inject('IGradeRepository')
    private readonly gradeRepository: IGradeRepository,
    @Inject('IResponsibleRepository')
    private readonly responsibleRepository: IResponsibleRepository,
    @Inject('IResponsibleOnChildrenRepository')
    private readonly responsibleOnChildrenRepository: IResponsibleOnChildrenRepository,
    @Inject('SavePictureService')
    private readonly savePictureService: SavePictureService,
    @Inject('DeletePictureService')
    private readonly deletePictureService: DeletePictureService,
  ) {}

  async exec({
    name,
    cpf,
    gradeId,
    periodId,
    birthDate,
    picture,
    institutionId,
    responsibleId,
    kinship,
  }: RegisterChildServiceRequest): Promise<RegisterChildServiceResponse> {
    if (!institutionId.length || !periodId.length || !gradeId.length) {
      throw new BadRequestException(
        'The institutionId, periodId and gradeId must be provided',
      );
    }

    if (!name.length || !cpf.length || !birthDate) {
      throw new BadRequestException(
        'Must to provide these following data, (name, cpf, periodId, gradeId, birthDate and institutionId)',
      );
    }

    if (!picture || !picture.buffer) {
      throw new NotAcceptableException('A picture must be provided.');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(picture.mimetype)) {
      throw new BadRequestException(
        `Invalid image type: ${picture.mimetype}. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const base64Picture = `data:${picture.mimetype};base64,${picture.buffer.toString('base64')}`;

    const doesInstitutionIdExist =
      await this.institutionsRepository.findInstitutionById(institutionId);

    const doesPeriodExist =
      await this.periodRepository.findPeriodById(periodId);

    const doesGradeExist = await this.gradeRepository.findGradeById(gradeId);
    const doesChildExist = await this.childrenRepository.findChildByCpf(cpf);

    if (!doesInstitutionIdExist) {
      throw new NotFoundException('Institution Id provided does not exist');
    }

    if (!doesPeriodExist) {
      throw new NotFoundException('Period Id provided does not exist');
    }

    if (!doesGradeExist) {
      throw new NotFoundException('Grade Id provided does not exist');
    }

    if (doesChildExist) {
      throw new BadRequestException('Child CPF provided already exists.');
    }

    const doesResponsibleExist =
      await this.responsibleRepository.findResponsibleById(responsibleId);
    if (!doesResponsibleExist) {
      throw new NotFoundException('Responsible Id provided does not exist.');
    }

    const pictureUrl = await this.savePictureService.exec({
      picture: base64Picture,
      folderName: 'children',
    });

    try {
      const child = await this.childrenRepository.create({
        name,
        cpf,
        gradeId,
        periodId,
        birthDate,
        picture: pictureUrl,
        institutionId,
      });

      await this.responsibleOnChildrenRepository.create({
        childId: child.id,
        responsibleId,
        kinship,
      });

      return { child };
    } catch (error) {
      await this.deletePictureService.exec(pictureUrl);
      throw new InternalServerErrorException(
        'Failed to register child. The uploaded picture has been removed.',
      );
    }
  }
}
