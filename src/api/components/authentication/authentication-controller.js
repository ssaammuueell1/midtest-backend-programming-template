const { errorResponder, errorTypes } = require('../../../core/errors');
const { User } = require('../../../models');
const authenticationServices = require('./authentication-service');
const logger = require('../../../core/logger')('app');

/**
 * Tangani permintaan login
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @returns {object}
 */
async function login(request, response, next) {
  const { email, password } = request.body;
  // Dapatkan tanggal dan waktu saat ini
  const currentDate = new Date();
  const formattedDateTime = `${currentDate.toISOString().slice(0, 16)}`;

  try {
    // Periksa kredensial login
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    // Jika login gagal
    if (!loginSuccess) {
      // Dapatkan jumlah attemps gagal untuk email ini
      const failedAttempts = authenticationServices.loginAttempts[email] || 0;
      // Hitung sisa percobaan
      const remainingAttempts =
        authenticationServices.MAX_FAILED_LOGIN_ATTEMPTS - failedAttempts;

      // Tambahkan penghitung percobaan gagal dan log kegagalan
      authenticationServices.loginAttempts[email] = failedAttempts + 1;
      logger.info(
        `[${formattedDateTime}] Pengguna ${email} gagal login. Sisa percobaan: ${remainingAttempts}`
      );

      // Jika jumlah percobaan maksimum tercapai, berikan timeout kepada user
      if (failedAttempts >= authenticationServices.MAX_FAILED_LOGIN_ATTEMPTS) {
        logger.info(
          ` Pengguna ${email} mencoba login, namun mendapat error 403 karena telah melebihi batas percobaan.`
        );
        // Tunda untuk waktu timeout
        await new Promise((resolve) =>
          setTimeout(resolve, authenticationServices.LOCKOUT_TIME)
        );
        // Reset percobaan gagal setelah periode timeout
        logger.info(
          `Pengguna: ${email} dapat mencoba login kembali karena telah lebih dari 30 menit sejak penerapan batas. Percobaan direset kembali ke 0`
        )((authenticationServices.loginAttempts[email] = 0));

        // error untuk percobaan login yang terlalu banyak gagal
        throw errorResponder(
          errorTypes.TOO_MANY_FAILED_LOGIN_ATTEMPTS,
          'Terlalu banyak percobaan login yang gagal. Silakan coba lagi nanti.'
        );
      }

      // error untuk kredensial tidak valid
      const message = `[${formattedDateTime}] Pengguna ${email} gagal login. Sisa percobaan: ${remainingAttempts}`;
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, message);
    }

    // Jika login berhasil, reset penghitung percobaan gagal, log keberhasilan, dan kembalikan respons JSON dengan detail login
    authenticationServices.loginAttempts = 0;
    logger.info(`Pengguna ${email} berhasil login.`);
    logger.info(`Pengguna ${email} berhasil logout.`);
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
