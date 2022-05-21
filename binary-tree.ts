
class BinaryNode {
    value: number
    left: BinaryNode | null = null
    right: BinaryNode | null = null

    constructor(value: number) {
        this.value = value;
    }

    public insert(value: number): BinaryNode {
        if (value < this.value) {
            if (!this.left) {
                this.left = new BinaryNode(value)
            } else {
                this.left.insert(value)
            }
        } else if (value > this.value) {
            if (!this.right) {
                this.right = new BinaryNode(value)
            } else {
                this.right.insert(value)
            }
        }
        return this;
    }

    public inOrder(orderArr: number[]) {
        if (this.left) {
            this.left.inOrder(orderArr)
        }
        orderArr.push(this.value);

        if (this.right) {
            this.right.inOrder(orderArr)
        }
    }
}


const binaryTree = new BinaryNode(10);

binaryTree.insert(12)
          .insert(11)
          .insert(13)
          .insert(14)
          .insert(15)
          .insert(4)
          .insert(2)
          .insert(7)
          .insert(5)
          .insert(6)
          .insert(20)
          .insert(30)

const order: number[] = []
binaryTree.inOrder(order);
console.log(order)
