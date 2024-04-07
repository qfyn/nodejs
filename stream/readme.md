stream流学习

const readable = fs.createReadStream(path[, options])读取流
const writeable = fs.createWriteStream(path[, options])写入流
 
readable.pipe(writeable) 管道流 ---- 用于将数据从一个流传递到另一个流 --- 将readable中读到的数据写入writeable中的文件中

writeable.on('finish', () => {}) 监听写入完成事件
writeable.on('error', (err) => {}) 监听写入错误事件
writeable.on('close', () => {}) 监听写入关闭事件
writeable.end([chunk[, encoding]]) 结束写入
writeable.write(chunk[, encoding[, fd]]) 写入数据
writeable.cork() 强制所有写入的数据都缓存在内存中, 主要目的是适应将几个小块快速连续写入流的情况
writeable.uncork() 刷新缓冲的数据.使用 process.nextTick() 推迟对 writable.uncork() 的调用。这样做允许对在给定 Node.js 事件循环阶段中发生的所有 writable.write() 调用进行批处理。
writeable.destroy() 销毁流



readable.on('data', (chunk) => {}) 监听读取事件
readable.on('end', () => {}) 监听读取完成事件
readable.on('error', (err) => {}) 监听读取错误事件
readable.on('close', () => {}) 监听读取关闭事件
readable.on('pause', () => {}) 监听读取暂停事件
readable.on('resume', () => {}) 监听读取恢复事件
readable.pause() 暂停读取
readable.resume() 恢复读取
readable.pipe(writeable) 管道流
readable.unpipe(writeable) 取消管道流
readable.unshift(chunk[, encoding]) 向流中添加数据
readable.wrap(oldStream) 将一个可读流包装为可写流 
readable.push(chunk[, encoding]) 将数据推入流中
readable.setEncoding(encoding) 设置流的编码


pipeline(source, destination[, options], callback) 管道流---读取流，处理流，写入流