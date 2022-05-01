import {Utilities} from "modules";

export const rgbaToHex = ([r, g, b, a = 1]) => {
    const alpha = Utilities.round(a * 255);
    const values = a !== 1 ? [r, g, b, alpha] : [r, g, b];

    return `#${values
        .map((val) => val.toString(16).toLowerCase())
        .map((val) => (val.length === 2 ? val : `0${val}`))
        .join('')}`
};
export const hexToRgba = hex => {
    const htemp = hex.replace('#', '');
    if (/^#?/.test(hex) && htemp.length === 3) {
        hex = `#${htemp.charAt(0)}${htemp.charAt(0)}${htemp.charAt(1)}${htemp.charAt(1)}${htemp.charAt(2)}${htemp.charAt(2)}`;
    }
    const reg = new RegExp(`[A-Za-z0-9]{2}`, 'g');
    const [r, g, b = 0, a] = hex.match(reg).map((v) => parseInt(v, 16));
    return [
        r,
        g,
        b,
        a ? a / 255 : 1
    ];
};

export const hsvaToHsla = ([h, s, v, a = 1]) => {
    const hh = ((200 - s) * v) / 100;

    return [
        Utilities.round(h),
        Utilities.round(hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0),
        Utilities.round(hh / 2),
        Utilities.round(a, 2),
    ];
};
export const hslaToHsva = ([h, s, l, a = 1]) => {
    s *= (l < 50 ? l : 100 - l) / 100;

    return [
        Utilities.round(h),
        Utilities.round(s > 0 ? ((2 * s) / (l + s)) * 100 : 0),
        Utilities.round(l + s),
        Utilities.round(a, 2)
    ];
};

export const hsvaToRgba = ([h, s, v, a = 1]) => {
    h = (h / 360) * 6;
    s = s / 100;
    v = v / 100;

    const hh = Math.floor(h),
        b = v * (1 - s),
        c = v * (1 - (h - hh) * s),
        d = v * (1 - (1 - h + hh) * s),
        module = hh % 6;

    return [
        Utilities.round([v, c, b, b, d, v][module] * 255),
        Utilities.round([d, v, v, c, b, b][module] * 255),
        Utilities.round([b, b, d, v, v, c][module] * 255),
        Utilities.round(a, 2),
    ];
};
export const rgbaToHsva = ([r, g, b, a = 1]) => {
    const max = Math.max(r, g, b);
    const delta = max - Math.min(r, g, b);

    const hh = delta
        ? max === r
            ? (g - b) / delta
            : max === g
                ? 2 + (b - r) / delta
                : 4 + (r - g) / delta
        : 0;

    return [
        60 * (hh < 0 ? hh + 6 : hh),
        max ? (delta / max) * 100 : 0,
        (max / 255) * 100,
        a
    ];
};

export const hsvaToHex = hsva => rgbaToHex(hsvaToRgba(hsva));
export const hexToHsva = hex => rgbaToHsva(hexToRgba(hex));

export const validateHex = value => {
    const match = /^#?([0-9A-F]{3,8})$/i.exec(value);
    const length = match ? match[1].length : 0;

    return length === 3 || length === 6 || length === 4 || length === 8;
};
export const validateRgba = ([r, g, b, a = 1]) => {
    return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1;
}
export const validateHsla = ([h, s, l, a = 1]) => {
    return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100 && a >= 0 && a <= 1;
}