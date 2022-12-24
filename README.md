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

Here is an example. Consider employees can choose the way to receive their company notifications.

### Bad:
```typescript
class Employee {
    selectedNotifyChannel: string;

    sendEmailNotification() {
        // ...
    }

    sendSMSNotification() {
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

## 3- Liskov Substitution Principle (LSP)

* The Liskov Substitution Principle is the third of Robert C. Martin’s SOLID design principles. It extends the Open/Closed principle and enables you to replace objects of a parent class with objects of a subclass without breaking the application.


* An overridden method of a subclass needs to accept the same input parameter values as the method of the superclass. That means you can implement less restrictive validation rules, but you are not allowed to enforce stricter ones in your subclass. Otherwise, any code that calls this method on an object of the superclass might cause an exception, if it gets called with an object of the subclass.

### Bad:
```typescript
class Rectangle {
    width;
    height;

    constructor() {
        this.width = 0;
        this.height = 0;
    }

    setColor(color) {
        // ...
    }

    render(area) {
        // ...
    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    getArea() {
        return this.width * this.height;
    }
}
```

```typescript
class Square extends Rectangle {
    setWidth(width) {
        this.width = width;
        this.height = width;
    }

    setHeight(height) {
        this.width = height;
        this.height = height;
    }
}
```

```typescript
function renderLargeRectangles(rectangles) {
    rectangles.forEach(rectangle => {
        rectangle.setWidth(4);
        rectangle.setHeight(5);
        const area = rectangle.getArea(); // BAD: Returns 25 for Square. Should be 20.
        rectangle.render(area);
    });
}

const rectangles = [new Rectangle(), new Rectangle(), new Square()];
renderLargeRectangles(rectangles);
```

### Good:
```typescript
class Shape {
    setColor(color) {
        // ...
    }

    render(area) {
        // ...
    }
}
```

```typescript
class Rectangle extends Shape {
    width;
    height;

    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    getArea() {
        return this.width * this.height;
    }
}
```

```typescript
class Square extends Shape {
    length;

    constructor(length) {
        super();
        this.length = length;
    }

    getArea() {
        return this.length * this.length;
    }
}
```

```typescript
function renderLargeShapes(shapes) {
    shapes.forEach(shape => {
        const area = shape.getArea();
        shape.render(area);
    });
}

const shapes = [new Rectangle(4, 5), new Rectangle(4, 5), new Square(5)];
renderLargeShapes(shapes);
```

## 4- Interface Segregation Principle (ISP)
* Segregation means keeping things separated, and the Interface Segregation Principle is about separating the interfaces.


* The principle states that many client-specific interfaces are better than one general-purpose interface.


* A client should never be forced to implement an interface that it doesn’t use, or clients shouldn’t be forced to depend on methods they do not use.

### Bad:
```SMSNotifier``` should raise an error or do nothing for ```attachFile()```, because SMS doesn't support attaching file.

```typescript
interface Notifier {
    notify()

    attachFile()
}

class EmailNotifier implements Notifier {
    notify() {
        // ...
    }
    
    attachFile() {
        // ...
    }
}

class SMSNotifier implements Notifier {
    notify() {
        // ...
    }

    attachFile() {
        throw new Error(`SMS doesn't support attaching files`);
    }
}
```

### Good:
```typescript
interface Notifier {
    notify()
}

interface Attacher {
    attachFile()
}

class EmailNotifier implements Notifier, Attacher {
    notify() {
        // ...
    }

    attachFile() {
        // ...
    }
}

class SMSNotifier implements Notifier {
    notify() {
        // ...
    }
}
```

## 5- Dependency Inversion Principle (DIP)

* The Dependency Inversion principle states that our classes should depend upon interfaces or abstract classes instead of concrete classes and functions.

### Bad:

```typescript
class MySQLConnection {
    connect() {
        // handle the database connection
        return 'Database connection';
    }
}

class AppInit {
    private dbConnection;

    constructor(dbConnection: MySQLConnection) {
        this.dbConnection = dbConnection;
    }
}
```
This implementation violates DIP, because if you need to pass any other database connection to ```AppInit``` it depends on concrete class ```MySQLConnection```. 

### Good:

```typescript
interface DBConnectionInterface {
    connect();
}

class MySQLConnection implements DBConnectionInterface{
    connect() {
        // handle the database connection
        return 'Database connection';
    }
}

class AppInit {
    private dbConnection;

    constructor(dbConnection: DBConnectionInterface) {
        this.dbConnection = dbConnection;
    }
}
```