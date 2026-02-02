const SECRET_PATTERNS = [
    /api[_-]?key\s*[:=]\s*['"][a-z0-9]{20,}['"]/i,
    /sk-[a-z0-9]{20,}/i,
    /AKIA[0-9A-Z]{16}/,
    /AIza[0-9A-Za-z\-_]{35}/,
    /token\s*[:=]\s*['"][a-z0-9]{20,}['"]/i,
    /password\s*[:=]\s*['"][^'"]{8,}['"]/i
  ];
  
  function scanForSecrets(text) {
    const found = [];
    
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) {
        found.push(pattern.source);
      }
    }
    
    return found;
  }
  
  module.exports = { scanForSecrets };