var AppDispatcher = require('./dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('merge');
var Api = require('./api/ServerApi.js');

var _data = Api.getArticles();
function loadData(data) {
  _data = data;
};
function loadArticle(article) {
  _data.forEach(function (art, index) {
    if (art.id == article.id) {
      Api.setArticle(article, index);
    } else {}
  });
};

var CHANGE_EVENT = "change";

var ArticleStore = merge({}, EventEmitter.prototype, {

  findById: function (id) {
    return Api.getArticle(id);
  },

  getData: function () {
    return _data;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
  * @param {function} callback
  */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
  * @param {function} callback
  */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function (action) {
  var type = action.actionType;
  switch (type) {
    case "LIST_FETCHED":
      loadData(action.data);
      ArticleStore.emitChange();
      break;
    case "ARTICLE_FETCHED":
      console.log(action.data);
      loadArticle(action.data);
      ArticleStore.emitChange();
      break;
  }
});

module.exports = ArticleStore;
