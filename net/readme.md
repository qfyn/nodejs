net学习---针对网络信息

net.createServer 创建一个TCP服务器
net.createConnection 创建一个TCP套接字
net.connect 连接到TCP服务器


net.Server 创建一个TCP服务器



const socket = new net.Socket 创建一个TCP套接字
socket.write 写入数据到套接字
socket.end 结束写入数据到套接字
socket.destroy 销毁套接字
socket.close 关闭套接字
socket.setEncoding 设置字符编码
socket.setKeepAlive 设置保持活动状态
socket.setNoDelay 设置禁用Nagle算法
socket.setTimeout 设置套接字的超时时间


cosnt blockList = new net.BlockList() 用于禁用对特定 IP 地址、IP 范围或 IP 子网的入站或出站访问的规则
blockList.addAddress 添加一个 IP 地址到阻止列表
blockList.addRange 添加一个 IP 范围到阻止列表
blockList.addSubnet 添加一个 IP 子网到阻止列表


const socketAddress = new net.SocketAddress(address, port) 创建一个SocketAddress 对象
socketAddress.address 获取IP地址
socketAddress.port 获取端口
socketAddress.family 获取'ipv4' 或 'ipv6'


