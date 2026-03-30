namespace RFID {
    let buffer = ""
    let lastID = ""
    let isNew = false

    /**
     * Initialiser le module RFID
     */
    //% block="RFID initialiser RX %rx TX %tx"
    //% rx.defl=SerialPin.P1
    //% tx.defl=SerialPin.P0
    export function init(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate9600)
        serial.setRxBufferSize(64)
        buffer = ""
    }

    /**
     * Lire les données série et détecter une carte
     */
    function update(): void {
        while (serial.available() > 0) {
            let char = serial.readString()

            buffer += char

            // Détection début/fin trame
            let start = buffer.indexOf("\u0002")
            let end = buffer.indexOf("\u0003")

            if (start >= 0 && end > start) {
                let raw = buffer.substr(start + 1, end - start - 1)

                // Nettoyage
                lastID = raw.trim()
                isNew = true

                // Reset buffer
                buffer = ""
            }

            // éviter buffer infini
            if (buffer.length > 50) {
                buffer = ""
            }
        }
    }

    /**
     * Vérifie si une nouvelle carte est détectée
     */
    //% block="RFID carte détectée"
    export function available(): boolean {
        update()
        return isNew
    }

    /**
     * Lire l'ID de la carte
     */
    //% block="RFID lire ID"
    export function readID(): string {
        isNew = false
        return lastID
    }

    /**
     * Événement quand une carte est détectée
     */
    //% block="quand RFID détecté"
    export function onCardDetected(handler: () => void): void {
        control.inBackground(function () {
            while (true) {
                if (available()) {
                    handler()
                }
                basic.pause(50)
            }
        })
    }
}
