// src/consumer.js
require('dotenv').config();

const ExportsService = require('./services/postgres/ExportsService');
const MailSender = require('./services/mail/MailSender');
const ConsumerService = require('./services/rabbitmq/ConsumerService');

const init = async () => {
  const exportsService = new ExportsService();
  const mailSender = new MailSender();
  const consumerService = new ConsumerService(exportsService, mailSender);

  console.log('Consumer service is running...');
};

init();
