const url = require('url')

const userAPI = {
  signup: function(email, userId, password, callback) {
    $.ajax(url.resolve(IP, '/api/signup'), {
      type: 'POST',
      dataType: 'json',
      data: {
        email,
        password,
        userId
      },
      success: function(res) {
        if (res && callback) {
          callback(res)
        } else if (callback) {
          callback(null)
        }
      },
      error: function(res) {
        if (callback) callback(res || null)
      }
    })
  },
  login: function(email, password, callback) {
    $.ajax(url.resolve(IP, '/api/login'), {
      type: 'POST',
      dataType: 'json',
      data: {
        email,
        password
      },
      success: function(res) {
        if (res && callback) {
          callback(res)
        } else if (callback) {
          callback(null)
        }
      },
      error: function(res) {
        if (callback) callback(res || null)
      }
    })
  },

  checkAuth: function(callback) {
    $.ajax(url.resolve(IP, '/auth'), {
      type: 'GET',
      dataType: 'json',
      success: function(res) {
        console.log('auth success', res)
        if (res && callback) {
          callback(res)
        } else if (callback) {
          callback(null)
        }
      },
      error: function(res) {
        if (callback) callback(res || null)
      }
    })
  },

  logout: function(callback) {
    $.ajax(url.resolve(IP, '/logout'), {
      type: 'GET',
      dataType: 'json',
      success: function(res) {
        console.log('auth success', res)
        if (res && callback) {
          callback(res)
        } else if (callback) {
          callback(null)
        }
      },
      error: function(res) {
        if (callback) callback(res || null)
      }
    })
  }
}

export default userAPI