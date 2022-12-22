// Good
interface Notifier {
    notify();
}

class EmailNotifier {
    notify() {
        // ...
    }
}

class SMSNotifier {
    notify() {
        // ...
    }
}

class Employee {
    private notifier;
    public selectedNotifyChannel;

    // By EmployeeEntity class we will read employee preferences from DB and will
    // initialize Employee with proper notifier regarding selectedNotifyChannel
    constructor(notifier: Notifier) {
        this.notifier = notifier;
    }

    sendNotification() {
        this.notifier.notify();
    }
}

class NotifyManager {
    notifyAll(employees: Employee[]) {
        for (const employee of employees) {
            employee.sendNotification();
        }
    }
}