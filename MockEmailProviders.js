class MockEmailProvider1 {
    constructor() {
      this.name = "Provider1";
    }
    async send(emailData) {
      
      console.log(`Sending email using ${this.name}`);
      if (Math.random() > 0.7) {
        throw new Error("Provider1 failed to send email.");
      }
      return true;
    }
  } 
  class MockEmailProvider2 {
    constructor() {
      this.name = "Provider2";
    }
  
    async send(emailData) {
     
      console.log(`Sending email using ${this.name}`);
      if (Math.random() > 0.7) {
        throw new Error("Provider2 failed to send email.");
      }
      return true;
    }
  }
  
  module.exports = { MockEmailProvider1, MockEmailProvider2 };
  