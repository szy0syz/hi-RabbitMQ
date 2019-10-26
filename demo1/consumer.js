const amqp = require('amqplib');

try {
  async function consumer() {
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
    const queueName = 'helloworldQueue';

    //* 4. 声明队列，交换机默认为 AMQP default

    //* 5. 消费
    await channel.consume(queueName, msg => {
      console.log('Consumer: ', msg.content.toString());
      channel.ack(msg);
    });
  }

  consumer();
} catch (error) {
  console.error(error);
}
