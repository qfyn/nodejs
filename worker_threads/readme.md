Worker_threads工作线程学习

Worker 代表独立的 JavaScript 执行线程。使用new Worker(path, options) 创建一个新的 Worker 对象

isMainThread 判断是否是主线程

postMessage 向主线程发送消息

onmessage 监听主线程发送的消息

terminate 终止 Worker 线程

parentPort 主线程的端口

workerData 主线程传递给 Worker 线程的数据

MessageChannel 创建一个新的 MessageChannel 对象---用户双向通信 --- 例如：主线程用port2发送并接收消息，子线程用port1发送并接收消息
port1 用于接收消息的端口
port2 用于发送消息的端口

receiveMessageOnPort 监听指定端口的消息