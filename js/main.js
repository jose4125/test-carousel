/*
author: jose david lombana
mail: jose4125@hotmail.com
twitter: @jose4125
*/
(function ($, undefined) {
  $(document).ready(init);
  var config = {
    url: 'js/gallery_json.js',
    header: '.header',
    slide: '.cont-photo img',
    thumbs: '.footer'
  }
  function Carousel (url) {
    this.url = url;
    this.data = {};
    this.count= 0;
  }
  Carousel.prototype.getData = function (){
    return this.data;
  }
  Carousel.prototype.setTitle = function (header, title) {
    $(header).text(title);
  }
  Carousel.prototype.getThumbs = function (data) {
    return data.map(function (item){
      return item.thumb_url;
    })
  }
  Carousel.prototype.thumbnails = function (container, thumbs) {
    var self = this;
    var list = '<% _.forEach(thumbs, function(img) { %><li><img src="<%= img %>"></li><% }); %>';
    var tmpl = _.template(list, { 'thumbs': thumbs });
    $(container).append(tmpl);
    $(container).on('click', 'li', function(event){
      console.log('click', $(event.currentTarget).index());
      self.count = $(event.currentTarget).index();
      self.slide(config.slide);
    });
  }
  Carousel.prototype.slide = function (container) {
    console.log('slide');
    var element = $(container);
    var description = 'Taken at the ' + this.data.photos[this.count].title + ' in ' + this.data.photos[this.count].location + ' on ' + this.data.photos[this.count].date
    element.attr({
      'src': this.data.photos[this.count].image,
      'alt': this.data.photos[this.count].title
    });
    element.parents('.container').find('.text').text(description);

    this.activeThumbs();
  }
  Carousel.prototype.activeThumbs = function () {
    var element = $(config.thumbs);
    element.find('li').removeClass('active');
    element.find('li').eq(this.count).addClass('active');
  }
  Carousel.prototype.arrows = function (container) {
    var parent = $(container).parents('.cont-slide');
    var self = this;
    parent.on('click', '.left-arrow, .right-arrow', function (event) {
      console.log('event', event);
      var currentClass = $(event.currentTarget).attr('class');
      console.log('class', currentClass);
      if (currentClass === "left-arrow") {
        self.leftArrow();
      }else {
        self.rightArrow();
      }
    })
  }
  Carousel.prototype.leftArrow = function () {
    console.log('left');
    if(this.count > 0) {
      this.count -= 1;
    }else {
      this.count = this.data.photos.length -1;
    }
    this.slide(config.slide);
    
  }
  Carousel.prototype.rightArrow = function () {
    console.log('right', this.count);
    if(this.count < (this.data.photos.length -1)) {
      this.count += 1;
    }else {
      this.count = 0;
    }
    console.log('right', this.count);
    this.slide(config.slide);
  }
  Carousel.prototype.getImage = function (){
    var self = this;
    return $.ajax({
      url: this.url,
      type: 'GET',
      dataType: 'json'
    })
    .success(function (data) {
      /*console.log('data', data);*/
      self.data = data;
    })
    .error(function (request, status, error) {
      console.log('req', request);
      console.log('status', status);
      console.log('error', error);
    })
  }
  function init () {
    var carousel = new Carousel(config.url);
    var imagesData = carousel.getImage();
    imagesData.then(function distributeData() {
      var data = carousel.getData();
      carousel.setTitle(config.header, data.album.name);
      var thumbs = carousel.getThumbs(data.photos);
      carousel.thumbnails(config.thumbs, thumbs);
      carousel.slide(config.slide, data.photos);
      carousel.arrows(config.slide);
    })
  }

})(jQuery, undefined)
