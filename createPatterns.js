//Create Patterns

//1. constructor

class Person {
    constructor(name) {
        this.name = name
    }

    showName() {
        return `hello ${this.name}`
    }
}

const peter = new Person('Peter')
console.log(peter.showName())

//2.Factory

class SimpleMembership {
    constructor(name) {
        this.name = name
        this.price = 50
    }
}

class StandartMembership {
    constructor(name) {
        this.name = name
        this.price = 150
    }
}

class PremiumMembership {
    constructor(name) {
        this.name = name
        this.price = 250
    }
}

class MemberFactory {
    static list() {
        return {
            simple: SimpleMembership,
            standart: StandartMembership,
            premium: PremiumMembership
        }
    }

    create(name, type = 'simple') {
        const Membership = MemberFactory.list[type] || MemberFactory.list.simple
        const member = new Membership(name)
        member.type = type
        member.define = function() {
            console.log(`${this.name} ${this.price}`)
        }
        return member
    }
}

const factory = new MemberFactory()

const members = [
    factory.create('Anna'),
    factory.create('Vlad', 'premium'),
    factory.create('Ola', 'standart')
]

console.log(members)

// 3. prototype

const car = {
    wheels: 4,

    init() {
        console.log(`I have ${this.wheels} wheels', my owner is ${this.owner}`)
    }
}

const carWithOwner = Object.create(car, {
    owner: {
        value: 'Ivan'
    }
})

carWithOwner.init()

// 4. singletone

class Database {
    constructor(data) {
        if (Database.exists) {
            return Database.instance
        }
        Database.instance = this
        Database.exists = true
        this.data = data
    }

    getData() {
        return this.data
    }
}

const mongo = new Database('MongoDB')
console.log(mongo.getData())

const mysql = new Database('MySQL')
console.log(mysql.getData())


