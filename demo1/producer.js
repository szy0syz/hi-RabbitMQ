const amqp = require('amqplib');

try {
  async function producer() {
    //* 1. 创建链接对象
    const connection = await amqp.connect('amqp://localhost:5672');
    connection.on('error', function(error) {
      console.log(error);
      if (error.message.indexOf('Channel closed by server: 404') > -1) {
        console.log('Channel closed by server');
      }
    });

    //* 2. 获取通道
    const channel = await connection.createChannel();

    //* 3. 声明参数
    const routingKey = 'helloworldQueue';
    const msg = 'hello world';

    for (let i = 0; i < 5; i++) {
      //* 4. 发送消息
      await channel.publish('', routingKey, Buffer.from(`${msg} 第${i}条消息`));
    }
    console.info('[info] 执行完毕，准备关闭channel。');
    await channel.close();
  }

  producer();
} catch (error) {
  console.error(error);
}
