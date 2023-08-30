import { NestMiddleware } from '@nestjs/common';
export declare class AuctionMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): void;
}
