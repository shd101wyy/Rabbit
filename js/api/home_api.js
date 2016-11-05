const url = require('url')

const homeAPI = {
  search: function(searchText, callback) {
    $.ajax(url.resolve(IP, `/search?q=${encodeURI(searchText)}`), {
      'type': 'GET',
      dataType: 'json',
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

  getSubscriptions: function(callback) {
    $.ajax(url.resolve(IP, '/get_subscriptions'), {
      'type': 'GET',
      dataType: 'json',
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


  follow: function(source, callback) {
    $.ajax(url.resolve(IP, '/follow'), {
      'type': 'POST',
      dataType: 'json',
      data: {
        source
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

  unfollow: function(source, callback) {
    $.ajax(url.resolve(IP, '/unfollow'), {
      'type': 'POST',
      dataType: 'json',
      data: {
        source
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

  getFeeds: function({source, page=0, count=10}, callback) {
    $.ajax(url.resolve(IP, `/get_feeds?source=${encodeURIComponent(source)}&page=${page}&count=${count}`), {
      'type': 'GET',
      dataType: 'json',
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

  postFeed: function(feedData, callback) {
    $.ajax(url.resolve(IP, '/post_feed'), {
      'type': 'POST',
      dataType: 'json',
      data: {
        feedData: JSON.stringify(feedData)
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

  getDISInfo(source, callback) {
    $.ajax(url.resolve(IP, `/get_dis_info?source=${encodeURIComponent(source)}`), {
      'type': 'GET',
      dataType: 'json',
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

  getTrendingTopics({page=0, count=10}, callback) {
    $.ajax(url.resolve(IP, `/get_trending_topics?page=${page}&count=${count}`), {
      'type': 'GET',
      dataType: 'json',
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

  getTopSubscriptions({page=0, count=10}, callback) {
    $.ajax(url.resolve(IP, `/get_top_subscriptions?page=${page}&count=${count}`), {
      'type': 'GET',
      dataType: 'json',
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
  }

}

export default homeAPI