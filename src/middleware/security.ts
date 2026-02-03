import { rateLimit } from "express-rate-limit";
import { Crawler } from "es6-crawler-detect";
import { NextFunction, Request, Response } from "express";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 100; // limit each IP to 100 requests per windowMs
const RATE_LIMIT_MESSAGE = 'Too many requests, please try again later.';

const BOT_RATE_LIMIT_MAX = 10; // limit each IP to 10 requests per windowMs
const BOT_RATE_LIMIT_MESSAGE = 'Too many bot requests, please try again later.';

export const humanLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS, // 15 minutes
    limit: RATE_LIMIT_MAX, // limit each IP to 100 requests per windowMs
    message: RATE_LIMIT_MESSAGE,
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56
});

export const botLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS, // 15 minutes
    limit: BOT_RATE_LIMIT_MAX, // limit each IP to 10 requests per windowMs
    message: BOT_RATE_LIMIT_MESSAGE, // Bot rate limit message
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56
});

export const rateLimiterBotDetector = (req: Request, res: Response, next: NextFunction) => {
    const crawlerDetector = new Crawler(req);
    if (crawlerDetector.isCrawler()) {
        return botLimiter(req, res, next);
    }

    return humanLimiter(req, res, next);
}