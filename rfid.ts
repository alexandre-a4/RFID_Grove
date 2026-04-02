//% weight=100 color=#0fbc11 icon="\uf2db"
namespace RFID {

    let lastRawID = 0
    let lastID = 0

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
     * Lire l'ID RFID brut
     */
    //% block="lire ID RFID brut"
    //% weight=90
    export function readRawID(): number {
        let data = serial.readString()
        let cleaned = ""

        // enlever \r et \n
        for (let i = 0; i < data.length; i++) {
            let c = data.charAt(i)
            if (c != "\r" && c != "\n") {
                cleaned += c
            }
        }

        if (cleaned.length > 0) {
            lastRawID = parseInt(cleaned)
        }

        return lastRawID
    }

    /**
     * Convertir un nombre en hex (compatible MakeCode)
     */
    function toHex(n: number, padding: number): string {
        let hex = ""
        let digits = "0123456789ABCDEF"
        while (n > 0) {
            let d = n % 16
            hex = digits.charAt(d) + hex
            n = Math.floor(n / 16)
        }
        while (hex.length < padding) {
            hex = "0" + hex
        }
        return hex
    }

    /**
     * Lire l'ID RFID en décimal lisible (comme sur le badge)
     */
    //% block="ID RFID décimal"
    //% weight=80
    export function readIDDecimal(): number {
        let raw = readRawID()
        if (raw == 0) return 0

        // convertir en hex
        let hexStr = toHex(raw, 8)

        // réordonner les octets : byte4 byte3 byte2 byte1
        let finalHex = hexStr.charAt(6) + hexStr.charAt(7) +
                       hexStr.charAt(4) + hexStr.charAt(5) +
                       hexStr.charAt(2) + hexStr.charAt(3) +
                       hexStr.charAt(0) + hexStr.charAt(1)

        lastID = parseInt(finalHex, 16)
        return lastID
    }

    /**
     * Vérifier si un ID correspond
     */
    //% block="ID RFID = %value"
    //% weight=70
    export function isEqual(value: number): boolean {
        return lastID == value
    }
}
