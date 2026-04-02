//% weight=100 color=#0fbc11 icon="\uf2db"
namespace RFID {
    let buffer = ""

    function hexCharValue(c: string): number {
        let digits = "0123456789ABCDEF"
        return digits.indexOf(c)
    }

    function hexToDec(hex: string): number {
        let result = 0
        hex = hex.toUpperCase()

        for (let i = 0; i < hex.length; i++) {
            let v = hexCharValue(hex.charAt(i))
            if (v < 0) return 0
            result = result * 16 + v
        }

        return result
    }

    function isHexChar(c: string): boolean {
        let code = c.charCodeAt(0)

        if (code >= 48 && code <= 57) return true   // 0-9
        if (code >= 65 && code <= 70) return true   // A-F
        if (code >= 97 && code <= 102) return true  // a-f

        return false
    }

    function extractLastValidFrame(data: string): string {
        let hexOnly = ""

        for (let i = 0; i < data.length; i++) {
            let c = data.charAt(i)
            if (isHexChar(c)) {
                hexOnly += c.toUpperCase()
            }
        }

        // Une trame utile observée = 12 caractères hex :
        // 2 d'entête + 8 d'identifiant + 2 de fin/checksum
        // Si plusieurs trames sont collées, on prend la dernière.
        if (hexOnly.length < 12) return ""

        let start = hexOnly.length - 12
        return hexOnly.substr(start, 12)
    }

    //% block="initialiser RFID RX %rx TX %tx"
    export function init(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate9600)
        serial.setRxBufferSize(64)
        buffer = ""
        basic.pause(100)
    }

    //% block="lire badge RFID"
    export function readID(): number {
        buffer += serial.readString()

        let frame = extractLastValidFrame(buffer)

        // On évite que le buffer grossisse trop
        if (buffer.length > 64) {
            buffer = buffer.substr(buffer.length - 64, 64)
        }

        if (frame.length == 12) {
            // Format observé :
            // [0..1]   = entête
            // [2..9]   = ID badge en hex
            // [10..11] = checksum / fin
            let idHex = frame.substr(2, 8)

            // On vide le buffer après lecture valide
            buffer = ""

            return hexToDec(idHex)
        }

        return 0
    }
}
