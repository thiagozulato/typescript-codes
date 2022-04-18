function createId(): string {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// Impl
interface IEqualityComparer<T = any> {
  equal(x: T, y: T): boolean;
}

// Domain
abstract class Entity {
  public readonly Id: string;

  constructor() {
    this.Id = createId();
  }
}

// Entities
class Person extends Entity {
  constructor(public nome: string) {
    super();
  }
}

// Impl Comparer for Person
class PessoComparer implements IEqualityComparer<Person> {
  equal(x: Person,y: Person): boolean {
    return x.Id === y.Id
  }
}

function comparer<T>(x: T, y: T, iComparer: IEqualityComparer<T>): boolean {
  return iComparer.equal(x, y);
}

let p: Person =  new Person("Testing");
let p2: Person = p;

// Shoudl be true
console.log(comparer(p, p2, new PessoComparer()));

p2 = new Person("Hello World");

// Shoudl be false
console.log(comparer(p, p2, new PessoComparer()));