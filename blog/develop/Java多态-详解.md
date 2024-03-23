---
slug: learn-polymorphism
title: Java多态(详解)
date: 2023-10-08
authors: mochi
tags: [学习, code, Java]
keywords: [学习, code, Java]
image: https://tse1-mm.cn.bing.net/th/id/OIP-C.U-eZ7JkXmXL-QOXAkMm1nAHaC9?rs=1&pid=ImgDetMain
---
<!-- truncate -->

## 1.基本介绍

### 1.1多态的理解

    1.多态允许不同类型的对象对同一消息做出响应。在Java中，多态可以通过继承、接口和重学方法来实现。

    2.其实就是一种能力——同一个行为具有不同的表现形式活形态；换句话说就是，执行一段代码，Java在运行时能根据对象的不同产生不同的结果。

```tex
例子：比如有动物(Animal)之类别(Class), 而且由动物继承出类别鸡(Chicken)和类别狗(Dog)，并对同一源自类别动物(父类)之一消息有不同的响应，如类别动物有"叫()"之动作，而类别鸡会"啼叫()", 类别狗则会"吠叫()"，则称之为多态。
```

    3.具体来说，多态分为**编译时多态**和**运行时多态**。**编译时多态也称为重载**，是指在同一个类中定义了多个同名但参数不同的方法，编译器根据调用方法时传递的参数类型来匹配具体要调用的方法。**运行时多态也称为重写**，是指子类重写了父类的方法，当通过父类引用子类对象的方法是，会运行子类中重写的方法而不是父类中的方法。通过多态实现的代码更加灵活，易于扩展，降低了代码的耦合度。同时，多态也是面对对象编程中的一种基本原则之一，能够使程序的可维护性和可读性更好。

    4.**多态就是同一个接口，使用不同的实例而执行不同操作**，**多态性**是对象多种表现形式的体现。

### 1.2多态的优点

    1.**可扩展性**：通过多态，代码可以更容易地扩展和修改，而不会影响现有的代码。通过继承子类并重写其父类的方法，您可以添加新的功能或修改现有的行为。

    2.**灵活性**：多态使代码更具灵活性，因为它允许动态地确定对象的类型和执行相应的方法。这意味着您可以编写更通用的代码，可以处理许多不同类型的对象，从而使代码更加灵活和可维护。

    3.**代码复用**: 多态提供了代码复用的机会。通过创建一个通用的父类来实现代码重用，并通过子类进行继承和重写，在不同的场景中使用相同的代码来处理不同的对象。

    4.**降低了耦合性**: 多态还有助于降低代码之间的耦合性。通过使用父类的引用来处理子类对象，您可以减少代码中的直接依赖关系，从而使代码更加松散耦合，更容易理解和维护。

### 1.3多态存在的三个必要条件

- 继承
- 重写
- 父类引用指向子类对象：Parent p = new Child();

```java
class Shape {  
    void draw() {}  
}  
   
class Circle extends Shape {  
    void draw() {  
        System.out.println("Circle.draw()");  
    }  
}  
   
class Square extends Shape {  
    void draw() {  
        System.out.println("Square.draw()");  
    }  
}  
   
class Triangle extends Shape {  
    void draw() {  
        System.out.println("Triangle.draw()");  
    }  
}
```

当使用多态方式调用方法时，首先检查父类中是否有该方法，如果没有，则编译错误；如果有，再去调用子类的同名方法。

多态的好处：可以使程序有良好的扩展，并可以对所有的类对象进行通用处理。

以下是一个多态实例的演示，详细说明请看注释：

```java
//Test.java 文件代码：
public class Test { 
    public static void main(String[] args) { 
        show(new Cat()); // 以 Cat 对象调用 show 方法 
        show(new Dog()); // 以 Dog 对象调用 show 方法 
  
        Animal a = new Cat(); // 向上转型 
        a.eat(); // 调用的是 Cat 的 eat 
        Cat c = (Cat)a; // 向下转型 
        c.work(); // 调用的是 Cat 的 work 
    } 
  
    public static void show(Animal a) { 
        a.eat(); // 类型判断 
        if (a instanceof Cat) { // 猫做的事情 
            Cat c = (Cat)a; 
            c.work(); 
        } else if (a instanceof Dog) { // 狗做的事情 
            Dog c = (Dog)a; 
            c.work(); 
        } 
    } 
}

abstract class Animal { 
    abstract void eat(); 
} 

class Cat extends Animal { 
    public void eat() { 
        System.out.println("吃鱼"); 
    } 
    public void work() { 
        System.out.println("抓老鼠"); 
    } 
} 

class Dog extends Animal { 
    public void eat() { 
        System.out.println("吃骨头"); 
    } 
    public void work() { 
        System.out.println("看家"); 
    } 
}
```

执行结果：

```tex
吃鱼
抓老鼠
吃骨头
看家
吃鱼
抓老鼠
```

### 1.4多态的具体体现

对象的多态使多态的核心和重点。

规则：

- 一个对象的编译类型与运行类型可以不一致；
- 编译类型在定义对象时，就确定了，不能改变，而运行类型时可以改变的；
- 编译类型看定义对象时 = 号的左边，运行类型看 = 号的右边。

### 1.5入门案例

说明：

- 定义一个Person类为父类，定义Student类和Teacher类作为子类继承父类；
- Person类拥有mission()方法；
- Student类和Teacher类重写父类的mission()方法；
- 最后在main函数中利用多态形式创建对象。

(1) 定义父类Person类：

```java
package Polymorphism;

public class Person {
    public void mission() {
        System.out.println("人要好好活着！");
    }
}
```

(2) 定义子类Student类：

```java
public class Student extends Person {
    @Override
    public void mission() {
        System.out.println("学生要好好学习！");
    }
}
```

（3）定义子类 Teacher 类

```java
public class Teacher extends Person {
    @Override
    public void mission() {
        System.out.println("老师要好好教书！");
    }
}

```

（4）在 Test01 类中编写 main 函数，体现多态性\

```java
//多态性
public class Test01 {
    public static void main(String[] args) {
        //多态形式，创建对象
        //注意编译类型看等号左边，运行类型看等号右边
        Person p1 = new Student();  

        //此时调用的是 Student 类 的 mission() 方法
        p1.mission();

        //多态形式，创建对象
        Person p2 = new Teacher();

        //此时调用的是 Teacher 类 的 mission() 方法
        p2.mission();
    }
}

```

（5）运行结果

```tex
学生要好好学习！
老师要好好教书！
```

### 1.6多态的实现方式

主要有以下几种：

1. 方法覆盖(覆盖、重写)：即父类中的方法被子类重写，在运行时通过对象的实际类型调用执行相应的方法。此时，调用父类的引用会被转换成子类的对象，这就是向上转型。
2. 抽象类和接口：Java中的抽象类和接口都可以定义规范(方法的签名)，由具体的子类去实现这些规范。在实现这些规范的过程中，子类可以自行定义具体的实现方式，实现多态的效果。
3. 方法重载(重载、重复载入)：Java中的方法重载通过定义同名的方法，但是参数列表不同，从而实现相同的功能，比如println()就有多个重载版本，分别可以接受不同的参数类型。

```tex
需要注意的是，实现多态的前提是存在继承关系。此外，还需要注意到方法的参数列表和返回类型均参与多态的决策过程中。在继承和多态的过程中，还需要注意一些细节和设计模式，比如向上转型、向下转型、静态方法、final方法、模板模式等。
```

```text
多态与抽象类的关系是什么？
多态与抽象类是密不可分的，多态可以通过抽象类来实现，抽象类是一种特殊的类，它可以定义抽象方法，抽象方法只有定义，没有实现，子类必须实现抽象方法，从而实现多态。
多态与接口的关系是什么？
多态与接口时密不可分的，多态可以通过接口来实现，接口时一种特殊的类，它可以定义抽象方法，抽象方法只有定义，没有实现，实现接口的类必须实现接口中定义的所有方法，从而实现多态。
```

### 1.7多态的实现原理是什么？

多态的实现原理是通过多态性来实现的（多态性的实现依赖于Java语言的动态绑定机制），它是指一个接口可以有多种不同的实现方式。多态性可以通过继承、抽象类和接口来实现，它可以让程序更加灵活，可以根据不同的情况来选择不同的实现方式。

## 2.多态的转型

### 2.1向上转型

- 本质：父类的引用指向子类的对象
- 特点：

  - 编译类型看左边，运行类型看右边
  - 可以调用父类的所有成员（需遵守访问权限）
  - 不能调用子类的特有成员
  - 运行效果看子类的具体实现
- 语法：

```java
父类类型 引用名 = new 子类类型();
//右侧创建一个子类对象，把它当作父类看待使用
```

### 2.2向下转型

- 本质：一个已经向上转型的子类对象，将父类引用转为子类引用
- 特点：

  - 只能强制转换父类的引用，不能强制转换父类的对象
  - 要求父类的引用必须指向的是当前目标类型的对象
  - 当向下转型后，可以调用子类类型中所有的成员
- 语法：

```java
子类类型 引用名 = (子类类型) 父类引用;
//用强制类型转换的格式，将父类引用类型转为子类引用类型
```

### 2.3代码示例

说明：

- 定义一个Person类作为父类，定义Student类和Teacher类作为子类继承父类；
- Person类拥有mission()方法；
- Student类和Teacher类重写父类的mission()方法并且分别拥有各自的特有的score()方法和salary()方法；
- 最后在main函数中演示转型。

（1）定义类：

```java
public class Person {
    public void mission() {
        System.out.println("人要好好活着！");
    }
}

class Student extends Person {
    @Override
    public void mission() {
        System.out.println("学生要好好学习！");
    }

    public void score() {
        System.out.println("学生得到好成绩！");
    }
}

class Teacher extends Person {
    @Override
    public void mission() {
        System.out.println("老师要好好教书！");
    }

    public void salary() {
        System.out.println("老师得到高工资！");
    }
}

```

（2）在 Test02 类中编写 main 函数，演示转型

```java
//转型演示
public class Test02 {
    public static void main(String[] args) {
        //向上转型（自动类型转换）
        Person p1 = new Student();

        //调用的是 Student 的 mission
        p1.mission(); 

        //向下转型
        Student s1 = (Student)p1;

        //调用的是 Student 的 score
        s1.score();
    }
}

```

（3）运行结果：

```
学生要好好学习！
学生得到好成绩！
```

### 2.4转型移除

    2.4.1类型转换异常

    说明：使用强转时，可能出现异常，对2.3代码示例中的Test02类重新编写，演示转型异常。

    示例代码：

```java
//异常演示
public class Test02 {
    public static void main(String[] args) {
        //向上转型
        Person p1 = new Student();

        //调用的是 Student 的 mission
        p1.mission(); 

        //向下转型
        Teacher t1 = (Teacher) p1;

        //运行时报错
        p1.salary();
    }
}
```

解释：这段代码在运行时出现了 ClassCastException 类型转换异常，原因是 Student 类与 Teacher 类 没有继承关系，因此所创建的是Student 类型对象在运行时不能转换成 Teacher 类型对象。

2.4.2 instanceof 比较操作符

为了避免上述类型转换异常的问题，我们引出 instanceof 比较操作符，用于判断对象的类型是否为XX类型或者XX类型的子类型。

- 格式：对象 instanceof 类名称
- 解释：这将会得到一个boolean值结果，也就是判断前面的对象能不能当作后面类型的实例
- 代码示例：

```java
//演示 instanceof 的使用
public class Test03 {
    public static void main(String[] args) {
        //向上转型
        Person p1 = new Student();

        //调用的是 Student 的 mission
        p1.mission();

        //向下转型
        //利用 instanceof 进行判断
        if(p1 instanceof Student) {	//判断对象 p1 是否是 Student 类 的实例
            Student s1 = (Student)p1;
            s1.score();  //调用的是 Student 的 score
            //上面这两句也可简写为 ((Student) p1).score();
	} else if(p1 instanceof Teacher) { 
            //判断对象 p1 是否是 Teacher 类 的实例
            Teacher t1 = (Teacher)p1;
            t1.salary(); //调用的是 Teacher 的 salary
	    //同理，上面这两句也可简写为 ((Teacher) p1).salary();
	}
    }
}
```

运行结果：

```tex
学生要好好学习！
学生得到好成绩！
```

## 3.动态绑定(重点)

- 当调用对象方法的时候，该方法会和该对象的运行类型绑定；
- 当调用对象属性时，没有动态绑定机制，即哪里声明，哪里使用。
- 代码示例：

```java
//演示动态绑定
public class DynamicBinding {
    public static void main(String[] args) {
        //向上转型（自动类型转换）
	//程序在编译阶段只知道 p1 是 Person 类型
	//程序在运行的时候才知道堆中实际的对象是 Student 类型
	Person p1 = new Student();  

	//程序在编译时 p1 被编译器看作 Person 类型
	//因此编译阶段只能调用 Person 类型中定义的方法
	//在编译阶段，p1 引用绑定的是 Person 类型中定义的 mission 方法（静态绑定）
	//程序在运行的时候，堆中的对象实际是一个 Student 类型，而 Student 类已经重写了 mission 方法
	//因此程序在运行阶段对象中绑定的方法是 Student 类中的 mission 方法（动态绑定）
	p1.mission();
    }
}

//父类
class Person {
    public void mission() {
        System.out.println("人要好好活着！");
    }
}

//子类
class Student extends Person {
    @Override
    public void mission() {
        System.out.println("学生要好好学习！");
    }
}
```

运行结果：

```tex
学生要好好学习！
```

**多态与动态绑定的关系是什么？**

多态与动态绑定时密不可分的，多态可以通过动态绑定来实现，动态绑定可以在运行时根据对象的类型来调用不同的方法，从而实现动态。

（动态绑定时指在运行时根据对象的类型来调用不同的方法，它可以让程序更加灵活，可以根据不同的情况来选择不同的实现方式）

## 4.应用

### 4.1多态数组

多态数组: 数组的定义类型为父类类型，里面保存的实际元素为子类型。

代码示例：（循环调用基类对象，访问不同派生类的方法）

说明：

- 定义一个Person类作为父类，定义Student类和Teacher类作为子类继承父类；
- Person类拥有name属性以及mission()方法；
- Student类和Teacher类拥有各自特有的score和salary属性，除此之外，重写父类的mission()方法；
- 要求：最后在main函数中创建一个Person对象、一个Student对象和一个Teacher对象，统一放在数组里，并调用每个对象的mission()方法。

（1）父类 Person 类：

```java
public class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    // getter 和 setter
    public String getName() {
	return name;
    }
    public void setName(String name) {
	this.name = name;
    }

    // mission() 方法
    public String mission() {
	return name + "\t" + "要好好活着";
    }
}
```

（2）子类 Student 类

```java
public class Student extends Person {
    private double score;

    public Student(String name, double score) {
	super(name);
	this.score = score;
    }

    public double getScore() {
	return score;
    }

    public void setScore(double score) {
	this.score = score;
    }

    //重写父类的say方法
    @Override
    public String mission() {
	return super.mission() + " score =" + score + " 要好好学习！";
    }
}
```

（3）子类 Teacher 类

```java
public class Teacher extends Person {
    private double salary;

    public Teacher(String name, double salary) {
        super(name);
	this.salary = salary;
    }

    public double getSalary() {
	return salary;
    }

    public void setSalary(double salary) {
	this.salary = salary;
    }

    //重写父类的 mission 方法
    @Override
    public String mission() {
	return super.mission() + " salary =" + salary + " 要好好教书！";
    }
}
```

（4）PolyArray 类 中编写 main 函数

```java
/*
 * 演示多态数组
 * 创建一个 Person 对象 
 * 创建一个 Student 对象 
 * 创建一个 Teacher 对象
 * 统一放在数组里，并调用每个对象的 mission() 方法。
 */
public class PolyArray {
    public static void main(String[] args) {
        Person[] persons = new Person[3];
	persons[0] = new Person("小汤");
	persons[1] = new Student("小韬", 100);
	persons[2] = new Teacher("小蒲", 10000);

	//循环遍历多态数组，调用 mission
	for(int i = 0; i < persons.length; i++) {
            //此处涉及动态绑定机制
            // Person[i] 编译类型是 Person ,运行类型根据实际情况由 JVM 判断
                System.out.println(persons[i].mission());  
        }
    }
}
```

（5）运行结果：

```tex
小汤	要好好活着！
小韬	要好好活着！ score = 100.0 要好好学习！
小蒲	要好好活着！ salary = 10000.0 要好好教书！
```

### 4.2多态参数

多态参数：方法定义的形参类型为父类类型，实参类型允许为子类类型。

代码示例：

说明：

- 定义一个Person类作为父类，定义Student类和Teacher类作为子类继承父类；
- Person类拥有name属性
- Student类和Teacher类拥有各自特有的study() 和 teach() 方法；
- 要求： 最后在main函数中编写test() 方法，功能是调用Stduent类的study()或Teacher类的teach()方法，用于演示多态参数的使用。

```java
//演示多态参数
public class PolyParameter { 
    public static void main(String[] args) {
        Student s1 = new Student("小蓝同学");
	Teacher t1 = new Teacher("小绿老师");

	//需先 new 一个当前类的实例化，才能调用 test 方法
	PolyParameter polyParameter = new PolyParameter();

	//实参是子类
	polyParameter.test(s1);
	polyParameter.test(t1);
    }

    //定义方法test，形参为 Person 类型(形参是父类)
    //功能：调用学生的study或教师的teach方法
    public void test(Person p) {
        if (p instanceof Student){
            ((Student) p).study();   //向下转型
        } else if (p instanceof Teacher) {
            ((Teacher) p).teach();  //向下转型
        }  
    }
}
 
//父类
class Person {
    private String name;

    //有参构造
    public Person(String name) {
        this.name = name;
    }

    // getter 和 setter
    public String getName() {
	return name;
    }
    public void setName(String name) {
	this.name = name;
    }
}

//子类
class Student extends Person {

    public Student(String name) {
	super(name);
    }

    // study() 方法
    public void study() {
        System.out.println(super.getName() + "\t" + "正在好好学习");
    }
}

class Teacher extends Person {

    public Teacher(String name) {
	super(name);
    }

    // teach() 方法
    public void teach() {
	System.out.println(super.getName() + "\t" + "正在好好教书");
    }
}
```

运行结果：

```tex
小蓝同学	正在好好学习
小绿老师	正在好好教书
```

## 5、多态的应用场景？

当面试官问到“你在什么场景下使用Java多态？”时，你可以这样回答：

1. 首先，我们可以**在基于继承的类体系中经常应用多态**，比如父类定义了一些基础的方法和属性，而不同的子类则可以重写这些方法或者增加自己的方法和属性，这些不同的子类可以使用父类的引用来调用这些方法或属性，使用多态可以增加代码的灵活性和可扩展性。
2. 此外**在面向接口编程的场景下也经常使用多态**，因为接口可以定义一些公共的方法和属性，而具体实现可以由不同的类来实现，使用接口类型的变量可以调用不同实现类的方法。
3. 在具体的业务场景中，**事件处理也是常用的多态场景**。由于不同事件的处理方式不同，所以可以利用多态来实现不同事件的处理逻辑，更好地进行事件的管理和处理。
4. 另外，**泛型编程也常常使用到多态**，在定义泛型类和方法时，可以使用多态约束泛型类型的范围，实现更灵活和安全的数据结构。
5. 总之，多态是Java面向对象编程中重要的特性之一，适用于各种场景，可以提高代码的可维护性、可扩展性和可读性。

## 6、多态的特点？

当面试官问到“请谈一下Java中多态的特点”时，可以考虑从以下几个方面来回答（多角度回答，重在展示对知识点的理解和掌握）：

1. 多态的**概念和基本原理**
2. 多态的**应用场景**：可以举一些具体的实例，如使用多态进行互动、实现策略设计模式、使用Java多态实现访问数据库等。
3. 多态**与继承、接口的关系**：即多态在Java中是如何与继承、接口等概念相结合的。可以从多态与继承之间的关系、多态与接口的实现等方面来回答。
4. 多态的**风险和限制**：即多态在Java编程中可能会带来的一些风险和限制。例如，子类重写了父类的方法，但是不兼容原来的实现，导致向上转型后出现问题等。

# 菠萝屋祝你愉快的度过每一天！感谢您的阅读。
