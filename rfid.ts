//% weight=100 color=#0fbc11 icon="\uf2db"
namespace RFID {

    //% block="initialiser RFID RX %rx TX %tx"
    export function init(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate9600)
    }

    //% block="lire ID RFID"
    export function readID(): number {
        let raw = serial.readString()

        if (raw.length >= 10) {
            // extraire partie utile (8 caractères après "66")
            let hexStr = raw.substr(2, 8)
            return parseInt(hexStr, 16)
        }

        return 0
    }
}
