var breadcrumbs = {

  $currentSection: null,
  ACTIVE_CLASS: 'is-scrolled-in-section',


  init: function() {
    this.body = document.querySelector('body');
    this.breadcrumb = document.querySelector('.js-breadcrumb');
    this.sections = document.querySelectorAll('.js-section');
    this.title = document.querySelectorAll('.js-title');
    this.navLinks = document.querySelectorAll('.js-link');

    this.scroll();
    this.events();
  },


  scroll: function() {

    var i = 0;
    var l = this.sections.length;
    var view = window.scrollY;

    this.$currentSection = null;

    for(; i<l; i++){
      if(view >= this.sections[i].offsetTop) {
        this.$currentSection = i;
      }
    }

    this.setActive();
    this.setBreadcrumb();
  },


  setActive: function(){

    var i = 0;
    var l = this.navLinks.length;

    for(; i<l; i++){
      if (i == this.$currentSection) {
        this.navLinks[i].classList.add('active');
      } else {
        this.navLinks[i].classList.remove('active');
      }
    }
  },

  setBreadcrumb: function(){

    if (this.$currentSection != null) {
      this.body.classList.add(this.ACTIVE_CLASS);
      this.breadcrumb.innerText = this.title[this.$currentSection].innerText;
    } 

    if (this.$currentSection == null) {
      this.body.classList.remove(this.ACTIVE_CLASS);
      this.breadcrumb.innerText = '';
    }

  },

  // scrollTo: function(){
    
  //   var i = 0;
  //   var l = .length;

  //   for(; i<l; i++){
  //     window.scrollTo(0, this.sections[i]offsetTop);
  //   }
  // },

  events: function() {
    window.addEventListener('scroll', this.scroll.bind(this));
  }
};

document.addEventListener('DOMContentLoaded', breadcrumbs.init.bind(breadcrumbs));