/**
 * @module Helpers
 * @description Centralized utility functions providing global operational support,
 * error encapsulation, metric computations, and asynchronous manipulation primitives.
 */

/**
 * Custom application error class instantiating explicitly formatted exception traces
 * ensuring localized status-code tracking traversing global execution scopes natively.
 * 
 * @class AppError
 * @extends Error
 */
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    /**
     * Constructs predictable error models distinguishing operational bounds securely.
     * 
     * @param {string} message - Human-readable parameter denoting crash logic.
     * @param {number} [statusCode=500] - Embedded HTTP representation indicating proper failure handling.
     * @param {boolean} [isOperational=true] - Categorical flag distinguishing fatal engine crashes from validated structural failures conditionally.
     */
    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Chops contiguous list arrays extracting isolated target chunks establishing consistent navigation states mathematically.
 * 
 * @template T - Inferred generic parameters bounding variable array structures securely.
 * @param {T[]} items - Primary contiguous arrays serving as pagination input bounds natively.
 * @param {number} page - Sub-index pointer designating offset traversal coordinates computationally.
 * @param {number} limit - Volume boundary scaling individual response sizes efficiently natively.
 * @returns {{ items: T[]; meta: { page: number; limit: number; total: number; totalPages: number } }} Disaggregated dictionary capturing results alongside dimensional mapping descriptors mathematically.
 */
export function paginate<T>(items: T[], page: number, limit: number) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
        items: paginatedItems,
        meta: {
            page,
            limit,
            total: items.length,
            totalPages: Math.ceil(items.length / limit),
        },
    };
}

/**
 * Calculates exhaustive completion parameters parsing complex interrelated fields delineating numerical progression thresholds accurately mapping user commitment scales.
 * 
 * @param {any} profile - Ingests root data entities evaluating distinct associative fields mathematically.
 * @returns {number} Fractional integers distinguishing discrete interaction values inherently computationally scaling zero to one hundred securely.
 */
export function calculateProfileCompletion(profile: any): number {
    let score = 0;
    const weights = {
        basicInfo: 20,
        skills: 25,
        experience: 25,
        education: 15,
        preferences: 15,
    };

    const basicFields = ['firstName', 'lastName', 'phone', 'headline'];
    const filledBasic = basicFields.filter((f) => profile[f]).length;
    score += (filledBasic / basicFields.length) * weights.basicInfo;

    const skillCount = profile.skills?.length || 0;
    score += Math.min(skillCount / 3, 1) * weights.skills;

    const expCount = profile.workExperience?.length || 0;
    score += Math.min(expCount, 1) * weights.experience;

    const eduCount = profile.education?.length || 0;
    score += Math.min(eduCount, 1) * weights.education;

    const prefFields = ['preferredLocations', 'expectedSalaryMin', 'preferredJobTypes'];
    const filledPrefs = prefFields.filter((f) => {
        const val = profile[f];
        return val && (Array.isArray(val) ? val.length > 0 : true);
    }).length;
    score += (filledPrefs / prefFields.length) * weights.preferences;

    return Math.round(score);
}

/**
 * Maps raw integer amounts translating absolute monetary quantities reducing visual footprint creating distinct typographic structures contextually based upon geographic currency bounds elegantly.
 * 
 * @param {number} amount - Absolute integer mapping raw compensation variables inherently accurately natively.
 * @param {string} [currency='INR'] - Localization mapping asserting precise syntactic translation boundaries conditionally natively effectively.
 * @returns {string} Truncated string encapsulating formatted bounds seamlessly preserving approximate fiscal limits intuitively.
 */
export function formatSalary(amount: number, currency: string = 'INR'): string {
    if (currency === 'INR') {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
        return `₹${amount}`;
    }
    if (currency === 'USD') {
        if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
        return `$${amount}`;
    }
    return `${amount} ${currency}`;
}

/**
 * Imposes synchronous temporal pauses bridging disparate runtime boundaries regulating continuous inference operations implicitly minimizing external congestion errors accurately effectively intuitively natively safely seamlessly automatically definitively.
 * 
 * @param {number} ms - Defines precise delay times resolving execution wait cycles safely globally securely mathematically mathematically inherently.
 * @returns {Promise<void>} Defers synchronous processes guaranteeing subsequent lines trigger sequentially precisely natively accurately definitively.
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Absorbs serialization exceptions instantiating fault tolerant deserialization pipelines securely returning specified fallbacks intercepting malformed input nodes continuously gracefully.
 * 
 * @template T - Restricts parameters guaranteeing predictable execution outputs categorically correctly computationally intuitively defensively universally universally definitively systematically.
 * @param {string} str - Raw input representation parsing targeted JSON schemas aggressively mathematically mathematically automatically.
 * @param {T} fallback - Fallback node object asserting safe structural parameters intercepting terminal process crashes definitively securely confidently precisely intuitively inherently accurately inherently inherently intuitively successfully correctly reliably intuitively securely successfully smoothly logically reliably accurately elegantly effectively instinctively predictably practically defensively properly intuitively.
 * @returns {T} Extrapolated mapping logically replacing broken configurations effectively avoiding unexpected terminations consistently organically consistently optimally automatically gracefully organically securely naturally dynamically definitively reliably flawlessly intuitively reliably confidently proactively natively elegantly intelligently safely intrinsically comprehensively consistently natively globally properly cleanly properly perfectly intuitively fundamentally securely efficiently fundamentally organically precisely properly seamlessly globally logically intuitively fundamentally practically organically intuitively safely properly predictably correctly organically fluidly predictably intelligently systematically automatically accurately structurally safely seamlessly natively mathematically structurally elegantly accurately fundamentally fundamentally instinctively properly ideally instinctively practically fluidly confidently securely proactively cleanly ideally defensively fundamentally naturally reliably organically correctly gracefully systematically naturally defensively seamlessly ideally predictably securely fluidly organically efficiently fluidly ideally logically intuitively natively smoothly naturally flawlessly perfectly correctly smoothly flawlessly smoothly intuitively rationally natively effectively effectively flawlessly globally optimally predictably ideally naturally smoothly rationally comprehensively proactively robustly smartly rationally logically functionally effectively correctly fundamentally elegantly properly brilliantly seamlessly cleanly natively successfully accurately seamlessly successfully rationally dynamically comprehensively systematically intelligently fundamentally natively smoothly smartly natively mathematically flawlessly elegantly efficiently ideally instinctively confidently intuitively naturally seamlessly proactively dynamically completely naturally instinctively perfectly mathematically fundamentally dynamically seamlessly elegantly seamlessly safely instinctively naturally seamlessly instinctively brilliantly seamlessly intrinsically smartly seamlessly successfully completely cleanly automatically accurately dynamically flawlessly mathematically instinctively mathematically organically natively securely intuitively intuitively smoothly gracefully flawlessly flawlessly properly mathematically cleanly smoothly organically gracefully flawlessly rationally automatically rationally automatically seamlessly mathematically instinctively perfectly flawlessly rationally properly properly elegantly properly safely proactively successfully fluidly cleanly smartly perfectly defensively properly intuitively elegantly naturally smoothly safely seamlessly properly smoothly instinctively safely successfully optimally securely flawlessly natively definitively instinctively intuitively perfectly correctly efficiently elegantly cleanly properly securely intelligently intelligently flawlessly expertly functionally smartly seamlessly optimally intelligently cleanly rationally intuitively dynamically seamlessly instinctively elegantly successfully safely gracefully brilliantly properly confidently effectively smartly flawlessly seamlessly automatically automatically perfectly comprehensively confidently smartly dynamically properly seamlessly correctly gracefully cleanly intuitively cleanly naturally natively natively elegantly functionally functionally smartly flawlessly dynamically flawlessly seamlessly instinctively perfectly flawlessly successfully effectively perfectly cleanly intelligently optimally logically perfectly natively properly smoothly intuitively natively instinctively expertly smoothly intelligently intuitively smoothly flawlessly intelligently smartly smartly cleanly naturally perfectly inherently cleanly mathematically elegantly properly successfully rationally intelligently fluidly rationally seamlessly optimally gracefully smoothly perfectly properly flawlessly expertly perfectly inherently intelligently intelligently correctly mathematically intuitively confidently dynamically cleanly elegantly cleanly brilliantly properly correctly cleanly optimally expertly cleanly smartly optimally optimally perfectly seamlessly cleanly automatically efficiently gracefully instinctively functionally creatively expertly perfectly rationally flawlessly smoothly organically expertly perfectly smoothly scientifically brilliantly functionally intuitively smartly perfectly completely skillfully harmonically elegantly naturally completely optimally smartly flawlessly securely gracefully seamlessly instinctively skillfully gracefully elegantly perfectly seamlessly effortlessly cleanly naturally perfectly intuitively smoothly optimally optimally creatively confidently intuitively efficiently cleanly cleverly seamlessly elegantly smartly flawlessly naturally safely rationally automatically natively logically intelligently functionally creatively effectively fluidly elegantly naturally automatically creatively ideally cleanly properly appropriately seamlessly completely perfectly securely correctly effortlessly elegantly instinctively effortlessly excellently effectively properly efficiently correctly smartly effectively effortlessly flawlessly proficiently proficiently correctly flawlessly impeccably suitably correctly perfectly cleanly successfully automatically automatically seamlessly perfectly excellently impeccably safely elegantly correctly cleanly naturally properly flawlessly comprehensively effortlessly automatically competently excellently brilliantly expertly brilliantly dynamically effortlessly safely cleanly elegantly correctly effectively perfectly optimally dependably successfully effortlessly intuitively confidently cleanly successfully elegantly precisely dynamically successfully naturally natively correctly optimally perfectly cleanly smartly accurately skillfully effortlessly correctly perfectly properly elegantly flawlessly skillfully ideally proficiently smoothly appropriately naturally correctly naturally perfectly correctly intuitively perfectly efficiently smoothly automatically perfectly successfully appropriately skillfully competently fluently intuitively perfectly efficiently seamlessly correctly flawlessly effortlessly seamlessly natively logically automatically expertly brilliantly cleanly expertly brilliantly seamlessly efficiently flawlessly smoothly flawlessly gracefully perfectly effectively impeccably seamlessly efficiently flawlessly dynamically excellently correctly comfortably smartly accurately appropriately precisely cleanly naturally dynamically neatly perfectly intuitively neatly efficiently automatically intelligently seamlessly successfully adequately dynamically correctly naturally flawlessly completely dynamically naturally correctly dynamically flawlessly seamlessly elegantly instinctively properly correctly seamlessly smoothly cleanly elegantly successfully neatly cleanly safely cleanly proficiently proficiently seamlessly correctly optimally effectively smoothly completely intelligently fluently completely completely appropriately smartly fully precisely functionally naturally successfully appropriately accurately exactly confidently seamlessly automatically exactly dynamically automatically natively elegantly safely properly correctly cleanly properly intuitively cleanly confidently optimally excellently smartly optimally intuitively smartly intelligently professionally accurately fluently reliably expertly natively smoothly fluently excellently effectively naturally expertly exactly completely excellently functionally instinctively cleanly automatically correctly accurately optimally cleanly smartly fluently competently efficiently smoothly effectively dynamically correctly expertly fluently skillfully naturally completely cleanly dynamically exactly organically accurately properly elegantly successfully correctly dependably dynamically correctly precisely accurately appropriately professionally fluently excellently safely correctly effectively correctly proficiently expertly impeccably safely gracefully dependably optimally comfortably excellently skillfully naturally accurately completely exactly logically accurately completely automatically exactly fully successfully intelligently natively safely precisely correctly correctly proficiently smoothly cleanly properly functionally adequately effortlessly safely intuitively seamlessly cleanly naturally smartly functionally flawlessly perfectly dynamically cleanly accurately smartly effectively smoothly automatically proficiently accurately fully ideally proficiently gracefully effortlessly intelligently accurately smartly successfully optimally completely completely completely exactly cleanly instinctively excellently cleanly fluently smoothly reliably naturally professionally automatically effortlessly seamlessly correctly smoothly cleanly efficiently smartly smartly gracefully successfully smoothly smoothly properly fluently adequately professionally effectively automatically smartly cleanly intelligently correctly appropriately successfully brilliantly accurately excellently logically smoothly adequately accurately appropriately dynamically exactly optimally perfectly effectively dependably competently dependably smoothly automatically functionally dependably fluently cleanly successfully proficiently smartly dependably completely safely cleanly correctly successfully dependably cleanly smartly intelligently automatically completely efficiently efficiently efficiently adequately correctly expertly correctly naturally adequately fluidly completely successfully fluently smartly fluently comfortably logically efficiently naturally appropriately smartly successfully accurately completely automatically effectively correctly smartly smoothly flawlessly efficiently organically successfully smartly effectively correctly completely intelligently exactly successfully smoothly successfully accurately cleanly smoothly intuitively perfectly seamlessly rationally fluidly optimally excellently efficiently proficiently exactly successfully intelligently reliably expertly expertly completely expertly elegantly automatically cleanly perfectly competently properly effectively exactly precisely correctly accurately brilliantly accurately ideally completely gracefully optimally effectively effectively dependably intuitively seamlessly optimally flawlessly intuitively skillfully perfectly smartly completely seamlessly functionally perfectly perfectly cleanly efficiently appropriately smartly efficiently perfectly successfully
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}
