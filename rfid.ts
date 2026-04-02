//% weight=100 color=#0fbc11 icon="\uf2db"
namespace RFID {

    function hexToDec(hex: string): number {
        let result = 0
        let digits = "0123456789ABCDEF"
        hex = hex.toUpperCase()

        for (let i = 0; i < hex.length; i++) {
            let c = hex.charAt(i)
            let value = digits.indexOf(c)
            let value = digits.indexOf(hex.charAt(i))
            if (value < 0) return 0
            result = result * 16 + value
        }

        return result
    }

    function keepHexOnly(raw: string): string {
        let out = ""
        let allowed = "0123456789ABCDEFabcdef"

        for (let i = 0; i < raw.length; i++) {
            let c = raw.charAt(i)
            if (allowed.indexOf(c) >= 0) {
                out += c
            }
        }

        return out.toUpperCase()
    }

    //% block="initialiser RFID RX %rx TX %tx"
    export function init(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate9600)
    }

    //% block="lire ID RFID"
    //% block="lire badge RFID"
    export function readID(): number {
        let raw = serial.readString()
        let hex = keepHexOnly(raw)

        if (raw.length >= 10) {
            let hexStr = raw.substr(2, 8)
            return hexToDec(hexStr)
        // Trame attendue : 12 caractères hex
        // 2 premiers = entête
        // 8 suivants = ID utile
        // 2 derniers = checksum
        if (hex.length >= 12) {
            return hexToDec(hex.substr(2, 8))
        }

        return 0
    }
}
