// src/services/rabbitmq/ConsumerService.js
const amqp = require('amqplib');
const config = require('../../utils/config');

class ConsumerService {
  constructor(exportsService, mailSender) {
    this._exportsService = exportsService;
    this._mailSender = mailSender;

    this._consume();
  }

  async _consume() {
    try {
      const connection = await amqp.connect(config.rabbitMq.server);
      const channel = await connection.createChannel();

      await channel.assertQueue('export:playlist', {
        durable: true,
      });

      channel.consume('export:playlist', async (message) => {
        try {
          const { playlistId, targetEmail } = JSON.parse(
            message.content.toString(),
          );

          const playlist = await this._exportsService.getPlaylistById(
            playlistId,
          );

          await this._mailSender.sendEmail(
            targetEmail,
            JSON.stringify(playlist),
          );

          channel.ack(message);
        } catch (error) {
          console.error('Error processing message:', error);
          channel.nack(message, false, false);
        }
      });
    } catch (error) {
      console.error('Failed to consume messages:', error);
    }
  }
}

module.exports = ConsumerService;
