import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { UsersService } from 'src/users/users.service';
import { OrderService } from 'src/orders/orders.service';
import { getModelToken } from '@nestjs/mongoose';
import { Posts } from './posts.model';
import { Orders } from 'src/orders/orders.model';

describe('PostsService', () => {
  let postsService: PostsService;
  let userService: UsersService;
  let orderService: OrderService;
  let postsModel: any; // Replace with the correct type if available
  let ordersModel: any; // Replace with the correct type if available

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        UsersService, // Mock this service if needed
        OrderService, // Mock this service if needed
        {
          provide: getModelToken(Posts.name),
          useValue: postsModel, // Mock the Posts model if needed
        },
        {
          provide: getModelToken(Orders.name),
          useValue: ordersModel, // Mock the Orders model if needed
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    userService = module.get<UsersService>(UsersService);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  // Add more test cases for other methods as needed

  // Example test case for the findAllPosts method
  describe('findAllPosts', () => {
    it('should return an array of posts for valid user', async () => {
      // Mocking the userService.findToken function
      userService.findToken = jest
        .fn()
        .mockResolvedValue({ id: 'validUserId', role: 'admin' });

      // Mocking the postModel.find function
      const expectedResult = [{ title: 'Post 1' }, { title: 'Post 2' }];
      postsModel.find = jest.fn().mockResolvedValue(expectedResult);

      const result = await postsService.findAllPosts({});

      expect(result).toEqual(expectedResult);
      expect(userService.findToken).toHaveBeenCalled();
      expect(postsModel.find).toHaveBeenCalled();
    });

    it('should throw Unauthorized for invalid user', async () => {
      userService.findToken = jest.fn().mockResolvedValue(null);

      await expect(postsService.findAllPosts({})).rejects.toThrow(
        'jwt expired',
      );
    });

    // Add more test cases for different scenarios
  });

  // Add similar test cases for other methods
});
