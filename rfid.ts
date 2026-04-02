//% weight=100 color=#0fbc11 icon="\uf2db"
namespace RFID {

    let lastID = ""

    /**
     * Initialiser le lecteur RFID
     */
    //% block="initialiser RFID RX %rx TX %tx"
    //% rx.defl=SerialPin.P1
    //% tx.defl=SerialPin.P0
    //% weight=100
    export function init(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate9600)
    }

    /**
     * Lire l'ID RFID
     */
    //% block="lire ID RFID"
    //% weight=90
    export function readID(): string {
        let data = serial.readString()

        if (data.length >= 10) {
            lastID = data.substr(0, 10)
        }

        return lastID
    }

    /**
     * Vérifier si un ID correspond
     */
    //% block="ID RFID = %value"
    //% weight=80
    export function isEqual(value: string): boolean {
        return lastID == value
    }
}
