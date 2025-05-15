// faceverificationController.js
const { exec } = require('child_process');
const path = require('path');

const compareFaces = (storedImagePath, capturedImagePath) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '..', 'face_verification.py');
    exec(`python "${pythonScript}" "${storedImagePath}" "${capturedImagePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Python script error:', stderr);
        return reject({ success: false, message: 'Error executing face verification' });
      }
      try {
        const result = JSON.parse(stdout);
        console.log(`Face comparison result: Success=${result.success}, Message=${result.message}, MSE=${result.mse || 'N/A'}`);
        resolve(result);
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError);
        reject({ success: false, message: 'Invalid response from face verification' });
      }
    });
  });
};

module.exports = { compareFaces };