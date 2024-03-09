// Defines a series of notifications to be used across the app. Notification Provider must be provided in App.jsx
import { notifications } from '@mantine/notifications';

/**
 * @class All notifications take two arguments: a title, and a message. These are the same as the Mantine documentation.
 * The super Notification class is not importable.
 * https://mantine.dev/x/notifications/
 * 
 * @param {string} title 
 * @param {string} message
 * @param {string}
 */
class Notification {
    constructor(title, message, color) {
        this.title = title;
        this.message = message;
        this.color = color;
        this.autoClose = 2000; //ms until notification is automatically dismissed.
    }

    show() {
        notifications.show({
            autoClose: this.autoClose,
            color: this.color,
            title: this.title,
            message: this.message,
        });
    }
}

export class SuccessNotification extends Notification {
    constructor(title, message) {
        super(title, message, 'green')
    }
}

export class ErrorNotification extends Notification {
    constructor(title, message) {
        super(title, message, 'red')
    }
}

export class StandardNotification extends Notification {
    constructor(title, message) {
        super(title, message, 'orange')
    }
}
