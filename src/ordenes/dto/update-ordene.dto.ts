import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdenDto } from './create-ordene.dto';

export class UpdateOrdeneDto extends PartialType(CreateOrdenDto) {}
