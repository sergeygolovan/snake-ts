export class KeyboardController {

    private readonly listeners: Map<string, Function[]> = new Map<string, Function[]>();
    private keydownListenerFn = null;

    constructor(
        private readonly keyMap: any = {}
    ) {
        this.keydownListenerFn = this.keyDownListener.bind(this);
        document.addEventListener("keydown", this.keydownListenerFn);
    }

    private keyDownListener(event: KeyboardEvent) {
        let listeners = this.listeners.get(event.key);

        if (listeners) {
            listeners.forEach(_ => _(event));
        }
    }

    public on(action, callbackFn) {

        let keyCode = this.keyMap[action];

        if ( !this.listeners.has(keyCode) ) {
            this.listeners.set(keyCode, []);
        }

        this.listeners.get(keyCode).push(callbackFn);
    }

    public removeAllListeners() {
        document.removeEventListener("keydown", this.keydownListenerFn)
        this.listeners.clear();
    }
}