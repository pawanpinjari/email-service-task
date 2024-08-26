class EmailService {
    constructor(providers) {
      this.providers = providers;
      this.sentEmails = new Set(); 
      this.requestTimestamps = []; 
      this.circuitOpen = false; 
      this.failureCount = 0;   
      this.status = {}; 
    }
  
    async sendEmail(emailId, emailData) {
      if (this.circuitOpen) {
        console.log("Circuit breaker is open. Skipping email send.");
        return this.trackStatus(emailId, 'circuit_breaker_open');
      }
  
      if (this.sentEmails.has(emailId)) {
        console.log("Email already sent. Skipping duplicate.");
        return this.trackStatus(emailId, 'duplicate');
      }
  
      if (!this.rateLimitCheck()) {
        console.log("Rate limit exceeded. Skipping email send.");
        return this.trackStatus(emailId, 'rate_limited');
      }
  
      for (let i = 0; i < this.providers.length; i++) {
        const provider = this.providers[i];
        let success = false;
        
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            await this.delay(attempt);
            await provider.send(emailData); 
            success = true;
            this.sentEmails.add(emailId);
            this.trackStatus(emailId, 'sent', provider.name);
            break;
          } catch (error) {
            console.log(`Attempt ${attempt + 1} failed using ${provider.name}:`, error);
          }
        }
  
        if (success) {
          this.failureCount = 0;
          return;
        } else {
          this.failureCount++;
          if (this.failureCount >= 5) {
            this.openCircuitBreaker();
            break;
          }
        }
      }
  
     
      this.trackStatus(emailId, 'failed');
    }
  
    delay(attempt) {
      return new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  
    rateLimitCheck() {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      this.requestTimestamps = this.requestTimestamps.filter(ts => ts > oneMinuteAgo);
  
      if (this.requestTimestamps.length >= 60) {
        return false;
      }
  
      this.requestTimestamps.push(now);
      return true;
    }
  
    trackStatus(emailId, status, provider = null) {
      this.status[emailId] = { status, provider, timestamp: new Date() };
    }
  
    openCircuitBreaker() {
      console.log("Opening circuit breaker.");
      this.circuitOpen = true;
      setTimeout(() => this.closeCircuitBreaker(), 60000);
    }
  
    closeCircuitBreaker() {
      console.log("Closing circuit breaker.");
      this.circuitOpen = false;
      this.failureCount = 0;
    }
  }
  
  module.exports = EmailService;
  