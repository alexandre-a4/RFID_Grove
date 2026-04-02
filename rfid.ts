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
        data = data.replace("\r", "").replace("\n", "")

        if (data.length > 0) {
            // Convertir en entier depuis la chaîne reçue
            lastRawID = parseInt(data)
        }

        return lastRawID
    }

    /**
     * Lire l'ID RFID formaté en décimal lisible (comme sur le badge)
     */
    //% block="ID RFID décimal"
    //% weight=80
    export function readIDDecimal(): number {
        let raw = readRawID()
        // Conversion hex → décimal correct
        // On inverse les octets selon le format de ton badge
        let hexStr = raw.toString(16)
        // S'assurer que la chaîne fait au moins 4 à 5 octets (padding à gauche si nécessaire)
        while (hexStr.length < 8) {
            hexStr = "0" + hexStr
        }

        // Réordonner les octets (swap si nécessaire)
        let byte1 = hexStr.substr(0, 2)
        let byte2 = hexStr.substr(2, 2)
        let byte3 = hexStr.substr(4, 2)
        let byte4 = hexStr.substr(6, 2)

        // Reconstituer l'ID lisible
        let finalHex = byte4 + byte3 + byte2 + byte1
        let idDecimal = parseInt(finalHex, 16)

        lastID = idDecimal
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
