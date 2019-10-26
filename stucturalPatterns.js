//Structural Patterns

//1. adapter - to use diff version of API


class OldCalc {
    operations(t1, t2, operation) {
        switch (operation) {
            case 'add' : return t1 + t2
            case 'sub' : return t1 - t2
            default : return 'no operations found'
        }
    }
}

class NewCalc {
    add(t1, t2) {
        return t1 + t2
    }

    sub(t1, t2) {
        return t1 - t2
    }
}

class CalcAdapter {
    constructor() {
        this.calc = new NewCalc()
    }

    operations(t1, t2, operation) {
        switch (operation) {
            case 'add' : return this.calc.add(t1, t2)
            case 'sub' : return this.calc.sub(t1, t2)
            default : return 'no operations found'
        }
    }
}

const oldCalc = new OldCalc()
console.log(oldCalc.operations(10,5, 'add'))

const newCalc = new NewCalc()
console.log(newCalc.add(10,5))

const adapter = new CalcAdapter()
console.log(adapter.operations(10,5, 'sub'))


//2. decorator - to add new behavior to instance objects

class Server {
    constructor(ip, port) {
        this.ip = ip
        this.port = port
    }

    get url() {
        return `http://${this.ip}:${this.port}`
    }
}

function aws(server) {
    server.isAWS = true
    server.awsInfo = function() {
        return server.url
    }
    return server
}

function azure(server) {
    server.isAzure = true
    server.port += 500
    return server
}

const s1 = aws(new Server('12.34.56.78', 8080))
console.log(s1.isAWS)
console.log(s1.awsInfo())

const s2 = azure(new Server('11.11.11.11', 3000))
console.log(s2.isAzure)
console.log(s2.url)

//3. facade - jquery, to make interaction more simple

class Complaints {
    constructor() {
        this.complaints = []
    }

    reply(complaint) {}

    add(complaint) {
        this.complaints.push(complaint)
        return this.reply(complaint)
    }
}

class ProductComplaints extends Complaints {
    reply({id, customer, details}) {
        return `product: ${id}  ${customer}  ${details}`
    }
}

class ServiceComplaints extends Complaints {
    reply({id, customer, details}) {
        return `service: ${id}  ${customer}  ${details}`
    }
}

class ComplaintRegistry {
    register(customer, type, details) {
        const id = Date.now()
        let complaint

        type === 'service'
            ? complaint = new ServiceComplaints()
            : complaint = new ProductComplaints()

        return complaint.add({id, customer, details})
    }
}

const registry = new ComplaintRegistry()

console.log(registry.register('Vlad', 'service', 'not work'))
console.log(registry.register('Ola', 'product', 'not work'))

// 4. flyweight - img loading - to prevent double loading

class Car {
    constructor(model, price) {
        this.model = model
        this.price = price
    }
}

class CarFactory {
    constructor() {
        this.cars = []
    }

    create(model , price) {
        const candidate = this.getCar(model)

        if (candidate) {
            return candidate
        }

        const newCar = new Car(model, price)
        this.cars.push(newCar)
        return newCar
    }

    getCar(model) {
        return this.cars.find(car => car.model === model)
    }
}

const factory = new CarFactory()

const bmwx6 = factory.create('bmw', 10000)
const audi = factory.create('audi', 10000)
const bmwx3 = factory.create('bmw', 5000)
console.log(bmwx6)
console.log(audi)
console.log(bmwx3)
console.log(bmwx3 === bmwx6)

// 5. proxy - to prevent nonuseful server request

function networkFetch(url) {
    return `${url} - server response`
}

const cache = new Set()
const proxiedFetch = new Proxy(networkFetch, {
    apply(target, thisArg, args) {
        const url = args[0]
        if (cache.has(url)) {
            return `${url} - cache response`
        } else {
            cache.add(url)
            return Reflect.apply(target, thisArg, args)
        }
    }
})

console.log(proxiedFetch('angular.io'))
console.log(proxiedFetch('angular.io'))

