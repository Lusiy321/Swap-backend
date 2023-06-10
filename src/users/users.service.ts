/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors'
import { sign, verify, JwtPayload } from 'jsonwebtoken'



@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: User) {}

  async findAll(req: any): Promise<User[]> {
    const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw new Unauthorized("Not authorized");
    }
    const SECRET_KEY = process.env.SECRET_KEY;
    const findId = verify(token, SECRET_KEY) as JwtPayload;
const user = await this.userModel.findById({ _id: findId.id });
    if (user.role === 'admin') {
      return this.userModel.find().exec();
    } else if (user.role === 'boss') {
      return this.userModel
        .find({ _id: { $in: [...user.subordinates, user._id] } })
        .exec();
    } else {
      return this.userModel.findById(user._id).exec();
    }
  }

  async findById(id: string): Promise<User> {
    try { 
      const find = await this.userModel.findById(id).exec();
      return find; 
    } catch(e) {
      throw new NotFound('User not found');
    }    
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
    const { email } = user;
    const registrationUser = await this.userModel.findOne({ email });
    if (registrationUser) {
      throw new Conflict(`User with ${email} in use`);
    }
    const createdUser = await this.userModel.create(user);
    createdUser.setName(user.email);
    createdUser.setPassword(user.password);
    return createdUser.save();
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async login(user: CreateUserDto): Promise<User> {
    try {
    const { email, password  } = user;
    const authUser = await this.userModel.findOne({ email });
    if (!authUser || !authUser.comparePassword(password)) {
      throw new Unauthorized(`Email or password is wrong`);
    }
    const payload = {
      id: authUser._id,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await this.userModel.findByIdAndUpdate(authUser._id, { token });
    const authentificationUser = await this.userModel.findById({ _id: authUser._id });
      return authentificationUser;
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async logout(req: any): Promise<User> {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw new Unauthorized("Not authorized");
    }
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    const user = verify(token, SECRET_KEY) as JwtPayload;
    
    await this.userModel.findByIdAndUpdate({_id: user.id}, { token: null });
     
    return await this.userModel.findById({ _id: user.id });
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async update(id: string, user: User, loggedInUser: User): Promise<User> {
    const existingUser: any = await this.userModel.findById(id).exec();
    if (!existingUser) {
      throw new Conflict('User not found');
    }

    if (
      loggedInUser.role === 'boss' &&
      loggedInUser.subordinates.includes(existingUser._id)
    ) {
      return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
    } else {
      throw new Conflict('Only boss and their subordinates can update user');
    }
  }

  async delete(id: string, loggedInUser: User): Promise<User> {
    const existingUser: any = await this.userModel.findById(id).exec();
    if (!existingUser) {
      throw new Conflict('User not found');
    }

    if (
      loggedInUser.role === 'boss' &&
      loggedInUser.subordinates.includes(existingUser._id)
    ) {
      return this.userModel.findByIdAndRemove(id).exec();
    } else {
      throw new Conflict('Only boss and their subordinates can delete user');
    }
  }

  async setBoss(
    userId: string,
    bossId: string,
    loggedInUser: User,
  ): Promise<User> {
    const userToUpdate = await this.userModel.findById(userId).exec();
    const newBoss: any = await this.userModel.findById(bossId).exec();

    if (!userToUpdate || !newBoss) {
      throw new Conflict('User or boss not found');
    }

    if (
      loggedInUser.role === 'boss' &&
      loggedInUser.subordinates.includes(newBoss._id)
    ) {
      userToUpdate.boss = newBoss._id;
      return userToUpdate.save();
    } else {
      throw new Conflict('Only boss and their subordinates can change user boss');
    }
  }
}

UserSchema.methods.setPassword = async function (password: string) {  
  return this.password = hashSync(password, 10);
};

UserSchema.methods.setName = function (email: string) {
  const parts = email.split("@");
  this.name = parts[0];
};
UserSchema.methods.comparePassword = function (password: string) {
  return compareSync(password, this.password);
};