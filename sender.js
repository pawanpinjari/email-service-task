const EmailService = require('./EmailService');
const { MockEmailProvider1, MockEmailProvider2 } = require('./MockEmailProviders');

const emailService = new EmailService([new MockEmailProvider1(), new MockEmailProvider2()]);

(async () => {
  await emailService.sendEmail("email1", { to: "user@example.com", subject: "Test", body: "Hello" });
  await emailService.sendEmail("email1", { to: "user@example.com", subject: "Test", body: "Hello" });
  console.log("status",emailService.status); // Check email sending status
})();
