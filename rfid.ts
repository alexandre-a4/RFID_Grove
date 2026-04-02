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
        serial.setRxBufferSize(64)
    }

    /**
     * Lire l'ID RFID (formaté 10 chiffres)
     */
    //% block="lire ID RFID"
    //% weight=90
    export function readID(): string {
        let data = serial.readString()
        data = data.replace(/\r|\n/g, "") // enlever retour chariot/ligne

        // Chercher un ID sur 10 chiffres dans la trame
        let match = /[0-9]{10}/.exec(data)
        if (match) {
            lastID = match[0]
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
