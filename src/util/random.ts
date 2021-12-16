export function createRandomUsername() {
    let numbers = []
    for (let i = 0; i < 15; i++) {
        numbers.push(Math.floor(Math.random() * 10))
    }

    return `user${numbers.join('')}`
}