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

      // Set prefetch untuk memproses 1 pesan pada satu waktu
      channel.prefetch(1);

      channel.consume('export:playlist', async (message) => {
        try {
          const { playlistId, targetEmail } = JSON.parse(
            message.content.toString(),
          );

          console.log(`Processing export request for playlist: ${playlistId}`);

          const playlist = await this._exportsService.getPlaylistById(
            playlistId,
          );

          await this._mailSender.sendEmail(
            targetEmail,
            JSON.stringify(playlist),
          );

          console.log(`Export sent successfully to: ${targetEmail}`);

          // Acknowledge pesan jika berhasil
          channel.ack(message);
        } catch (error) {
          console.error('Error processing message:', error);

          // PENTING: Jika playlist tidak ditemukan atau error lainnya,
          // jangan kembalikan pesan ke queue (hindari infinite loop)
          // Acknowledge pesan untuk menghapusnya dari queue
          channel.ack(message);

          // Alternatif: Jika ingin menyimpan pesan yang gagal,
          // bisa kirim ke dead letter queue
          // channel.nack(message, false, false);
        }
      });
    } catch (error) {
      console.error('Failed to consume messages:', error);

      // Retry connection setelah 5 detik jika gagal
      setTimeout(() => this._consume(), 5000);
    }
  }
}

module.exports = ConsumerService;
