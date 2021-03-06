# Java并发控制

### 1.线程安全

##### 什么是线程安全？

线程安全是指在多线程并发的情况下，如果不用考虑这些线程在运行环境下的调度和交替执行，也不需要进行额外的同步，调用这个对象的方法都能获得预期的结果，那么就是线程安全。

### 2.锁优化

java的锁机制的性能开销主要在线程的休眠与唤醒上面，因为这需要转入到核心态线程来。这是影响性能的一大原因。而**java**存在机制来减少转入核心态的次数从而减少性能开销。主要的方式如下：

- 锁自旋以及适应性锁自旋：说到底在发生共享资源竞争时候，需要进入到休眠状态的线程不直接进行休眠，而是使用有条件空循环来实现等待。如果其他占用临界区的线程执行时间比较短的话，是可以避免线程的休眠和唤醒的。
- 锁消除：java在编译阶段，能够检测某些不会存在竞争的临界资源，把程序设定的锁进行消除。
- 锁粗化：如果一连串工作需要进行加锁操作，那么在这一连串工作的最外边设置锁，这样可以减少锁的使用，从而提升性能。
- 偏向锁：如果一个临界区理论上是存在多个线程同时竞争同个资源的情况，但在实际生产中是很长时间都不会出现竞争同个资源的情况。那么程序员在设计的时候需不需要用到锁呢？用了会浪费资源，不用的话可能会出现异常情况。**java**提供一种机制，如果一个临界区在同个时间段只有一个线程去访问的话，只个**java**内部的偏向锁，也就是偏向这个线程，不会使用锁来进行同步。
- 轻量锁：偏向锁在锁定的时候，如果其他线程访问到这个临界区，那么就会变成轻量级锁。新来的线程会进行适度的自旋，如果时间长或者在自旋的时候又有一个线程过来了，那么就会变成重量锁。