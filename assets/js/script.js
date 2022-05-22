$(function(){
    var swiper = new Swiper("#bigbanner", {
        slidesPerView: 1,
        spaceBetween: 1,
        loop: true,

        autoplay: {
          delay: 25000,
          disableOnInteraction: false,
          reverseDirection:true,
        },
        // pagination: {
        //   el: ".swiper-pagination",
        //   clickable: true,
        // },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
      });
      var typed = new Typed('#typed', {
        stringsElement: '#typed-strings',
        loop: true,
        typeSpeed: 40,
        showCursor: false,
      });

      var SloganTxt = new Typed('#sloganAct', {
        stringsElement: '#SloganTxt',
        loop: true,
        typeSpeed: 40,
        showCursor: false,
      });
      // $(selector).countMe(delay,speed)
      $("#greenNumberCounter").countMe(40,10);
      var tween = KUTE.fromTo('#firstPath', {path: '#firstPath' }, { path: '#therdPath' },{repeat: 9999,yoyo: true}).start();
      var Ftween = KUTE.fromTo('#FfirstPath', {path: '#FfirstPath' }, { path: '#FtherdPath' },{repeat: 9999,yoyo: true}).start();
      var Stween = KUTE.fromTo('#SfirstPath', {path: '#SfirstPath' }, { path: '#StherdPath' },{repeat: 9999,yoyo: true}).start();

      

});
