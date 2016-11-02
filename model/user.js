const { app } = require('electron'),
  async = require('async'),
  request = require('request'),
  Datastore = require('nedb'),
  path = require('path')

// const DIS = require('./dis.js')

class User {
  constructor() {
    console.log(path.resolve(app.getPath('userData'), './newty_user_db'))
    this.db_User = new Datastore(path.resolve(app.getPath('userData'), './newty_user_db'))
    // this.db_DIS = new Datastore(path.resolve(app.getPath('userData'), './newty_dis_db'))
  }

  initialize(callback) {
    let asyncFuncs = []

    asyncFuncs.push((cb)=> {
      this.db_User.loadDatabase((error)=> {
        if (error) return cb(true, null)
        this.db_User.find({}, (error, docs)=> {
          if (error) return cb(true, null)
          if (docs.length) return cb(null, null)
          this.db_User.insert({ // create new user
            password: '',
            email: ''
          }, function(error, newDoc) {
            if (error) return cb(true, null)
            else return cb(null, null)
          })
        })
      })
    })

    async.parallel(asyncFuncs, (error, results)=> {
      callback(error)
    })
  }

  saveUserInfo(data) {
    const {email, password} = data
    this.db_User.update({}, {email, password}, {}, function(error, numReplaced) {
      console.log(error, numReplaced)
    })
  }

  getUserInfo(callback) {
    this.db_User.findOne({}, function(error, doc) {
      if (error || !doc) return callback(true)
      else return callback(null, doc)
    })
  }
}

const user = new User()

module.exports = user