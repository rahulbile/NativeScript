export type Parsed<V> = { start: number, end: number, value: V };

// Values
export type ARGB = number;
export type URL = string;
export type Angle = number;
export interface Unit<T> {
    value: number;
    unit: string;
}
export type Length = Unit<"px" | "dip">;
export type Percentage = Unit<"%">;
export type LengthPercentage = Length | Percentage;
export type Keyword = string;
export interface ColorStop {
    argb: ARGB;
    offset?: LengthPercentage;
}
export interface LinearGradient {
    angle: number;
    colors: ColorStop[];
}
export interface Background {
    readonly color?: number;
    readonly image?: URL | LinearGradient;
    readonly repeat?: BackgroundRepeat;
    readonly position?: BackgroundPosition;
    readonly size?: BackgroundSize;
}
export type BackgroundRepeat = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
export type BackgroundSize = "auto" | "cover" | "contain" | {
    x: LengthPercentage,
    y: "auto" | LengthPercentage
}
export type HorizontalAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "center" | "bottom";
export interface HorizontalAlignWithOffset {
    readonly align: "left" | "right";
    readonly offset: LengthPercentage;
}
export interface VerticalAlignWithOffset {
    readonly align: "top" | "bottom";
    readonly offset: LengthPercentage
}
export interface BackgroundPosition {
    readonly x: HorizontalAlign | HorizontalAlignWithOffset;
    readonly y: VerticalAlign | VerticalAlignWithOffset;
}

const urlRegEx = /\s*url\((?:('|")([^\1]*)\1|([^\)]*))\)\s*/gy;
export function parseURL(text: string, start: number = 0): Parsed<URL> {
    urlRegEx.lastIndex = start;
    const result = urlRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = urlRegEx.lastIndex;
    const value: URL = result[2] || result[3];
    return { start, end, value };
}

const hexColorRegEx = /\s*#((?:[0-9A-F]{8})|(?:[0-9A-F]{6})|(?:[0-9A-F]{3}))\s*/giy;
export function parseHexColor(text: string, start: number = 0): Parsed<ARGB> {
    hexColorRegEx.lastIndex = start;
    const result = hexColorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = hexColorRegEx.lastIndex;
    let hex = result[1];
    let argb;
    if (hex.length === 8) {
        argb = parseInt("0x" + hex);
    } else if (hex.length === 6) {
        argb = parseInt("0xFF" + hex);
    } else if (hex.length === 3) {
        argb = parseInt("0xFF" + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]);
    }
    return { start, end, value: argb };
}

function rgbaToArgbNumber(r: number, g: number, b: number, a: number = 1): number | undefined {
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1) {
        return (Math.round(a * 0xFF) * 0x01000000) + (r * 0x010000) + (g * 0x000100) + (b * 0x000001);
    } else { 
        return null;
    }
}

const rgbColorRegEx = /\s*(rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\))/gy;
export function parseRGBColor(text: string, start: number = 0): Parsed<ARGB> {
    rgbColorRegEx.lastIndex = start;
    const result = rgbColorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = rgbColorRegEx.lastIndex;
    const value = result[1] && rgbaToArgbNumber(parseInt(result[2]), parseInt(result[3]), parseInt(result[4]));
    return { start, end, value };
}

const rgbaColorRegEx = /\s*(rgba\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*,\s*([01]?\.?\d*)\s*\))/gy;
export function parseRGBAColor(text: string, start: number = 0): Parsed<ARGB> {
    rgbaColorRegEx.lastIndex = start;
    const result = rgbaColorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = rgbaColorRegEx.lastIndex;
    const value = rgbaToArgbNumber(parseInt(result[2]), parseInt(result[3]), parseInt(result[4]), parseFloat(result[5]));
    return { start, end, value };
}

export enum colors {
    transparent = 0x00000000,
    aliceblue = 0xFFF0F8FF,
    antiquewhite = 0xFFFAEBD7,
    aqua = 0xFF00FFFF,
    aquamarine = 0xFF7FFFD4,
    azure = 0xFFF0FFFF,
    beige = 0xFFF5F5DC,
    bisque = 0xFFFFE4C4,
    black = 0xFF000000,
    blanchedalmond = 0xFFFFEBCD,
    blue = 0xFF0000FF,
    blueviolet = 0xFF8A2BE2,
    brown = 0xFFA52A2A,
    burlywood = 0xFFDEB887,
    cadetblue = 0xFF5F9EA0,
    chartreuse = 0xFF7FFF00,
    chocolate = 0xFFD2691E,
    coral = 0xFFFF7F50,
    cornflowerblue = 0xFF6495ED,
    cornsilk = 0xFFFFF8DC,
    crimson = 0xFFDC143C,
    cyan = 0xFF00FFFF,
    darkblue = 0xFF00008B,
    darkcyan = 0xFF008B8B,
    darkgoldenrod = 0xFFB8860B,
    darkgray = 0xFFA9A9A9,
    darkgreen = 0xFF006400,
    darkgrey = 0xFFA9A9A9,
    darkkhaki = 0xFFBDB76B,
    darkmagenta = 0xFF8B008B,
    darkolivegreen = 0xFF556B2F,
    darkorange = 0xFFFF8C00,
    darkorchid = 0xFF9932CC,
    darkred = 0xFF8B0000,
    darksalmon = 0xFFE9967A,
    darkseagreen = 0xFF8FBC8F,
    darkslateblue = 0xFF483D8B,
    darkslategray = 0xFF2F4F4F,
    darkslategrey = 0xFF2F4F4F,
    darkturquoise = 0xFF00CED1,
    darkviolet = 0xFF9400D3,
    deeppink = 0xFFFF1493,
    deepskyblue = 0xFF00BFFF,
    dimgray = 0xFF696969,
    dimgrey = 0xFF696969,
    dodgerblue = 0xFF1E90FF,
    firebrick = 0xFFB22222,
    floralwhite = 0xFFFFFAF0,
    forestgreen = 0xFF228B22,
    fuchsia = 0xFFFF00FF,
    gainsboro = 0xFFDCDCDC,
    ghostwhite = 0xFFF8F8FF,
    gold = 0xFFFFD700,
    goldenrod = 0xFFDAA520,
    gray = 0xFF808080,
    green = 0xFF008000,
    greenyellow = 0xFFADFF2F,
    grey = 0xFF808080,
    honeydew = 0xFFF0FFF0,
    hotpink = 0xFFFF69B4,
    indianred = 0xFFCD5C5C,
    indigo = 0xFF4B0082,
    ivory = 0xFFFFFFF0,
    khaki = 0xFFF0E68C,
    lavender = 0xFFE6E6FA,
    lavenderblush = 0xFFFFF0F5,
    lawngreen = 0xFF7CFC00,
    lemonchiffon = 0xFFFFFACD,
    lightblue = 0xFFADD8E6,
    lightcoral = 0xFFF08080,
    lightcyan = 0xFFE0FFFF,
    lightgoldenrodyellow = 0xFFFAFAD2,
    lightgray = 0xFFD3D3D3,
    lightgreen = 0xFF90EE90,
    lightgrey = 0xFFD3D3D3,
    lightpink = 0xFFFFB6C1,
    lightsalmon = 0xFFFFA07A,
    lightseagreen = 0xFF20B2AA,
    lightskyblue = 0xFF87CEFA,
    lightslategray = 0xFF778899,
    lightslategrey = 0xFF778899,
    lightsteelblue = 0xFFB0C4DE,
    lightyellow = 0xFFFFFFE0,
    lime = 0xFF00FF00,
    limegreen = 0xFF32CD32,
    linen = 0xFFFAF0E6,
    magenta = 0xFFFF00FF,
    maroon = 0xFF800000,
    mediumaquamarine = 0xFF66CDAA,
    mediumblue = 0xFF0000CD,
    mediumorchid = 0xFFBA55D3,
    mediumpurple = 0xFF9370DB,
    mediumseagreen = 0xFF3CB371,
    mediumslateblue = 0xFF7B68EE,
    mediumspringgreen = 0xFF00FA9A,
    mediumturquoise = 0xFF48D1CC,
    mediumvioletred = 0xFFC71585,
    midnightblue = 0xFF191970,
    mintcream = 0xFFF5FFFA,
    mistyrose = 0xFFFFE4E1,
    moccasin = 0xFFFFE4B5,
    navajowhite = 0xFFFFDEAD,
    navy = 0xFF000080,
    oldlace = 0xFFFDF5E6,
    olive = 0xFF808000,
    olivedrab = 0xFF6B8E23,
    orange = 0xFFFFA500,
    orangered = 0xFFFF4500,
    orchid = 0xFFDA70D6,
    palegoldenrod = 0xFFEEE8AA,
    palegreen = 0xFF98FB98,
    paleturquoise = 0xFFAFEEEE,
    palevioletred = 0xFFDB7093,
    papayawhip = 0xFFFFEFD5,
    peachpuff = 0xFFFFDAB9,
    peru = 0xFFCD853F,
    pink = 0xFFFFC0CB,
    plum = 0xFFDDA0DD,
    powderblue = 0xFFB0E0E6,
    purple = 0xFF800080,
    red = 0xFFFF0000,
    rosybrown = 0xFFBC8F8F,
    royalblue = 0xFF4169E1,
    saddlebrown = 0xFF8B4513,
    salmon = 0xFFFA8072,
    sandybrown = 0xFFF4A460,
    seagreen = 0xFF2E8B57,
    seashell = 0xFFFFF5EE,
    sienna = 0xFFA0522D,
    silver = 0xFFC0C0C0,
    skyblue = 0xFF87CEEB,
    slateblue = 0xFF6A5ACD,
    slategray = 0xFF708090,
    slategrey = 0xFF708090,
    snow = 0xFFFFFAFA,
    springgreen = 0xFF00FF7F,
    steelblue = 0xFF4682B4,
    tan = 0xFFD2B48C,
    teal = 0xFF008080,
    thistle = 0xFFD8BFD8,
    tomato = 0xFFFF6347,
    turquoise = 0xFF40E0D0,
    violet = 0xFFEE82EE,
    wheat = 0xFFF5DEB3,
    white = 0xFFFFFFFF,
    whitesmoke = 0xFFF5F5F5,
    yellow = 0xFFFFFF00,
    yellowgreen = 0xFF9ACD32
};

export function parseColorKeyword(value, start: number, keyword = parseKeyword(value, start)): Parsed<ARGB> {
    if (keyword && keyword.value in colors) {
        const end = keyword.end;
        const value = colors[keyword.value];
        return { start, end, value };
    }
    return null;
}

export function parseColor(value: string, start: number = 0, keyword = parseKeyword(value, start)): Parsed<ARGB> {
    return parseHexColor(value, start) || parseColorKeyword(value, start, keyword) || parseRGBColor(value, start) || parseRGBAColor(value, start);
}

const keywordRegEx = /\s*([a-z][\w\-]*)\s*/giy;
function parseKeyword(text: string, start: number = 0): Parsed<Keyword> {
    keywordRegEx.lastIndex = start;
    const result = keywordRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = keywordRegEx.lastIndex;
    const value = result[1];
    return { start, end, value }
}

const backgroundRepeatKeywords = new Set([ "repeat", "repeat-x", "repeat-y", "no-repeat" ]);
export function parseRepeat(value: string, start: number = 0, keyword = parseKeyword(value, start)): Parsed<BackgroundRepeat> {
    if (keyword && backgroundRepeatKeywords.has(keyword.value)) {
        const end = keyword.end;
        const value = <BackgroundRepeat>keyword.value;
        return { start, end, value };
    }
    return null;
}

const unitRegEx = /\s*([\+\-]?(?:\d+\.\d+|\d+|\.\d+)(?:[eE][\+\-]?\d+)?)([a-zA-Z]+|%)?\s*/gy;
export function parseUnit(text: string, start: number = 0): Parsed<Unit<string>> {
    unitRegEx.lastIndex = start;
    const result = unitRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = unitRegEx.lastIndex;
    const value = parseFloat(result[1]);
    const unit = <any>result[2] || "dip";
    return { start, end, value: { value, unit }};
}

export function parsePercentageOrLength(text: string, start: number = 0): Parsed<LengthPercentage> {
    const unitResult = parseUnit(text, start);
    if (unitResult) {
        const { start, end } = unitResult;
        const value = <LengthPercentage>unitResult.value;
        if (value.unit === "%") {
            value.value /= 100;
        } else if (!value.unit) {
            value.unit = "dip";
        } else if (value.unit === "px" || value.unit === "dip") {
        } else {
            return null;
        }
        return { start, end, value };
    }
    return null;
}

const angleUnitsToRadMap: { [unit: string]: (start: number, end: number, value: number) => Parsed<Angle> } = {
    "deg": (start: number, end: number, deg: number) => ({ start, end, value: deg / 180 * Math.PI }),
    "rad": (start: number, end: number, rad: number) => ({ start, end, value: rad }),
    "grad": (start: number, end: number, grad: number) => ({ start, end, value: grad / 200 * Math.PI }),
    "turn": (start: number, end: number, turn: number) => ({ start, end, value: turn * Math.PI * 2 })
}
export function parseAngle(value: string, start: number = 0): Parsed<Angle> {
    const angleResult = parseUnit(value, start);
    if (angleResult) {
        const { start, end, value } = angleResult;
        return (angleUnitsToRadMap[value.unit] || (() => null))(start, end, value.value);
    }
    return null;
}

const backgroundSizeKeywords = new Set(["auto", "contain", "cover"]);
export function parseBackgroundSize(value: string, start: number = 0, keyword = parseKeyword(value, start)): Parsed<BackgroundSize> {
    let end = start;
    if (keyword && backgroundSizeKeywords.has(keyword.value)) {
        end = keyword.end;
        const value = <"auto" | "cover" | "contain">keyword.value;
        return { start, end, value };
    }

    // Parse one or two lengths... the other will be "auto"
    const firstLength = parsePercentageOrLength(value, end);
    if (firstLength) {
        end = firstLength.end;
        const secondLength = parsePercentageOrLength(value, firstLength.end);
        if (secondLength) {
            end = secondLength.end;
            return { start, end, value: { x: firstLength.value, y: secondLength.value }};
        } else {
            return { start, end, value: { x: firstLength.value, y: "auto" }};
        }
    }
    return null;
}

const backgroundPositionKeywords = Object.freeze(new Set([ "left", "right", "top", "bottom", "center" ]));
const backgroundPositionKeywordsDirection: {[align: string]: "x" | "center" | "y" } = {
    "left": "x",
    "right": "x",
    "center": "center",
    "top": "y",
    "bottom": "y"
}
export function parseBackgroundPosition(text: string, start: number = 0, keyword = parseKeyword(text, start)): Parsed<BackgroundPosition> {
    function formatH(align: Parsed<HorizontalAlign>, offset: Parsed<LengthPercentage>) {
        if (align.value === "center") return "center";
        if (offset && offset.value.value !== 0) return { align: align.value, offset: offset.value };
        return align.value;
    }
    function formatV(align: Parsed<VerticalAlign>, offset: Parsed<LengthPercentage>) {
        if (align.value === "center") return "center";
        if (offset && offset.value.value !== 0) return { align: align.value, offset: offset.value };
        return align.value;
    }
    let end = start;
    if (keyword && backgroundPositionKeywords.has(keyword.value)) {
        end = keyword.end;
        let firstDirection = backgroundPositionKeywordsDirection[keyword.value];

        const firstLength = firstDirection != "center" && parsePercentageOrLength(text, end);
        if (firstLength) {
            end = firstLength.end;
        }

        const secondKeyword = parseKeyword(text, end);
        if (secondKeyword && backgroundPositionKeywords.has(secondKeyword.value)) {
            end = secondKeyword.end;
            let secondDirection = backgroundPositionKeywordsDirection[secondKeyword.end];

            if (firstDirection === secondDirection && firstDirection !== "center") {
                return null; // Reject pair of both horizontal or both vertical alignments.
            }

            const secondLength = secondDirection != "center" && parsePercentageOrLength(text, end);
            if (secondLength) {
                end = secondLength.end;
            }

            if ((firstDirection === secondDirection && secondDirection === "center") || (firstDirection === "x" || secondDirection === "y")) {
                return { start, end, value: {
                    x: formatH(<Parsed<HorizontalAlign>>keyword, firstLength),
                    y: formatV(<Parsed<VerticalAlign>>secondKeyword, secondLength)
                }};
            } else {
                return { start, end, value: {
                    x: formatH(<Parsed<HorizontalAlign>>secondKeyword, secondLength),
                    y: formatV(<Parsed<VerticalAlign>>keyword, firstLength),
                }};
            }
        } else {
            if (firstDirection === "center") {
                return { start, end, value: { x: "center", y: "center" }};
            } else if (firstDirection === "x") {
                return { start, end, value: { x: formatH(<Parsed<HorizontalAlign>>keyword, firstLength), y: "center" }};
            } else {
                return { start, end, value: { x: "center", y: formatV(<Parsed<VerticalAlign>>keyword, firstLength) }};
            }
        }
    } else {
        const firstLength = parsePercentageOrLength(text, end);
        if (firstLength) {
            end = firstLength.end;
            const secondLength = parsePercentageOrLength(text, end);
            if (secondLength) {
                end = secondLength.end;
                return { start, end, value: { x: { align: "left", offset: firstLength.value }, y: { align: "top", offset: secondLength.value }}};
            } else {
                return { start, end, value: { x: { align: "left", offset: firstLength.value }, y: "center" }};
            }
        } else {
            return null;
        }
    }
}

const directionRegEx = /\s*to\s*(left|right|top|bottom)\s*(left|right|top|bottom)?\s*/gy;
const sideDirections = {
    top: Math.PI * 0/2,
    right: Math.PI * 1/2,
    bottom: Math.PI * 2/2,
    left: Math.PI * 3/2
}
const cornerDirections = {
    top: {
        right: Math.PI * 1/4,
        left: Math.PI * 7/4
    },
    right: {
        top: Math.PI * 1/4,
        bottom: Math.PI * 3/4
    },
    bottom: {
        right: Math.PI * 3/4,
        left: Math.PI * 5/4
    },
    left: {
        top: Math.PI * 7/4,
        bottom: Math.PI * 5/4
    }
}
function parseDirection(text: string, start: number = 0): Parsed<Angle> {
    directionRegEx.lastIndex = start;
    const result = directionRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = directionRegEx.lastIndex;
    const firstDirection = result[1];
    if (result[2]) {
        const secondDirection = result[2];
        const value = cornerDirections[firstDirection][secondDirection];
        return value === undefined ? null : { start, end, value };
    } else {
        return { start, end, value: sideDirections[firstDirection] }
    }
}

const openingBracketRegEx = /\s*\(\s*/gy;
const closingBracketRegEx = /\s*\)\s*/gy;
const closingBracketOrCommaRegEx = /\s*(\)|,)\s*/gy;
function parseArgumentsList<T>(text: string, start: number, argument: (value: string, lastIndex: number, index: number) => Parsed<T>): Parsed<Parsed<T>[]> {
    openingBracketRegEx.lastIndex = start;
    const openingBracket = openingBracketRegEx.exec(text);
    if (!openingBracket) {
        return null;
    }
    let end = openingBracketRegEx.lastIndex;
    const value: Parsed<T>[] = [];

    closingBracketRegEx.lastIndex = end;
    const closingBracket = closingBracketRegEx.exec(text);
    if (closingBracket) {
        return { start, end, value };
    }

    for(var index = 0; true; index++) {
        const arg = argument(text, end, index);
        if (!arg) {
            return null;
        }
        end = arg.end;
        value.push(arg);
        
        closingBracketOrCommaRegEx.lastIndex = end;
        const closingBracketOrComma = closingBracketOrCommaRegEx.exec(text);
        if (closingBracketOrComma) {
            end = closingBracketOrCommaRegEx.lastIndex;
            if (closingBracketOrComma[1] === ",") {
                continue;
            } else if (closingBracketOrComma[1] === ")") {
                return { start, end, value };
            }
        } else {
            return null;
        }
    }
}

export function parseColorStop(text: string, start: number = 0): Parsed<ColorStop> {
    const color = parseColor(text, start);
    if (!color) {
        return null;
    }
    let end = color.end;
    const offset = parsePercentageOrLength(text, end);
    if (offset) {
        end = offset.end;
        return { start, end, value: { argb: color.value, offset: offset.value }};
    }
    return { start, end, value: { argb: color.value }};
}

const linearGradientStartRegEx = /\s*linear-gradient\s*/gy;
export function parseLinearGradient(text: string, start: number = 0): Parsed<LinearGradient> {
    linearGradientStartRegEx.lastIndex = start;
    const lgs = linearGradientStartRegEx.exec(text);
    if (!lgs) {
        return null;
    }
    let end = linearGradientStartRegEx.lastIndex;

    let angle = Math.PI;
    const colors: ColorStop[] = [];

    const parsedArgs = parseArgumentsList<Angle | ColorStop>(text, end, (text, start, index) => {
        if (index === 0) {
            // First arg can be gradient direction
            const angleArg = parseAngle(text, start) || parseDirection(text, start);
            if (angleArg) {
                angle = angleArg.value;
                return angleArg;
            }
        }

        const colorStop = parseColorStop(text, start);
        if (colorStop) {
            colors.push(colorStop.value);
            return colorStop;
        }

        return null;
    });
    if (!parsedArgs) {
        return null;
    }
    end = parsedArgs.end;

    return { start, end, value: { angle, colors }};
}

const slashRegEx = /\s*(\/)\s*/gy;
function parseSlash(text: string, start: number): Parsed<"/"> {
    slashRegEx.lastIndex = start;
    const slash = slashRegEx.exec(text);
    if (!slash) {
        return null;
    }
    const end = slashRegEx.lastIndex;
    return { start, end, value: "/" };
}

export function parseBackground(text: string, start: number = 0): Parsed<Background> {
    const value: any = {};
    let end = start;
    while(end < text.length) {
        const keyword = parseKeyword(text, end);
        const color = parseColor(text, end, keyword);
        if (color) {
            value.color = color.value;
            end = color.end;
            continue;
        }
        const repeat = parseRepeat(text, end, keyword);
        if (repeat) {
            value.repeat = repeat.value;
            end = repeat.end;
            continue;
        }
        const position = parseBackgroundPosition(text, end, keyword);
        if (position) {
            value.position = position.value;
            end = position.end;

            const slash = parseSlash(text, end);
            if (slash) {
                end = slash.end;
                const size = parseBackgroundSize(text, end);
                if (!size) {
                    // Found / but no proper size following
                    return null;
                }
                value.size = size.value;
                end = size.end;
            }
            continue;
        }

        const url = parseURL(text, end);
        if (url) {
            value.image = url.value;
            end = url.end;
            continue;
        }
        const gradient = parseLinearGradient(text, end);
        if (gradient) {
            value.image = gradient.value;
            end = gradient.end;
            continue;
        }

        return null;
    }
    return { start, end, value };
}

// Selectors

export type Combinator = "+" | "~" | ">" | " ";

export interface UniversalSelector {
    type: "*";
}
export interface TypeSelector {
    type: "";
    identifier: string;
}
export interface ClassSelector {
    type: ".";
    identifier: string;
}
export interface IdSelector {
    type: "#";
    identifier: string;
}
export interface PseudoClassSelector {
    type: ":";
    identifier: string;
}
export type AttributeSelectorTest = "=" | "^=" | "$=" | "*=" | "=" | "~=" | "|=";
export interface AttributeSelector {
    type: "[]";
    property: string;
    test?: AttributeSelectorTest;
    value?: string;
}

export type SimpleSelector = UniversalSelector | TypeSelector | ClassSelector | IdSelector | PseudoClassSelector | AttributeSelector;
export type SimpleSelectorSequence = SimpleSelector[];
export type Selector = [SimpleSelectorSequence, Combinator];

const universalSelectorRegEx = /\*/gy;
export function parseUniversalSelector(text: string, start: number = 0): Parsed<UniversalSelector> {
    universalSelectorRegEx.lastIndex = start;
    const result = universalSelectorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = universalSelectorRegEx.lastIndex;
    return { start, end, value: { type: "*" }};
}

const simpleIdentifierSelectorRegEx = /(#|\.|:|\b)([_-\w][_-\w\d]*)/gy;
export function parseSimpleIdentifierSelector(text: string, start: number = 0): Parsed<TypeSelector | ClassSelector | IdSelector | PseudoClassSelector> {
    simpleIdentifierSelectorRegEx.lastIndex = start;
    const result = simpleIdentifierSelectorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = simpleIdentifierSelectorRegEx.lastIndex;
    const type = <"#" | "." | ":" | "">result[1];
    const identifier: string = result[2];
    const value = <TypeSelector | ClassSelector | IdSelector | PseudoClassSelector>{ type, identifier };
    return { start, end, value };
}

const attributeSelectorRegEx = /\[\s*([_-\w][_-\w\d]*)\s*(?:(=|\^=|\$=|\*=|\~=|\|=)\s*(?:([_-\w][_-\w\d]*)|"((?:[^\\"]|\\(?:"|n|r|f|\\|0-9a-f))*)"|'((?:[^\\']|\\(?:'|n|r|f|\\|0-9a-f))*)')\s*)?\]/gy;
export function parseAttributeSelector(text: string, start: number): Parsed<AttributeSelector> {
    attributeSelectorRegEx.lastIndex = start;
    const result = attributeSelectorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = attributeSelectorRegEx.lastIndex;
    const property = result[1];
    if (result[2]) {
        const test = <AttributeSelectorTest>result[2];
        const value = result[3] || result[4] || result[5];
        return { start, end, value: { type: "[]", property, test, value }};
    }
    return { start, end, value: { type: "[]", property }};
}

export function parseSimpleSelector(text: string, start: number = 0): Parsed<SimpleSelector> {
    return parseUniversalSelector(text, start) ||
        parseSimpleIdentifierSelector(text, start) ||
        parseAttributeSelector(text, start);
}

export function parseSimpleSelectorSequence(text: string, start: number): Parsed<SimpleSelector[]> {
    let simpleSelector = parseSimpleSelector(text, start);
    if (!simpleSelector) {
        return null;
    }
    let end = simpleSelector.end;
    let value = <SimpleSelectorSequence>[];
    while(simpleSelector) {
        value.push(simpleSelector.value);
        end = simpleSelector.end;
        simpleSelector = parseSimpleSelector(text, end);
    }
    return { start, end, value }
}

const combinatorRegEx = /\s*(\+|~|>)?\s*/gy;
export function parseCombinator(text: string, start: number = 0): Parsed<Combinator> {
    combinatorRegEx.lastIndex = start;
    const result = combinatorRegEx.exec(text);
    if (!result) {
        return null;
    }
    const end = combinatorRegEx.lastIndex;
    const value = <Combinator>result[1] || " ";
    return { start, end, value }
}

const whiteSpaceRegEx = /\s*/gy;
export function parseSelector(text: string, start: number = 0): Parsed<Selector> {
    let end = start;
    whiteSpaceRegEx.lastIndex = end;
    const leadingWhiteSpace = whiteSpaceRegEx.exec(text);
    if (leadingWhiteSpace) {
        end = whiteSpaceRegEx.lastIndex;
    }
    let value = <Selector>[];
    let combinator: Parsed<Combinator>;
    let expectSimpleSelector = true; // Must have at least one
    do {
        const simpleSelectorSequence = parseSimpleSelectorSequence(text, end);
        if (!simpleSelectorSequence) {
            if (expectSimpleSelector) {
                return null;
            } else {
                break;
            }
        }
        end = simpleSelectorSequence.end;
        if (combinator) {
            value.push(combinator.value);
        }
        value.push(simpleSelectorSequence.value);
        combinator = parseCombinator(text, end);
        if (combinator) {
            end = combinator.end;
        }
        expectSimpleSelector = combinator && combinator.value !== " "; // Simple selector must follow non trailing white space combinator
    } while(combinator);
    value.push(undefined);
    return { start, end, value };
}

export interface Stylesheet {
    rules: Rule[];
}
export interface AtRule {
    identifier: string;
    prelude?: string;
    block?: any;
}
export interface QualifiedRule {}
export type Rule = QualifiedRule | AtRule;

const whitespaceRegEx = /[\s\t\n\r\f]*/gym;
const stringRegEx = /(\"|\')(?:[^\n\r\f\\\1]|\\(?:\$|\n|[0-9a-fA-F]{1,6}\s?))*(:?\1|$)/gym; // Besides $n, parse escape codes
const commentRegEx = /(\/\*(?:[^\*]|\*[^\/])*\*\/)/gym;
const numberRegEx = /[\+\-]?(?:\d+\.\d+|\d+|\.\d+)(?:[eE][\+\-]?\d+)?/gym;
const nameRegEx = /-?(?:(?:[a-zA-Z_]|[^\x00-\x7F]|\\(?:\$|\n|[0-9a-fA-F]{1,6}\s?))(?:[a-zA-Z_0-9\-]*|\\(?:\$|\n|[0-9a-fA-F]{1,6}\s?))*)/gym;
const nonQuoteURLRegEx = /(:?[^\)\s\t\n\r\f\'\"\(]|\\(?:\$|\n|[0-9a-fA-F]{1,6}\s?))*/gym; // non-printable code point, left out

type TokenType = "<whitespace-token>" | "<string-token>" | "<suffix-match-token>" | "<delim-token>" | "<(-token>" | "<)-token>" | "<substring-match-token>" | "<number-token>" | "<percentage-token>" | "<dimension-token>" | "<ident-token>" | "<comma-token>" | "<CDC-token>" | "<url-token>" | "<function-token>" | "<{-token>" | "<}-token>" | "<[-token>" | "<]-token>" | "<simple-block>" | "<comment-token>" | "<colon-token>" | "<semicolon-token>" | "<CDO-token>" | "<at-keyword-token>" | "<prefix-match-token>" | "<dash-match-token>" | "<include-match-token>" | "<EOF-token>" | "<hash-token>";

interface InputToken {
    type: TokenType;
    text: string;
}

interface FunctionInputToken extends InputToken {
    components: any[];
}

interface SimpleBlock extends InputToken {
    associatedToken: InputToken;
    values: any[];
}

export class CSSParser {
    /**
     * The code-point in the stream that has not yet been consumed.
     */
    private nextInputCodePointIndex = 0;
    private currentInputTokenShouldBeReconsumed = false;
    private currentInputToken: InputToken;

    constructor(private text: string) {}

    tokenize(): InputToken[] {
        let tokens: InputToken[] = [];
        let inputToken: InputToken;
        do {
            inputToken = this.consumeAToken();
            tokens.push(inputToken);
        } while(inputToken === null || inputToken.type != "<EOF-token>");
        return tokens;
    }

    /**
     * https://www.w3.org/TR/css-syntax-3/#consume-a-token
     */
    consumeAToken(): InputToken {
        let lastIndex = this.nextInputCodePointIndex;
        this.currentInputToken = this.consumeATokenInternal();
        if (!this.currentInputToken) {
            console.log("Null token!");
            let message = "Unsupported scenario at: " + lastIndex + " : " + this.nextInputCodePointIndex + ", near: " + this.text.substr(lastIndex, 100);
            throw new Error(message);
        }
        return this.currentInputToken;
    }
    consumeATokenInternal(): InputToken {
        const codepoint = this.text[this.nextInputCodePointIndex];
        let result: RegExpExecArray;
        switch(codepoint) {
            case " ":
            case "\t":
            case "\n":
            case "\r":
            case "\f":
                return this.consumeAWhitespace();
            case "\"":
                return this.consumeAStringToken();
            case "#":
                // TODO:
                this.nextInputCodePointIndex++;
                let hashName = this.consumeAName();
                if (hashName) {
                    return { type: "<hash-token>", text: hashName.text };
                } else {
                    this.nextInputCodePointIndex--;
                    return this.consumeADelimToken();
                }
            case "$":
                if (this.text[this.nextInputCodePointIndex + 1] === "=") {
                    this.nextInputCodePointIndex += 2;
                    return { type: "<suffix-match-token>", text: "$=" };
                } else {
                    return this.consumeADelimToken();
                }
            case "$":
                // TODO:
                throw new Error("Not implemented!");
            case "'":
                return this.consumeAStringToken();
            case "(":
                this.nextInputCodePointIndex++;
                return { type: "<(-token>", text: "{" };
            case ")":
                this.nextInputCodePointIndex++;
                return { type: "<)-token>", text: "{" };
            case "*":
                if (this.text[this.nextInputCodePointIndex + 1] === "=") {
                    this.nextInputCodePointIndex += 2;
                    return { type: "<substring-match-token>", text: "*=" };
                } else {
                    return this.consumeADelimToken();
                }
            case "+":
                return this.consumeANumericToken() || this.consumeADelimToken();
            case ",":
                this.nextInputCodePointIndex++;
                return { type: "<comma-token>", text: "," };
            case "-":
                return this.consumeANumericToken() || this.consumeAnIdentLikeToken() || this.consumeCDC() || this.consumeADelimToken();
            case ".":
                return this.consumeANumericToken() || this.consumeADelimToken();
            case "/":
                if (this.text[this.nextInputCodePointIndex + 1] === "*") {
                    this.consumeAComment();
                    return this.consumeAToken();
                } else {
                    this.consumeADelimToken();
                }
            case ":":
                this.nextInputCodePointIndex++;
                return { type: "<colon-token>", text: ":" };
            case ";":
                this.nextInputCodePointIndex++;
                return { type: "<semicolon-token>", text: ";" };
            case "<":
                if (this.text.substr(this.nextInputCodePointIndex, 3) === "!--") {
                    this.nextInputCodePointIndex += 3;
                    return { type: "<CDO-token>", text: "!--" };
                } else {
                    return this.consumeADelimToken();
                }
            case "@":
                this.nextInputCodePointIndex++;
                let name = this.consumeAName();
                if (name) {
                    return { type: "<at-keyword-token>", text: name.text };
                } else {
                    this.nextInputCodePointIndex--;
                    return this.consumeADelimToken();
                }
            case "[":
                this.nextInputCodePointIndex++;
                return { type: "<[-token>", text: "[" };
            case "\\":
                // TODO: Only if this is valid escape, otherwise it is a parse error.
                let ident = this.consumeAnIdentLikeToken();
                if (ident) {
                    return ident;
                } else {
                    // error
                    return this.consumeADelimToken();
                }
            case "]":
                this.nextInputCodePointIndex++;
                return { type: "<]-token>", text: "]" };
            case "^":
                if (this.text[this.nextInputCodePointIndex + 1] === "=") {
                    this.nextInputCodePointIndex += 2;
                    return { type: "<prefix-match-token>", text: "^=" };
                }
                return this.consumeADelimToken();
            case "{":
                this.nextInputCodePointIndex++;
                return { type: "<{-token>", text: "{" };
            case "}":
                this.nextInputCodePointIndex++;
                return { type: "<}-token>", text: "}" };
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                return this.consumeANumericToken();
            case "u":
            case "U":
                if (this.text[this.nextInputCodePointIndex + 1] === "+") {
                    const thirdChar = this.text[this.nextInputCodePointIndex + 2];
                    if (thirdChar >= '0' && thirdChar <= '9' || thirdChar === "?") {
                        // TODO: Handle unicode stuff such as U+002B
                        throw new Error("Unicode tokens not supported!");
                    }
                }
                return this.consumeADelimToken();
            case "|":
                if (this.text[this.nextInputCodePointIndex + 1] === "=") {
                    this.nextInputCodePointIndex += 2;
                    return { type: "<dash-match-token>", text: "|=" };
                } else {
                    return this.consumeADelimToken();
                }
            case "~":
                if (this.text[this.nextInputCodePointIndex + 1] === "=") {
                    this.nextInputCodePointIndex += 2;
                    return { type: "<include-match-token>", text: "~=" };
                } else {
                    return this.consumeADelimToken();
                }
            case undefined:
                return { type: "<EOF-token>", text: undefined };
            default:
                return this.consumeAName() // name-start code point
                    || this.consumeADelimToken();
        }
    }

    private consumeADelimToken(): InputToken {
        // TODO: Count these, if they are created a lot, try to condense them!
        return { type: "<delim-token>", text: this.text[this.nextInputCodePointIndex++] };
    }

    private consumeAWhitespace(): InputToken {
        whitespaceRegEx.lastIndex = this.nextInputCodePointIndex;
        const result = whitespaceRegEx.exec(this.text);
        this.nextInputCodePointIndex = whitespaceRegEx.lastIndex;
        return { type: "<whitespace-token>", text: result[0] };
    }

    private consumeAStringToken(): InputToken {
        stringRegEx.lastIndex = this.nextInputCodePointIndex;
        const result = stringRegEx.exec(this.text);
        if (!result) {
            return null;
        }
        this.nextInputCodePointIndex = stringRegEx.lastIndex;
        // TODO: Handle bad-string.
        // TODO: Perform string escaping.
        return { type: "<string-token>", text: result[0] };
    }

    private consumeANumericToken(): InputToken {
        numberRegEx.lastIndex = this.nextInputCodePointIndex;
        const result = numberRegEx.exec(this.text);
        if (!result) {
            return null;
        }
        this.nextInputCodePointIndex = numberRegEx.lastIndex;
        if (this.text[this.nextInputCodePointIndex] === "%") {
            return { type: "<percentage-token>", text: result[0] }; // TODO: Push the actual number and unit here...
        }

        const name = this.consumeAName();
        if (name) {
            return { type: "<dimension-token>", text: result[0] + name.text };
        }

        return { type: "<number-token>", text: result[0] };
    }

    private consumeAName(): InputToken {
        nameRegEx.lastIndex = this.nextInputCodePointIndex;
        const result = nameRegEx.exec(this.text);
        if (!result) {
            return null;
        }
        this.nextInputCodePointIndex = nameRegEx.lastIndex;
        // TODO: Perform string escaping.
        return { type: "<ident-token>", text: result[0] };
    }

    private consumeAnIdentLikeToken(): InputToken {
        const name = this.consumeAName();
        if (!name) {
            return null;
        }
        if (name.text.toLowerCase() === "url") {
            return this.consumeAnURLToken();
        }
        if (this.text[this.nextInputCodePointIndex] === "(") {
            this.nextInputCodePointIndex++;
            return this.consumeAFunction(name.text);
        }
        return name;
    }

    private consumeCDC(): InputToken {
        if (this.text.substr(this.nextInputCodePointIndex, 3) === "-->") {
            return { type: "<CDC-token>", text: "-->" };
        }
    }

    private consumeAnURLToken(): InputToken {
        const urlToken: InputToken = { type: "<url-token>", text: undefined };
        this.consumeAWhitespace();
        if (this.nextInputCodePointIndex >= this.text.length) {
            return urlToken;
        }
        const nextInputCodePoint = this.text[this.nextInputCodePointIndex];
        if (nextInputCodePoint === "\"" || nextInputCodePoint === "'") {
            const stringToken = this.consumeAStringToken();
            // TODO: Handle bad-string.
            // TODO: Set value instead.
            urlToken.text = stringToken.text;
            this.consumeAWhitespace();
            if (this.text[this.nextInputCodePointIndex] === ")" || this.nextInputCodePointIndex >= this.text.length) {
                this.nextInputCodePointIndex++;
                return urlToken;
            } else {
                // TODO: Handle bad-url.
                return null;
            }
        }
        nonQuoteURLRegEx.lastIndex = this.nextInputCodePointIndex;
        const urlText = nonQuoteURLRegEx.exec(this.text);
        if (urlText) {
            this.nextInputCodePointIndex = nonQuoteURLRegEx.lastIndex;
            // TODO: Set value instead.
            // TODO: Handle escaping.
            urlToken.text = urlText[0];
        }
        this.consumeAWhitespace();
        if (this.text[this.nextInputCodePointIndex] === ")" || this.nextInputCodePointIndex >= this.text.length) {
            this.nextInputCodePointIndex++;
            return urlToken;
        } else {
            return null;
            // TODO: Handle bad-url.
        }
    }

    private consumeAFunction(name: string): InputToken {
        const funcToken: FunctionInputToken = { type: "<function-token>", text: undefined, components: [] };
        do {
            if (this.nextInputCodePointIndex >= this.text.length) {
                return funcToken;
            }
            switch(this.text[this.nextInputCodePointIndex]) {
                case ")":
                    this.nextInputCodePointIndex++;
                    return funcToken;
                default:
                    const component = this.consumeAComponentValue();
                    if (component) {
                        funcToken.components.push(component);
                    }
                    // TODO: Else we won't advance
            }
        } while(true);
    }

    private consumeAComponentValue(): InputToken {
        const token = this.consumeAToken();
        switch(token.type) {
            case "<{-token>":
            case "<[-token>":
            case "<(-token>":
                return this.consumeASimpleBlock();
            case "<function-token>":
                return this.consumeAFunction(token.text);
            default:
                return token;
        }
    }

    private consumeASimpleBlock(): SimpleBlock {
        const endianToken: "<]-token>" | "<}-token>" | "<)-token>" = {
            "<[-token>": "<]-token>",
            "<{-token>": "<}-token>",
            "<(-token>": "<)-token>"
        }[this.currentInputToken.type];
        const block: SimpleBlock = {
            type: "<simple-block>",
            text: undefined,
            associatedToken: this.currentInputToken,
            values: []
        };
        do {
            if (this.nextInputCodePointIndex >= this.text.length) {
                return block;
            }
            const token = this.consumeAToken();
            if (token.type === endianToken) {
                return block;
            }
            this.reconsumeTheCurrentInputToken();
            const value = this.consumeAComponentValue();
            block.values.push(value);
        } while(true);
    }

    private consumeAComment(): InputToken {
        commentRegEx.lastIndex = this.nextInputCodePointIndex;
        const result = commentRegEx.exec(this.text);
        if (!result) {
            return null; // TODO: Handle <bad-comment>
        }
        this.nextInputCodePointIndex = commentRegEx.lastIndex;
        return { type: "<comment-token>", text: result[0] };
    }

    private reconsumeTheCurrentInputToken() {
        this.currentInputTokenShouldBeReconsumed = true;
    }
}