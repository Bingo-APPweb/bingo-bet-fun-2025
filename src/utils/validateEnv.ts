function validateEnv() {
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_DATABASE_URL',
      'VITE_YOUTUBE_API_KEY'
    ];
  
    const missingVars = requiredVars.filter(
      varName => !process.env[varName]
    );
  
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables:\n${missingVars.join('\n')}`
      );
    }
  
    // Validações específicas
    if (!process.env.VITE_FIREBASE_DATABASE_URL?.includes('firebaseio.com')) {
      throw new Error('Invalid Firebase Database URL');
    }
  
    if (!process.env.VITE_YOUTUBE_API_KEY?.startsWith('AIza')) {
      throw new Error('Invalid YouTube API Key format');
    }
  
    console.log(`✅ Environment validated: ${process.env.NODE_ENV}`);
  }
  
  export default validateEnv;