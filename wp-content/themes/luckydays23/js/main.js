$(document).ready(function() {
	$(function() {
		jcf.replaceAll(); 
	});


//MOBILE MENU
$('.open-menu').click(function(){
	$('.overlay-menu').animate({ "left" :"0" },250);
});
$('.overlay-close').click(function(){
	$('.overlay-menu').animate({ "left" :"100%" },250);
});


//HOME BANNER
jQuery('.sliderhome').slick({
	dots: false,
	slidesToShow: 1,
	slidesToScroll: 1,
	adaptiveHeight: true,
	autoplay: true,
	autoplaySpeed: 3000
});

jQuery('.winner-slider').slick({
	dots: false,
	fade: true,
	slidesToShow: 1,
	slidesToScroll: 1,
});

jQuery('.banner-slider').slick({
	dots: false,
	arrows:false,
	slidesToShow: 1,
	slidesToScroll: 1,
});

$('.prize-main-slider').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	dots:false,
	fade: true,
	centerMode: false,
	adaptiveHeight: true,
	asNavFor: '.prize-thumb-slider'
});
$('.prize-thumb-slider').slick({
	slidesToShow:4,
	slidesToScroll: 1,
	asNavFor: '.prize-main-slider',
	arrows:true,
	dots: false,
	focusOnSelect: true,
	centerMode: false
});



		//MY ACCOUNT MENU
		$('#tab_selector').on('change', function (e) {
			window.location = $(this).val();
		});
		
		//$('.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--orders a').attr('href','/my-account/my-orders');


		//LOTTERY
		$('.lottery-time.countdown').appendTo('.product-time').show();
		$('#lottery_answer_drop').addClass('custom-select');
		$('button.single_add_to_cart_button').html('Enter Now').show();



		//RANGE SLIDER
		var $range = $(".js-range-slider"),
		$btn_minus = $(".slidecontainer-decrease"),
		$btn_plus = $(".slidecontainer-increase"),
		min = $(this).data('min'),
		max = $(this).data('max'),
		step = 1,
		from = 1;

		$range.ionRangeSlider({
			type: "single",
			skin: "round",
			min: min,
			max: max,
			step: step,
			from: from,
			onFinish: function(data) {
				from = data.from;
			}
		});

		$btn_minus.on("click", function() {
			updateRange(-1);
		});

		$btn_plus.on("click", function() {
			updateRange(1);
		});

		var range_instance = $range.data("ionRangeSlider");

		var updateRange = function(direction) {
			from += step * direction;
			if (from < min) {
				from = min;
			} else if (from > max) {
				from = max;
			}

			range_instance.update({
				from: from
			});
		};



		//PRODUCT GRID COUNTDOWN TIMERS
		$('.grid-countdown').each(function() {

			var item = $(this);
			var countDownDate = new Date( $(this).data('time') ).getTime();

			var x = setInterval(function() {

				var now = new Date().getTime();
				var distance = countDownDate - now;

				var days = Math.floor(distance / (1000 * 60 * 60 * 24));
				var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((distance % (1000 * 60)) / 1000);

				$(item).html( '<div>' + days + '<span>days</span></div><div>' + hours + '<span>hr</span></div><div>' + minutes + '<span>min</span></div><div>' + seconds + '<span>sec</span></div>' );
					//$(item).html('Time remaining: '+hours+':'+minutes+':'+seconds);

					if (distance < 0) {
						clearInterval(x);
						$(item).html('Finished');
					}
				}, 1000);

		});

		setTimeout(function() { $('.grid-countdown').fadeTo(250,1); },1000);



//UPSELL POPUP
if ( $('.lc-popup').length ) {
	
	$('.lc-popup').delay(500).fadeIn(300);

	$(document).mouseup(function(e) {
		var container = $(".lc-popup-inner");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			$('.lc-popup').fadeOut(300);
		} 
	});

}

$('.lc-close').on('click',function() {
	$('.lc-popup').fadeOut(300);
});


//ANSWERS
$('.answers-list li').on('click',function() {
	$('.answers-list li').removeClass('answer-active');
	$(this).find('input[type="radio"]').prop('checked', true);
	$(this).addClass('answer-active');
});



});


