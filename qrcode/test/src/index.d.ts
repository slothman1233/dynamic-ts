/**
* @class qrcode
* @constructor
* @example
* new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
*
* @example
* var oQRCode = new QRCode("test", {
*    text : "http://naver.com",
*    width : 128,
*    height : 128
* });
*
* oQRCode.clear(); // Clear the QRCode.
* oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
*
* @param {HTMLElement|String} el target element or 'id' attribute of element.
* @param {Object|String} vOption
* @param {String} vOption.text QRCode link data
* @param {Number} [vOption.width=256]
* @param {Number} [vOption.height=256]
* @param {String} [vOption.colorDark="#000000"]
* @param {String} [vOption.colorLight="#ffffff"]
* @param {qrcode.CorrectLevel} [vOption.correctLevel=qrcode.CorrectLevel.H] [L|M|Q|H]
*/
export declare class qrcode {
    _htOption: any;
    _android: any;
    _el: any;
    _oQRCode: any;
    _oDrawing: any;
    CorrectLevel: any;
    constructor(el: any, vOption: any);
    makeCode(sText: any): void;
    makeImage(): void;
    clear(): void;
}
