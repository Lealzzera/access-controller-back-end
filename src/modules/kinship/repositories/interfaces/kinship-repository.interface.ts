import { Kinship } from '@prisma/client';

export type CreateKinship = {
  name: string;
  value: number;
};

export default interface IKinshipRepository {
  fetchAllKinship(): Promise<Kinship[]>;
  create({ name, value }: CreateKinship): Promise<Kinship>;
  fetchKinshipById(id: string): Promise<Kinship | null>;
}
