//% weight=100 color=#0fbc11 icon="\uf2db"
namespace RFID {
    let serialBuffer = ""
    let lastID = 0
    let lastHex = ""
    let eventStarted = false

    const RFID_EVENT_ID = 3100
    const RFID_EVENT_BADGE = 1

    function hexCharValue(c: string): number {
        let digits = "0123456789ABCDEF"
        return digits.indexOf(c)
    }

    function hexToDec(hex: string): number {
        let result = 0
        hex = hex.toUpperCase()

        for (let i = 0; i < hex.length; i++) {
            let v = hexCharValue(hex.charAt(i))
            if (v < 0) return 0
            result = result * 16 + v
        }

        return result
    }

    function isHexChar(c: string): boolean {
        let code = c.charCodeAt(0)

        if (code >= 48 && code <= 57) return true   // 0-9
        if (code >= 65 && code <= 70) return true   // A-F
        if (code >= 97 && code <= 102) return true  // a-f

        return false
    }

    function keepHexOnly(data: string): string {
        let out = ""

        for (let i = 0; i < data.length; i++) {
            let c = data.charAt(i)
            if (isHexChar(c)) {
                out += c.toUpperCase()
            }
        }

        return out
    }

    function extractLastFrame(data: string): string {
        let hexOnly = keepHexOnly(data)

        // Trame observée :
        // 2 caractères entête + 8 caractères ID + 2 caractères checksum = 12
        if (hexOnly.length < 12) return ""

        return hexOnly.substr(hexOnly.length - 12, 12)
    }

    function updateBuffer(): void {
        serialBuffer += serial.readString()

        if (serialBuffer.length > 128) {
            serialBuffer = serialBuffer.substr(serialBuffer.length - 128, 128)
        }
    }

    function tryReadTag(): boolean {
        updateBuffer()

        let frame = extractLastFrame(serialBuffer)
        if (frame.length != 12) return false

        let idHex = frame.substr(2, 8)
        let idDec = hexToDec(idHex)

        if (idDec == 0) return false

        lastHex = idHex
        lastID = idDec
        serialBuffer = ""

        return true
    }

    function startBackgroundListener(): void {
        if (eventStarted) return
        eventStarted = true

        control.inBackground(function () {
            let previousID = 0

            while (true) {
                if (tryReadTag()) {
                    if (lastID != previousID) {
                        previousID = lastID
                        control.raiseEvent(RFID_EVENT_ID, RFID_EVENT_BADGE)
                    }
                    basic.pause(300)
                } else {
                    basic.pause(50)
                }
            }
        })
    }

    //% block="initialiser RFID RX %rx TX %tx"
    //% weight=100
    export function init(rx: SerialPin, tx: SerialPin): void {
        serial.redirect(tx, rx, BaudRate.BaudRate9600)
        serial.setRxBufferSize(64)
        serialBuffer = ""
        lastID = 0
        lastHex = ""
        basic.pause(100)
        startBackgroundListener()
    }

    //% block="lire badge RFID"
    //% weight=90
    export function readID(): number {
        if (tryReadTag()) {
            return lastID
        }
        return 0
    }

    //% block="lire badge RFID en hex"
    //% weight=80
    export function readHex(): string {
        if (tryReadTag()) {
            return lastHex
        }
        return ""
    }

    //% block="badge RFID disponible"
    //% weight=70
    export function available(): boolean {
        return tryReadTag()
    }

    //% block="vider tampon RFID"
    //% weight=60
    export function clearBuffer(): void {
        serialBuffer = ""
        serial.readString()
    }

    //% block="dernier badge RFID"
    //% weight=50
    export function lastBadge(): number {
        return lastID
    }

    //% block="dernier badge RFID en hex"
    //% weight=40
    export function lastBadgeHex(): string {
        return lastHex
    }

    //% block="quand badge RFID lu"
    //% weight=30
    export function onTagRead(handler: () => void): void {
        startBackgroundListener()
        control.onEvent(RFID_EVENT_ID, RFID_EVENT_BADGE, handler)
    }
}
