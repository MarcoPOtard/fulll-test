export default function debounce(callback: Function, delay:number) {
    let timer: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    }
}
