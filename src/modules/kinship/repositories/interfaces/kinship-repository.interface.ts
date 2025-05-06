import { Kinship } from '@prisma/client';

export type CreateKinship = {
  name: string;
  value: number;
};

export default interface KinshipRepositoryInterface {
  fetchAllKinship(): Promise<Kinship[]>;
  create({ name, value }: CreateKinship): Promise<void>;
  fetchKinshipById(id: string): Promise<Kinship | null>;
}
