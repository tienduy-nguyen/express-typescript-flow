import express, { NextFunction, Request, Response } from 'express';
import { container, injectable } from 'tsyringe';
import { AddressService } from './address.service';
import handler from 'express-async-handler';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { NotFoundException } from '@common/exceptions';
import { authMiddleware, validationMiddleware } from '@common/middleware';

@injectable()
export class AddressController {
  public path = '/address';
  public router = express.Router();
  private addressService: AddressService;
  constructor() {
    this.addressService = container.resolve(AddressService);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/', handler(this.index));
    this.router.get('/:id', handler(this.show));

    this.router
      .all(`${this.path}/*`, authMiddleware)
      .post('/:id', validationMiddleware(CreateAddressDto), handler(this.new))
      .put('/:id', validationMiddleware(UpdateAddressDto), handler(this.update))
      .delete('/:id', handler(this.delete));
  }

  /* Private methods for routes */

  private index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses = await this.addressService.getAddresses();
      res.send(addresses);
    } catch (error) {
      next(error);
    }
  };

  private show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const address = await this.addressService.getAddressById(id);
      res.send(address);
    } catch (error) {
      next(error);
    }
  };

  private new = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressDto = req.body as CreateAddressDto;
      const address = await this.addressService.createAddress(addressDto);
      res.send(address);
    } catch (error) {
      next(error);
    }
  };

  private update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const addressDto = req.body as UpdateAddressDto;
      const address = await this.addressService.getAddressById(id);
      if (!address) {
        next(new NotFoundException(`Address with id ${id} not found`));
      }
      const updated = await this.addressService.updateAddress(
        address,
        addressDto,
      );
      res.send(updated);
    } catch (error) {
      next(error);
    }
  };

  private delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.addressService.deleteAddress(id);
      res.send({ message: `Delete successfully address with id ${id}` });
    } catch (error) {
      next(error);
    }
  };
}
