
export default class Observer<T> {
    private __subscribers: ((value: T) => void)[] = [];

    subscribe(callback: (value: T) => void): void {
        this.__subscribers.push(callback);
    }

    unsubscribe(callback: (value: T) => void): void {
        const index = this.__subscribers.indexOf(callback);
        if (index !== -1) {
            this.__subscribers.splice(index, 1);
        }
    }

    get subscribers(): ((value: T) => void)[] {
        return this.__subscribers;
    }
}
