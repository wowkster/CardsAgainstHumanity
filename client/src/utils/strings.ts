declare global {
    interface String {
        toPossessive(): string
    }

    interface Array<T> {
        joinNicely(oxford?: boolean): string
    }
}
String.prototype.toPossessive = function () {
    return this.toLowerCase().endsWith('s')
        ? `${this.toString()}'`
        : `${this.toString()}'s`
}

Array.prototype.joinNicely = function (oxford = true) {
    const firstPart = this.slice(0, -1)

    return this.length > 1
        ? firstPart.join(', ') +
              (oxford ? ',' : '') +
              ' and ' +
              this.slice(-1)[0]
        : this.join(',')
}

export {}
