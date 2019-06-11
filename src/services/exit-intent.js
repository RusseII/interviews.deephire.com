export default function ExitIntent(options = {}) {
  const defaultOptions = {
    threshold: 20,
    maxDisplays: 1,
    onExitIntent: () => {},
  };

  return (function exit() {
    const config = { ...defaultOptions, ...options };
    const eventListeners = new Map();
    let displays = 0;

    const addEvent = (eventName, callback) => {
      document.addEventListener(eventName, callback, false);
      eventListeners.set(`document:${eventName}`, { eventName, callback });
    };

    const removeEvent = key => {
      const { eventName, callback } = eventListeners.get(key);
      document.removeEventListener(eventName, callback);
      eventListeners.delete(key);
    };

    const shouldDisplay = position => {
      if (position <= config.threshold && displays < config.maxDisplays) {
        displays += 1;
        return true;
      }
      return false;
    };

    const removeEvents = () => {
      eventListeners.forEach((_value, key) => removeEvent(key));
    };

    const mouseDidMove = event => {
      if (shouldDisplay(event.clientY)) {
        config.onExitIntent();
        if (displays >= config.maxDisplays) {
          removeEvents();
        }
      }
    };
    addEvent('mousemove', mouseDidMove);

    return removeEvents;
  })();
}
