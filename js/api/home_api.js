const homeAPI = {
  search: function(searchText, callback) {
    $.ajax('/search', {
      'type': 'POST',
      dataType: 'json',
      data: {
        searchText
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

  getHomePageData: function(callback) {
    $.ajax('/get_home_page_data', {
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
    $.ajax('/get_subscriptions', {
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
    $.ajax('/follow', {
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
    $.ajax('/unfollow', {
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
    $.ajax(`/get_feeds?source=${source}&page=${page}&count=${count}`, {
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
    $.ajax('/post_feed', {
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
}

export default homeAPI