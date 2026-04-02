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
     * Lire l'ID RFID (string 10 chiffres)
     */
    //% block="lire ID RFID"
    //% weight=90
    export function readID(): string {
        let data = serial.readString()
        let cleaned = ""

        // enlever \r et \n
        for (let i = 0; i < data.length; i++) {
            let c = data.charAt(i)
            if (c != "\r" && c != "\n") {
                cleaned += c
            }
        }

        // chercher 10 chiffres consécutifs
        for (let i = 0; i <= cleaned.length - 10; i++) {
            let candidate = cleaned.substr(i, 10)
            let isNumber = true
            for (let j = 0; j < 10; j++) {
                let ch = candidate.charAt(j)
                if (ch < "0" || ch > "9") {
                    isNumber = false
                    break
                }
            }
            if (isNumber) {
                lastID = candidate
                break
            }
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

    /**
     * Lire l'ID RFID en entier (sans zéro initial)
     */
    //% block="ID RFID en décimal"
    //% weight=70
    export function readIDDecimal(): number {
        let idStr = readID()
        // parseInt va automatiquement ignorer les zéros initiaux
        if (idStr == "") return 0
        return parseInt(idStr)
    }
}
