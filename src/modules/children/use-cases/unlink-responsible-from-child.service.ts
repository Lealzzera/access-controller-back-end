import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IChildrenRepository } from '../repositories/interfaces/children-repository.interface';
import { IResponsibleOnChildrenRepository } from 'src/modules/responsible-on-children/repositories/interfaces/responsible-on-children-repository.interface';

interface UnlinkResponsibleFromChildRequest {
  childId: string;
  responsibleId: string;
}

export class UnlinkResponsibleFromChildService {
  constructor(
    @Inject('IChildrenRepository')
    private readonly childrenRepository: IChildrenRepository,
    @Inject('IResponsibleOnChildrenRepository')
    private readonly responsibleOnChildrenRepository: IResponsibleOnChildrenRepository,
  ) {}

  async exec({ childId, responsibleId }: UnlinkResponsibleFromChildRequest) {
    const child = await this.childrenRepository.findChildById(childId);
    if (!child) {
      throw new NotFoundException('Child not found');
    }

    const responsibleOnChildren =
      await this.responsibleOnChildrenRepository.findResponsibleOnChildrenById({
        childId,
        responsibleId,
      });

    if (!responsibleOnChildren) {
      throw new NotFoundException(
        'Responsible is not linked to this child',
      );
    }

    const responsibleList =
      await this.responsibleOnChildrenRepository.findResponsibleListByChildId(
        childId,
      );

    if (responsibleList.length <= 1) {
      throw new BadRequestException(
        'Cannot unlink the only responsible from a child. A child must have at least one responsible',
      );
    }

    await this.responsibleOnChildrenRepository.delete({
      childId,
      responsibleId,
    });
  }
}
