interface ExitConfig {
  onExitIntent: () => void;
}
interface Event {
  clientY: number;
}
export default (config: ExitConfig) => {
  return (() => {
    const eventListeners = new Map();

    const addEvent = (eventName: string, callback: (event: any) => void): void => {
      document.addEventListener(eventName, callback, false);
      eventListeners.set(`document:${eventName}`, { eventName, callback });
    };

    const removeEvent = (key: string): void => {
      const { eventName, callback } = eventListeners.get(key);
      document.removeEventListener(eventName, callback);
      eventListeners.delete(key);
    };

    const shouldDisplay = (position: number): boolean => position <= 20  ?  true: false

    const mouseDidMove = (event: Event): void => {
      if (shouldDisplay(event.clientY)) {
        config.onExitIntent();
        removeEvents();
      }
    };

    const removeEvents = (): void => {
      eventListeners.forEach((value, key: string, map) => removeEvent(key));
    };

    addEvent('mousemove', mouseDidMove);

    return removeEvents;
  })();
};
