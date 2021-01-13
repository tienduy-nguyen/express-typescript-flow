import { BadRequestException } from '@common/exceptions';
import { injectable } from 'tsyringe';
import { getRepository, Repository } from 'typeorm';
import { Address } from './address.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto';

@injectable()
export class AddressService {
  private addressRepository: Repository<Address>;
  constructor() {
    this.addressRepository = getRepository(Address);
  }

  public async getAddresses(): Promise<Address[]> {
    try {
      return await this.addressRepository.find();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async getAddressById(id: string): Promise<Address> {
    try {
      return await this.addressRepository.findOne({ where: { id: id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async createAddress(AddressDto: CreateAddressDto): Promise<Address> {
    try {
      const address = this.addressRepository.create(AddressDto);
      await this.addressRepository.save(address);

      return address;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async updateAddress(
    Address: Address,
    AddressDto: UpdateAddressDto,
  ): Promise<Address> {
    try {
      const updated: Address = Object.assign(Address, AddressDto);
      await this.addressRepository.save(updated);
      return updated;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async deleteAddress(id: string): Promise<void> {
    try {
      await this.addressRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
