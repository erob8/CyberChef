/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * To Base32 operation
 */
class ToBase32 extends Operation {

    /**
     * ToBase32 constructor
     */
    constructor() {
        super();

        this.name = "To Base32";
        this.module = "Default";
        this.description = "Base32 is a notation for encoding arbitrary byte data using a restricted set of symbols that can be conveniently used by humans and processed by computers. It uses a smaller set of characters than Base64, usually the uppercase alphabet and the numbers 2 to 7.";
        this.infoURL = "https://wikipedia.org/wiki/Base32";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "Alphabet",
                type: "binaryString",
                value: "A-Z2-7="
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
	console.log('hi');
	console.log(input);
	console.log(args);
        if (!input) return "";
        input = new Uint8Array(input);
	console.log(input);
	if (input.length === 40) {
		const toStr = Utils.byteArrayToChars(input).toUpperCase();
		console.log(toStr);
		const sha1Regex = new RegExp("^[A-Fa-f0-9]{40}$");
		if (sha1Regex.test(toStr) === true) {
			console.log('sha1 regex match');
			const b32Map = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','2','3','4','5','6','7'];
			console.log(b32Map);
			let binary = "";
			for (const c of toStr) {
				const binRep = parseInt(c, 16).toString(2).padStart(4, '0');
				console.log('binary rep of ' + c + ' is ' + binRep);
				binary += binRep;
			}
			console.log(binary);
			let b32 = "";
			for(let i = 0; i < binary.length; i+=5) {
				const slice = binary.slice(i, i+5);
				const toB32 = b32Map[parseInt(slice,2)];
				console.log(slice + '  converted to b32 val of ' + toB32);
				b32 += toB32;
			}
			console.log(b32);
			return b32;
		}
		else {
			console.log('not a sha1 regex match.');
		}
	}

        const alphabet = args[0] ? Utils.expandAlphRange(args[0]).join("") : "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=";
        let output = "",
            chr1, chr2, chr3, chr4, chr5,
            enc1, enc2, enc3, enc4, enc5, enc6, enc7, enc8,
            i = 0;
        while (i < input.length) {
            chr1 = input[i++];
            chr2 = input[i++];
            chr3 = input[i++];
            chr4 = input[i++];
            chr5 = input[i++];

            enc1 = chr1 >> 3;
            enc2 = ((chr1 & 7) << 2) | (chr2 >> 6);
            enc3 = (chr2 >> 1) & 31;
            enc4 = ((chr2 & 1) << 4) | (chr3 >> 4);
            enc5 = ((chr3 & 15) << 1) | (chr4 >> 7);
            enc6 = (chr4 >> 2) & 31;
            enc7 = ((chr4 & 3) << 3) | (chr5 >> 5);
            enc8 = chr5 & 31;

            if (isNaN(chr2)) {
                enc3 = enc4 = enc5 = enc6 = enc7 = enc8 = 32;
            } else if (isNaN(chr3)) {
                enc5 = enc6 = enc7 = enc8 = 32;
            } else if (isNaN(chr4)) {
                enc6 = enc7 = enc8 = 32;
            } else if (isNaN(chr5)) {
                enc8 = 32;
            }

            output += alphabet.charAt(enc1) + alphabet.charAt(enc2) + alphabet.charAt(enc3) +
                alphabet.charAt(enc4) + alphabet.charAt(enc5) + alphabet.charAt(enc6) +
                alphabet.charAt(enc7) + alphabet.charAt(enc8);
        }
        return output;
    }

}

export default ToBase32;
