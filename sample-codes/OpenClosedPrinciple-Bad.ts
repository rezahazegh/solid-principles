// Bad
class Employee {
    public selectedNotifyChannel;

    public sendEmailNotification() {
        // ...
    }

    public sendSMSNotification() {
        // ...
    }
}

class NotifyManager {
    notifyAll(employees: Employee[]) {
        for (const employee of employees) {
            switch (employee.selectedNotifyChannel) {
                case 'SMS':
                    employee.sendSMSNotification();
                    break;
                case 'Email':
                    employee.sendEmailNotification();
                    break;
                default:
                    throw new Error('Unknown Channel');
            }
        }
    }
}