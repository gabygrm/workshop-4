"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.symDecrypt = exports.symEncrypt = exports.importSymKey = exports.exportSymKey = exports.createRandomSymmetricKey = exports.rsaDecrypt = exports.rsaEncrypt = exports.importPrvKey = exports.importPubKey = exports.exportPrvKey = exports.exportPubKey = exports.generateRsaKeyPair = void 0;
var crypto_1 = require("crypto");
// #############
// ### Utils ###
// #############
// Function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer) {
    return Buffer.from(buffer).toString("base64");
}
// Function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
    var buff = Buffer.from(base64, "base64");
    return buff.buffer.slice(buff.byteOffset, buff.byteOffset + buff.byteLength);
}
function generateRsaKeyPair() {
    return __awaiter(this, void 0, void 0, function () {
        var keyPair;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto_1.webcrypto.subtle.generateKey({
                        name: "RSA-OAEP",
                        modulusLength: 2048,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: "SHA-256"
                    }, true, ["encrypt", "decrypt"])];
                case 1:
                    keyPair = _a.sent();
                    return [2 /*return*/, keyPair];
            }
        });
    });
}
exports.generateRsaKeyPair = generateRsaKeyPair;
function exportPubKey(key) {
    return __awaiter(this, void 0, void 0, function () {
        var exported;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto_1.webcrypto.subtle.exportKey("spki", key)];
                case 1:
                    exported = _a.sent();
                    return [2 /*return*/, arrayBufferToBase64(exported)];
            }
        });
    });
}
exports.exportPubKey = exportPubKey;
function exportPrvKey(key) {
    return __awaiter(this, void 0, void 0, function () {
        var exported;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!key) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, crypto_1.webcrypto.subtle.exportKey("pkcs8", key)];
                case 1:
                    exported = _a.sent();
                    return [2 /*return*/, arrayBufferToBase64(exported)];
            }
        });
    });
}
exports.exportPrvKey = exportPrvKey;
function importPubKey(strKey) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto_1.webcrypto.subtle.importKey("spki", base64ToArrayBuffer(strKey), { name: "RSA-OAEP", hash: "SHA-256" }, true, ["encrypt"])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.importPubKey = importPubKey;
function importPrvKey(strKey) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto_1.webcrypto.subtle.importKey("pkcs8", base64ToArrayBuffer(strKey), { name: "RSA-OAEP", hash: "SHA-256" }, true, ["decrypt"])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.importPrvKey = importPrvKey;
function rsaEncrypt(b64Data, strPublicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var publicKey, encrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, importPubKey(strPublicKey)];
                case 1:
                    publicKey = _a.sent();
                    return [4 /*yield*/, crypto_1.webcrypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, Buffer.from(b64Data, "base64"))];
                case 2:
                    encrypted = _a.sent();
                    return [2 /*return*/, arrayBufferToBase64(encrypted)];
            }
        });
    });
}
exports.rsaEncrypt = rsaEncrypt;
function rsaDecrypt(data, privateKey) {
    return __awaiter(this, void 0, void 0, function () {
        var decrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto_1.webcrypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, base64ToArrayBuffer(data))];
                case 1:
                    decrypted = _a.sent();
                    return [2 /*return*/, Buffer.from(decrypted).toString("base64")];
            }
        });
    });
}
exports.rsaDecrypt = rsaDecrypt;
// ######################
// ### Symmetric keys ###
// ######################
function createRandomSymmetricKey() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto_1.webcrypto.subtle.generateKey({ name: "AES-CBC", length: 256 }, true, ["encrypt", "decrypt"])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.createRandomSymmetricKey = createRandomSymmetricKey;
function exportSymKey(key) {
    return __awaiter(this, void 0, void 0, function () {
        var exported;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto_1.webcrypto.subtle.exportKey("raw", key)];
                case 1:
                    exported = _a.sent();
                    return [2 /*return*/, arrayBufferToBase64(exported)];
            }
        });
    });
}
exports.exportSymKey = exportSymKey;
function importSymKey(strKey) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, crypto_1.webcrypto.subtle.importKey("raw", base64ToArrayBuffer(strKey), { name: "AES-CBC" }, true, ["encrypt", "decrypt"])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.importSymKey = importSymKey;
// Encrypt a message using a symmetric key
function symEncrypt(key, data) {
    return __awaiter(this, void 0, void 0, function () {
        var dataBuff, iv, encrypted, encryptedArray, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataBuff = new TextEncoder().encode(data);
                    iv = crypto.getRandomValues(new Uint8Array(16));
                    return [4 /*yield*/, crypto_1.webcrypto.subtle.encrypt({ name: "AES-CBC", iv: iv }, key, dataBuff)];
                case 1:
                    encrypted = _a.sent();
                    encryptedArray = new Uint8Array(encrypted);
                    result = new Uint8Array(iv.length + encryptedArray.length);
                    result.set(iv, 0);
                    result.set(encryptedArray, iv.length);
                    return [2 /*return*/, arrayBufferToBase64(result.buffer)];
            }
        });
    });
}
exports.symEncrypt = symEncrypt;
// Decrypt a message using a symmetric key
function symDecrypt(strKey, encryptedData) {
    return __awaiter(this, void 0, void 0, function () {
        var encryptedBuffer, key, iv, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encryptedBuffer = base64ToArrayBuffer(encryptedData);
                    return [4 /*yield*/, importSymKey(strKey)];
                case 1:
                    key = _a.sent();
                    iv = encryptedBuffer.slice(0, 16);
                    return [4 /*yield*/, crypto_1.webcrypto.subtle.decrypt({ name: "AES-CBC", iv: iv }, key, encryptedBuffer.slice(16))];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, new TextDecoder().decode(data)];
            }
        });
    });
}
exports.symDecrypt = symDecrypt;