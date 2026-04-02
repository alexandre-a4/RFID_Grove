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
        serial.setRxBufferSize(10) // tampon suffisant pour l'UID
    }

    /**
     * Lire le badge et renvoyer sa valeur en décimal
     */
    //% block="lire ID RFID"
    export function readIDDecimal(): number {
        let buf = serial.readBuffer(5) // 5 octets UID
        if (buf.length < 5) return 0

        // reconstruction du nombre lisible
        // adapter l’ordre des octets selon ton badge
        let id = 0
        for (let i = 0; i < 5; i++) {
            id = id * 256 + buf.getUint8(i)
        }

        return id
    }
}
