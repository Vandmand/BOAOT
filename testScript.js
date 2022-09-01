export function func1() {
    return 'foo'
}

export function func2() {
    return func1() + 'bar'
}