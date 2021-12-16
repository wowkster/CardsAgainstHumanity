type ClassName = string | undefined

export function merge(...args: ClassName[]) {
    return args.filter(e => !!e).join(' ')
}