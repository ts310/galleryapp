// = require swipeview

;(function($, _, Backbone){

  var PhotoModel = Backbone.Model.extend({
  });

  var PhotoCollection = Backbone.Collection.extend({
    model: PhotoModel,
    parse: function(response) {
      return response.data;
    },
    url: function() {
      return '/gallery/data/';
    }
  });

  var GalleryView = Backbone.View.extend({
    el: '#gallery',

    initialize: function() {
      // this.tpl = $('#gallery_index').html();
      this.photo = new PhotoModel();
      this.photos = new PhotoCollection();
      return this;
    },

    render: function(){
      var self = this;
      this.photos.fetch({
        success: function(collection, response) {
          console.log([ collection, response ]);
          self.slides = collection.models;
          self.flickview();
        },
        error: function(collection, response) {
          console.log([ collection, response ]);
        }
      });

      return this;
    },

    flickview: function() {
      var	gallery,
        el,
        i,
        page,
        slides = [];

      slides = this.slides;

      gallery = new SwipeView('#gallery', { numberOfPages: slides.length });

      // Load initial data
      for (i=0; i<3; i++) {
        page = i==0 ? slides.length-1 : i-1;
        el = document.createElement('img');
        el.className = 'loading';
        el.src = slides[page].attributes.images.low_resolution.url;
        el.onload = function () { this.className = ''; }
        gallery.masterPages[i].appendChild(el);
      }

      gallery.onFlip(function () {
        var el,
          upcoming,
          i;

        for (i=0; i<3; i++) {
          upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;

          if (upcoming != gallery.masterPages[i].dataset.pageIndex) {
            el = gallery.masterPages[i].querySelector('img');
            el.className = 'loading';
            el.src = slides[upcoming].attributes.images.low_resolution.url;
          }
        }
      });

      gallery.onMoveOut(function () {
        gallery.masterPages[gallery.currentMasterPage].className = 
          gallery.masterPages[gallery.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
      });

      gallery.onMoveIn(function () {
        var className = gallery.masterPages[gallery.currentMasterPage].className;
        /(^|\s)swipeview-active(\s|$)/.test(className) || (gallery.masterPages[gallery.currentMasterPage].className = !className ?
          'swipeview-active' : className + ' swipeview-active');
      });
    }
  });

  var AppRouter = Backbone.Router.extend({
    routes:{
      "": "index",
      "photo:id": 'view'
    },

    index: function() {
      var view = new GalleryView();
      view.initialize();
      view.render();
    },

    view: function(id) {
    }
  });

  $(function(){
    var app = new AppRouter();
    try {
      Backbone.history.start();
    } catch (ex) {}
  });

})(jQuery, _, Backbone);
