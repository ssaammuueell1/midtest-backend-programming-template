const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * get user untuk menerima respons yang sudah di pagination, filter, dan di sort
 * @param {number} pageNumber - Page number
 * @param {number} pageSize - Number of items per page
 * @param {string} search - Search query
 * @param {string} sort - Sort query
 * @returns {Array}
 */
async function getUsers(pageNumber = 1, pageSize = 10, search, sort) {
  // mengambil data dari database
  let users = await usersRepository.getUsers();

  // memfilter data yang di dapat berdasarkan input di API (field apa dan value apa yang ingin dijadikan patokan)
  if (search) {
    const [field, value] = search.split(':');
    users = users.filter((user) =>
      user[field].toLowerCase().includes(value.toLowerCase())
    );
  }

  // mengurutkan data yang dicari berdasar ascending atau descending (tidak case sensitive)
  if (sort) {
    const [field, order] = sort.split(':');
    users.sort((a, b) => {
      if (order === 'asc') {
        return a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1;
      } else if (order === 'desc') {
        return a[field].toLowerCase() < b[field].toLowerCase() ? 1 : -1;
      }
    });
  }

  // logika kalkulasi untuk memulai dan mengakhiri pagination
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = pageNumber * pageSize;

  // memberikan respon total item yang terdapat dalam database
  const totalItems = users.length;

  // setelah array data didapatkan, data di potong berdasarkan ketentuan di start dan end index
  const data = users.slice(startIndex, endIndex).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  // memberi respons jumlah banyak page yang telah di kalkulasi dari pagination dan total data yang ada
  const totalPages = Math.ceil(totalItems / pageSize);

  // memeriksa apakah terdapat page sebelumnya (biasanya akan true apabila page number > 1 dan descending)
  const hasPreviousPage = pageNumber > 1;

  // memerksa apakah terdapat page selanjutnya (biasanya true apabila page size < total data)
  const hasNextPage = pageNumber < totalPages;

  // return untuk seluruh variabel yang dibutuhkan
  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: totalItems,
    total_pages: totalPages,
    has_previous_page: hasPreviousPage,
    has_next_page: hasNextPage,
    data: data,
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
