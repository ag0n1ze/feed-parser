'use-strict';

// XML 1.0 numeric character references — fast-xml-parser decodes named XML
// entities (&lt; &gt; &amp; &apos; &quot;) but not numeric refs like &#x2F;
// or &#39;. Decoding them here keeps every downstream consumer (textContent,
// textContentNormalized, innerHtml) consistent with the XML spec.
const NUMERIC_REF = /&#(x[0-9a-fA-F]+|\d+);/g;

/**
     *
	 * @param {string} str
	 *     A string that may contain numeric character references.
	 * @returns {string}
	 *     Returns the string with numeric references => Unicode character.
	 */
function decodeNumericRefs(str) {
    return str.replace(NUMERIC_REF, (match, code) => {
        const cp = code[0] === 'x' || code[0] === 'X'
            ? parseInt(code.slice(1), 16) // hex pattern, e.g. 2F => /
            : parseInt(code, 10); // integer patten, e.g. 38 => &
        // Skip invalid codepoints — leave the original sequence intact.
        if (!Number.isFinite(cp) || cp < 0 || cp > 0x10FFFF) return match;
        try {
            return String.fromCodePoint(cp);
        } catch {
            return match;
        }
    });
}

exports.decodeNumericRefs = decodeNumericRefs;
