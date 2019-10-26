//Behaviour Patterns - for improvement communication between objects of diff types (jquery)

//1. chain of responsibility

class MySum {
    constructor(initialValue = 42) {
        this.sum = initialValue
    }

    add(val) {
        this.sum += val
        return this /// important line
    }
}

const s1 = new MySum(0)
console.log(s1.add(1).add(2))

// 2. command - make wrapper to manage object (redux)

class MyMath {
    constructor(initialValue = 0) {
        this.num = initialValue
    }

    square() {
        return this.num**2
    }

    cube() {
        return this.num**3
    }
}

class Command {
    constructor(subject) {
        this.subject = subject
        this.commandExecuted = []
    }

    execute(command) {
        this.commandExecuted.push(command)
        return this.subject[command]()
    }
}

const x = new Command(new MyMath(2))

console.log(x.execute('square'))
console.log(x.execute('cube'))
console.log(x.commandExecuted)

// 3. iterator

class MyIterator {
    constructor(data) {
        this.index = 0
        this.data = data
    }

    [Symbol.iterator]() {
        return {
            next: () => {
                if (this.index < this.data.length) {
                    return {
                        value: this.data[this.index++],
                        done: false
                    }
                } else {
                    this.index = 0
                    return {
                        value: void 0,
                        done: true
                    }
                }
            }
        }
    }
}

function* generator(collection) {
    let index = 0

    while (index < collection.length) {
        yield collection[index++]
    }
}

const iterator = new MyIterator(['This', 'arr'])
const gen = generator(['This', 'arr'])

for (const val of iterator) {
    console.log('Value:  ', val)
}

console.log(gen.next().value)
console.log(gen.next().value)

// 4. mediator - for chat

class User {
    constructor(name) {
        this.name = name
        this.room = null
    }

    send(message, to) {
        this.room.send(message, this, to)
    }

    recieve(message, from) {
        console.log(`${from.name} => ${this.name}: ${message}`)
    }
}

class ChatRoom {
    constructor() {
        this.users = {}
    }

    register(user) {
        this.users[user.name] = user
        user.room = this
    }

    send(message, from , to) {
        if (to) {
            to.recieve(message, from)
        } else {
            Object.keys(this.users).forEach(key => {
                if (this.users[key] !== from) {
                    this.users[key].recieve(message, from)
                }
            })
        }
    }
}

const vlad = new User('Vlad')
const lena = new User('Lena')
const ivan = new User('Ivan')

const room = new ChatRoom()

room.register(vlad)
room.register(lena)
room.register(ivan)

vlad.send('hello Lena', lena)
ivan.send('hello everybody')

// 6. observer/dispatcher/publisher/subscriber - one to many dependences (react)

class Subject {
    constructor() {
        this.observers = []
    }

    subscribe(observer) {
        this.observers.push(observer)
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer)
    }

    init(changes) {
        this.observers.forEach(observer => {
            observer.update(changes)
        })
    }
}

class Observer {
    constructor(state = 1) {
        this.state = state
        this.initialState = state
    }

    update(action) {
        switch (action.type) {
            case 'INCREMENT':
                this.state = ++this.state
                break
            case 'DECREMENT':
                this.state = --this.state
                break
            case 'ADD':
                this.state += action.payload
                break
            default:
                return this.initialState
        }
    }
}

const stream$ = new Subject()
const obs1 = new Observer()
const obs2 = new Observer(42)

stream$.subscribe(obs1)
stream$.subscribe(obs2)

stream$.init({type: "ADD", payload: 10})

console.log(obs1.state)
console.log(obs2.state)

// 6. state

class Light {
    constructor(light) {
        this.light = light
    }
}

class RedLight extends Light {
    constructor() {
        super('red')
    }

    sign() {
        return "STOP"
    }
}

class YellowLight extends Light {
    constructor() {
        super('yellow')
    }

    sign() {
        return "WARNING"
    }
}

class GreenLight extends Light {
    constructor() {
        super('green')
    }

    sign() {
        return "GO"
    }
}

class TrafficLight {
    constructor() {
        this.states = [
            new RedLight(),
            new YellowLight(),
            new GreenLight()
        ]
        this.current = this.states[0]
    }

    change() {
        const total = this.states.length
        let idx = this.states.findIndex(light => light === this.current)

        if (idx + 1 < total) {
            this.current = this.states[idx + 1]
        } else {
            this.current = this.states[0]
        }
    }

    sign() {
        return this.current.sign()
    }
}

const traffic = new TrafficLight()
console.log(traffic.sign())

traffic.change()
console.log(traffic.sign())

traffic.change()
console.log(traffic.sign())

// 7. strategy - семейство алгоритмов наследующих объекты в неизменяемом порядке

class Vehicle {
    travelTime() {
        return this.timeTaken
    }
}

class Bus extends Vehicle {
    constructor() {
        super()
        this.timeTaken = 5
    }
}

class Car extends Vehicle {
    constructor() {
        super()
        this.timeTaken = 3
    }
}

class Commute {
    travel(transport) {
        return transport.travelTime()
    }
}

const commute = new Commute()

console.log(commute.travel(new Car()))
console.log(commute.travel(new Bus()))

// 8. template - скелет алгоритма делегирует создание функционала буз изменения базового класса

class Employee {
    constructor(name, salary) {
        this.name = name
        this.salary = salary
    }

    responsibilities() {}

    work() {
        return `${this.name} does ${this.responsibilities()}`
    }

    getSalary() {
        return `${this.name} has salary ${this.salary}`
    }
}

class Developer extends Employee {
    constructor(name, salary) {
        super(name, salary)
    }

    responsibilities() {
        return 'development'
    }
}

class Tester extends Employee {
    constructor(name, salary) {
        super(name, salary)
    }

    responsibilities() {
        return 'testing'
    }
}

const developer = new Developer('Vlad', 10000)
console.log(developer.getSalary())
console.log(developer.work())

const tester = new Tester('Vik', 9000)chain of respon
console.log(tester.getSalary())
console.log(tester.work())


