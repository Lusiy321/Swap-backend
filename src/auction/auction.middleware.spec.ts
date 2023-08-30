import { AuctionMiddleware } from './auction.middleware';

describe('AuctionMiddleware', () => {
  it('should be defined', () => {
    expect(new AuctionMiddleware()).toBeDefined();
  });
});
