//% weight=100 color=#0fbc11 icon="\uf2db"
namespace RFID {

    /**
     * Initialiser le lecteur RFID
     */
    //% block="initialiser RFID RX %rx TX %tx"
    //% rx.defl=SerialPin.P1
    //% tx.defl=SerialPin.P0
    export function init(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate9600)
        serial.setRxBufferSize(32) // tampon plus grand
    }

    /**
     * Lire le badge et renvoyer sa valeur décimale
     */
    //% block="lire ID RFID"
    export function readIDDecimal(): number {
        let data = serial.readBuffer(10) // lire plusieurs octets

        if (data.length < 6) return 0 // pas assez de données

        // chercher la trame valide (ignorer start et stop)
        // start = 0x02 souvent, stop = 0x03 ou dernier octet
        let startIndex = 0
        if (data.getUint8(0) == 0x02) startIndex = 1

        let uidLength = 5 // nombre d’octets UID
        if (startIndex + uidLength > data.length) return 0

        // reconstituer le numéro
        let id = 0
        for (let i = startIndex; i < startIndex + uidLength; i++) {
            id = id * 256 + data.getUint8(i)
        }

        return id
    }
}
