export class EventHandlerManager {
  private animationFrameId?: number;
  private eventListenerList: Parameters<typeof removeEventListener>[] = [];
  disposed: boolean = false;

  addEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ) {
    // @ts-expect-error
    this.eventListenerList.push([type, listener]);
    addEventListener(type, listener, options);
  }

  removeEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
  ) {
    this.eventListenerList = this.eventListenerList.filter(
      ([type2, listener2]) => type2 !== type && listener2 !== listener,
    );
    removeEventListener(type, listener);
  }

  requestAnimationFrame(callback: FrameRequestCallback) {
    this.animationFrameId = requestAnimationFrame(callback);
  }

  disposeAll() {
    this.disposed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.eventListenerList.forEach((params) => {
      removeEventListener(...params);
    });
  }
}
