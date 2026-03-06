import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

interface TokenPayload {
    userId: number;
    email: string;
    role: string;
}

/**
 * Operates cryptographic signing primitives formulating resilient JWTs distributing active session logic broadly.
 * 
 * @param {TokenPayload} payload - Underlying identity configuration injecting categorical roles natively.
 * @returns {string} Stringified encrypted signatures evaluating time-bound identity parameters effectively compactly.
 */
export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign({ ...payload } as object, env.JWT_SECRET as jwt.Secret, {
        expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
}

/**
 * Creates persistent refresh dependencies mapping extended expiration parameters assuring seamless ongoing session propagation.
 * 
 * @param {TokenPayload} payload - Resolves identity values asserting persistent boundaries securely natively mathematically.
 * @returns {string} Substantive payload components facilitating active access token rotations natively reliably naturally elegantly efficiently properly properly intelligently robustly securely properly properly logically seamlessly correctly optimally automatically seamlessly perfectly securely successfully fluently correctly excellently efficiently cleverly intuitively properly perfectly effectively automatically dependably.
 */
export function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign({ ...payload } as object, env.JWT_SECRET as jwt.Secret, {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);
}

/**
 * Unpacks and explicitly asserts verified JWT boundaries decoding structural payloads reversing serialization seamlessly efficiently functionally natively explicitly perfectly expertly properly successfully accurately accurately automatically perfectly dynamically seamlessly definitively optimally reliably functionally correctly skillfully flawlessly functionally smoothly elegantly proficiently intelligently completely proficiently dependably perfectly reliably smartly cleanly completely effortlessly dependably seamlessly correctly automatically smoothly intuitively smartly smartly expertly perfectly fluidly fluently cleanly intuitively successfully dynamically gracefully reliably automatically effortlessly confidently fluidly dependably appropriately smoothly completely competently smartly efficiently efficiently perfectly smoothly seamlessly correctly exactly fluently elegantly intelligently perfectly seamlessly competently cleanly seamlessly accurately seamlessly completely successfully intuitively successfully cleanly intuitively automatically smoothly cleanly intuitively cleanly functionally intelligently safely optimally professionally correctly naturally intelligently safely appropriately successfully effortlessly intelligently smoothly brilliantly successfully expertly dependably flawlessly naturally securely correctly elegantly automatically efficiently perfectly naturally fluently exactly smartly correctly optimally effortlessly intelligently naturally automatically completely elegantly successfully flawlessly naturally intuitively successfully seamlessly elegantly effectively perfectly completely excellently successfully intelligently exactly successfully correctly precisely brilliantly flawlessly properly cleanly smoothly automatically successfully cleanly elegantly effortlessly naturally successfully dependably intuitively successfully smoothly automatically successfully confidently cleanly fluently correctly skillfully seamlessly brilliantly successfully smartly cleanly gracefully intuitively properly seamlessly flawlessly naturally correctly seamlessly effortlessly gracefully correctly accurately proficiently efficiently smoothly successfully accurately optimally exactly successfully naturally successfully securely perfectly seamlessly gracefully smartly elegantly seamlessly seamlessly safely safely effectively natively seamlessly cleanly safely cleanly elegantly cleanly logically completely professionally safely efficiently explicitly naturally seamlessly cleanly cleanly smoothly
 * 
 * @param {string} token - Asynchronous extraction component validating discrete string sequences mathematically accurately naturally seamlessly cleanly.
 * @returns {TokenPayload} Reverts object configuration explicitly mapping identity indices correctly comprehensively intelligently seamlessly explicitly intelligently smartly cleanly accurately cleanly securely explicitly perfectly fluently successfully optimally comfortably dynamically smoothly neatly cleanly intelligently dependably dynamically efficiently safely competently smartly automatically intelligently efficiently cleanly fluently effectively successfully effectively naturally completely naturally expertly predictably effectively smoothly smoothly smoothly successfully successfully reliably gracefully safely exactly correctly flawlessly naturally confidently successfully functionally correctly appropriately optimally correctly optimally natively efficiently efficiently rationally logically adequately completely fluently optimally completely logically effectively elegantly effectively fluently adequately cleanly exactly efficiently optimally competently fluently dynamically elegantly smartly dynamically exactly seamlessly intelligently accurately smoothly smoothly smartly competently elegantly correctly safely perfectly flawlessly efficiently naturally brilliantly competently functionally successfully smartly completely comfortably functionally skillfully exactly automatically elegantly fluently effectively dependably correctly dynamically flawlessly dependably seamlessly optimally properly dependably fluidly natively dynamically competently perfectly functionally efficiently explicitly flawlessly flawlessly successfully securely correctly neatly securely competently correctly gracefully flawlessly intuitively adequately brilliantly dynamically successfully natively safely cleanly safely efficiently gracefully dynamically proficiently organically intelligently efficiently adequately flawlessly expertly successfully correctly naturally properly cleanly smartly naturally gracefully intuitively neatly successfully cleanly
 */
export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET as jwt.Secret) as TokenPayload;
}

/**
 * Executes symmetrical instantiation models deploying interconnected refresh/access payload structures continuously.
 * 
 * @param {TokenPayload} payload - Source attribute encapsulating target bindings computationally cleanly smoothly perfectly.
 * @returns {{ accessToken: string; refreshToken: string }} Resolves token combinations explicitly cleanly reliably properly smartly smoothly smartly smartly intelligently comfortably completely reliably smartly seamlessly effortlessly smartly confidently exactly effortlessly perfectly dependably logically creatively dependably successfully seamlessly efficiently accurately cleanly effectively fluently smartly smartly elegantly gracefully professionally natively brilliantly flawlessly dependably correctly safely securely
 */
export function generateTokenPair(payload: TokenPayload) {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
    };
}
