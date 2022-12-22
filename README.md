# SOLID Principles
The SOLID Principles are five principles of Object-Oriented class design. They are a set of rules and best practices to follow while designing a class structure.

We use these principles To have more understandable, testable and maintainable code that many developers can collaboratively work on.

## 1- Single Responsibility Principle (SRP)

* It makes your software easier to implement and prevents unexpected side-effects of future changes.


* The more responsibilities your class has, the more often you need to change it.


* Minimizing the amount of times you need to change a class is important. It's important because if too much functionality is in one class and you modify a piece of it, it can be difficult to understand how that will affect other dependent modules in your codebase.


* You can have as many methods as you want in your class, but they should be linked to the responsibility of the class.


* As stated in Clean Code, "There should never be more than one reason for a class to change".

### Bad:
```typescript
class Salary {

    calculateSalary(){
        // ...
    }

    printPaycheck(){
        // ...
    }

    saveData(){
        // ...
    }
}
```
Above example violates SRP because you have more than one reason to change this class, here is some of them:
* if you need to change calculate salary formula
* if you need to change print paycheck format
* if you need to change the way of saving data. For example in the first version of your app you save data in a file and for the second version you decide to save in a db

### Good:
```typescript
class SalaryCalculate {
    calculate(){
        // ...
    }
}
```

```typescript
class SalaryPaycheck {
    print(){
        // ...
    }
}
```

```typescript
class SalaryPersistence {
    save(){
        // ...
    }
}
```


However, make sure to not oversimplify your code. Some developers take the single responsibility principle to the extreme by creating classes with just one function. Later, when they want to write some actual code, they have to inject many dependencies which makes the code very unreadable and confusing.

## 2- Open/Closed Principle (OCP)

* As stated by Bertrand Meyer, "software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification."


* Modification means changing the code of an existing class, and extension means adding new functionality.


* So what this principle wants to say is: We should be able to add new functionality without touching the existing code for the class. This is because whenever we modify the existing code, we are taking the risk of creating potential bugs. So we should avoid touching the tested and reliable (mostly) production code if possible.


* But how are we going to add new functionality without touching the class, you may ask. It is usually done with the help of interfaces and abstract classes.

Here is an example. Consider employees can choose to get notified by which way

### Bad:
```typescript
class Employee {
    public selectedNotifyChannel;

    public sendEmailNotification() {
        // ...
    }

    public sendSMSNotification() {
        // ...
    }
}
```

```typescript
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
```

This implementation violates OCP. Because if you decide to add a new notification channel, for example 
notify by WhatsApp, you should modify both classes. First you should add ```sendWhatsAppNotification()``` method to the ```Employee``` class and
then you should add a new case to the switch case in ```NotifyManager``` class.

### Good:
```typescript
interface Notifier {
    notify();
}

class EmailNotifier implements Notifier {
    notify() {
        // ...
    }
}

class SMSNotifier implements Notifier {
    notify() {
        // ...
    }
}
```

```typescript
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
```

```typescript
class NotifyManager {
    notifyAll(employees: Employee[]) {
        for (const employee of employees) {
            employee.sendNotification();
        }
    }
}
```
With this implementation you just need to add ```WhatsAppNotifier``` class without modifying ```Employee``` and ```NotifyManager``` classes.