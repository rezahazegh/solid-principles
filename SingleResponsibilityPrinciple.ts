// Bad
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

// Good
class SalaryCalculate {
    calculate(){
        // ...
    }
}

class SalaryPaycheck {
    print(){
        // ...
    }
}

class SalaryPersistence {
    save(){
        // ...
    }
}