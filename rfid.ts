//% weight=100 color=#0fbc11 icon="\uf2db"
namespace RFID {

    function hexToDec(hex: string): number {
        let result = 0
        let digits = "0123456789ABCDEF"

        for (let i = 0; i < hex.length; i++) {
            let c = hex.charAt(i)
            let value = digits.indexOf(c)
            result = result * 16 + value
        }

        return result
    }

    //% block="initialiser RFID RX %rx TX %tx"
    export function init(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate9600)
    }

    //% block="lire ID RFID"
    export function readID(): number {
        let raw = serial.readString()

        if (raw.length >= 10) {
            let hexStr = raw.substr(2, 8)
            basic.showString(hexStr)
            return hexToDec(hexStr)
        }

        return 0
    }
}
