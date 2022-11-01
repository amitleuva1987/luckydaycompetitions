jQuery(document).ready(function($){

	$('#wc-lottery-pn').on('click','ul:not(.working) li.tn:not(.taken, .in_cart)',function(e){

		var max_qty = $('input[name=max_quantity]').val();
		var current_number = $( this );
		
		if( max_qty <= 0 && ! current_number.hasClass('selected')){
			$.alertable.alert(wc_lottery_pn.maximum_text);
			return;
		}
		if($('#wc-lottery-pn').hasClass('guest')){
			$.alertable.alert(wc_lottery_pn.logintext, { 'html' : true } );
			return;
		}
		
		$( this ).addClass('working');
		$( '.tickets_numbers_tab' ).addClass('working');

		var numbers = $( 'ul.tickets_numbers');
		var lottery_id = numbers.data( 'product-id' );
		var selected_number = $( this ).data( 'ticket-number' );

		$('html, body').css("cursor", "wait");
		numbers.addClass('working');

		jQuery.ajax({
			type : "get",
			url : woocommerce_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'wc_lottery_get_taken_numbers' ),
			data : { 'selected_number' : selected_number, 'lottery_id' : lottery_id, 'reserve_ticket' : wc_lottery_pn.reserve_ticket },
			success: function(response) {

				$( 'ul.tickets_numbers').children('li.tn').each(function(index, el) {
					if( jQuery.inArray( $( this ).data( 'ticket-number' ).toString(), response.taken ) !== -1){
						$( this ).addClass('taken');
					}
					if( jQuery.inArray( $( this ).data( 'ticket-number' ).toString(), response.in_cart ) !== -1){
						$( this ).addClass('in_cart');
					}
					if( jQuery.inArray( $( this ).data( 'ticket-number' ).toString(), response.reserved ) !== -1){
						$( this ).addClass('in_cart');
					}
				});
				if( jQuery.inArray( selected_number.toString(), response.taken ) > 0) {
					$.alertable.alert(wc_lottery_pn.sold_text);
					numbers.removeClass('working');
					$( '.tickets_numbers_tab' ).addClass('working');
					current_number.removeClass('working');
					return;
				}
				
				if( jQuery.inArray( selected_number.toString(), response.in_cart ) > 0) {
					$.alertable.alert(wc_lottery_pn.in_cart_text);
					numbers.removeClass('working');
					$( '.tickets_numbers_tab' ).addClass('working');
					current_number.removeClass('working');
					return;
				}

				if( jQuery.inArray( selected_number.toString(), response.taken ) === -1) {
					current_number.toggleClass('selected');
				}
				var lottery_tickets_numbers = $('input[name=lottery_tickets_number]').val();
				var lottery_tickets_numbers_array = [];
				if( lottery_tickets_numbers ) {
					lottery_tickets_numbers_array = lottery_tickets_numbers.split(',');	
				}
				if (current_number.hasClass('selected') && (jQuery.inArray(selected_number , lottery_tickets_numbers_array ) === -1)) {
					lottery_tickets_numbers_array.push( parseInt(selected_number) );
					$('input[name=lottery_tickets_number]').val( lottery_tickets_numbers_array.join(',') );
					$('input[name=max_quantity]').val( parseInt(max_qty) - 1);
				} else {
					lottery_tickets_numbers_array = jQuery.grep(lottery_tickets_numbers_array, function(value) {
					  return value != selected_number;
					});
					$('input[name=lottery_tickets_number]').val( lottery_tickets_numbers_array.join(',') );
					$('input[name=max_quantity]').val( parseInt(max_qty) + 1);
				}

				$('input[name=quantity]:not(#qty_dip)').val( parseInt(lottery_tickets_numbers_array.length) ).trigger('change');
				jQuery( document.body ).trigger('sa-wachlist-action',[response.taken,lottery_id, selected_number] );
				$('html, body').css("cursor", "auto");
				numbers.removeClass('working');
				$( '.tickets_numbers_tab' ).addClass('working');
				current_number.removeClass('working');

				if ( $('input[name=quantity]:not(#qty_dip)').val() > 0) { 
					$(':input[name=add-to-cart]').removeClass('lottery-must-pick');
				} else { 
					$(':input[name=add-to-cart]').addClass('lottery-must-pick');
				}
			},
			error: function() {
				numbers.removeClass('working');
				$( '.tickets_numbers_tab' ).addClass('working');
				current_number.removeClass('working');

			}
		});
		
		
	});


	$(document).on('click','.lottery-pn-answers li',function(e){
		var answer_id = $(this).data('answer-id');
		if($(this).hasClass('selected')){
			answer_id = -2;
		}
		$('input[name=lottery_answer]').val( parseInt(answer_id) );
		$(this).siblings("li.selected").removeClass("selected").removeClass("false");
		$(this).toggleClass("selected");

		if ( $('input[name=lottery_true_answers]').val() ) {
			lottery_true_answers = $('input[name=lottery_true_answers]').val().split(',');

			if( answer_id == -2) {
				$(':input[name=add-to-cart]').addClass('lottery-must-answer-true');
			}else if(jQuery.inArray( answer_id.toString(), lottery_true_answers ) === -1) {
				$(this).toggleClass('false');
				$(':input[name=add-to-cart]').addClass('lottery-must-answer-true');
			} else{
				$(':input[name=add-to-cart]').removeClass('lottery-must-answer-true');
			}
		}
		if ( $('input[name=lottery_answer]').val() > 0) {
			$(':input[name=add-to-cart]').removeClass('lottery-must-answer'); 
			$('#lucky-dip, .lucky-dip-button').prop('disabled', false).prop('title', '').attr('alt', '');

		} else { 
			$(':input[name=add-to-cart]').addClass('lottery-must-answer');
			$('#lucky-dip, .lucky-dip-button').prop('disabled', true).prop('title', wc_lottery_pn.please_answer).attr('alt', wc_lottery_pn.please_answer);
		}
	});
	$(document).on('change','#lottery_answer_drop',function(e){
		var answer_id = $(this).val();
		$('input[name=lottery_answer]').val( parseInt(answer_id) );
		if ( $('input[name=lottery_true_answers]').val() ) {
			lottery_true_answers = $('input[name=lottery_true_answers]').val().split(',');
			
			if( jQuery.inArray( answer_id.toString(), lottery_true_answers ) === -1) {
				$(this).toggleClass('false');
				$(':input[name=add-to-cart]').addClass('lottery-must-answer-true');
			} else{
				$(':input[name=add-to-cart]').removeClass('lottery-must-answer-true');
			}
		}
		if ( $('input[name=lottery_answer]').val() > 0) {
			$(':input[name=add-to-cart]').removeClass('lottery-must-answer'); 
			$('#lucky-dip, .lucky-dip-button').prop('disabled', false).prop('title', '').attr('alt', '');

		} else { 
			$(':input[name=add-to-cart]').addClass('lottery-must-answer');
			$('#lucky-dip, .lucky-dip-button').prop('disabled', true).prop('title', wc_lottery_pn.please_answer).attr('alt', wc_lottery_pn.please_answer);
		}
	});


	$(document).on('submit','.cart.pick-number', function(e){
		var message = '';
		var pass = true;
		if ( $(':input[name=add-to-cart]').hasClass('lottery-must-pick') ){
			message = message + wc_lottery_pn.please_pick;
			pass = false;
		}
		if ( $(':input[name=add-to-cart]').hasClass('lottery-must-answer') ){
			message = message + wc_lottery_pn.please_answer;
			pass = false;
		}
		if ( $(':input[name=add-to-cart]').hasClass('lottery-must-answer-true') ){
			message = message + wc_lottery_pn.please_true_answer;
			pass = false;
		}
		if ( pass == false ){
			$.alertable.alert(message).always(function() {
				$('.cart.pick-number').find(':submit').removeClass('loading');
			});
			e.preventDefault();
		}

	});
	$(document).on('click','.lucky-dip-button',function(e){
		e.preventDefault();
		if ( $(':input[name=add-to-cart]').hasClass('lottery-must-answer-true') ){
			$.alertable.alert(wc_lottery_pn.please_true_answer)
			return;
		}
		var lottery_answer = false;
		var numbers = $( 'ul.tickets_numbers');
		var lottery_id = $(this).data( 'product-id' );
		var qty = parseInt( $(this).parent().find('input[name="qty_dip"]').val() );
		var max_qty = parseInt( $('input[name=max_quantity]').val() );
		var new_max_qty = max_qty - qty;
		if( max_qty <= 0 ){
			$.alertable.alert(wc_lottery_pn.maximum_text);
			return;
		}
		if (  qty > max_qty ){
			$.alertable.alert(wc_lottery_pn.maximum_add_text +' '+ max_qty);
			return;
		}
		if ( $('input[name=lottery_answer]').val() > 0) {
			lottery_answer = $('input[name=lottery_answer]').val();
		}
		$('.qty.lucky-dip').attr('max', new_max_qty)
		$('input[name=max_quantity]').val(new_max_qty)
		if ( new_max_qty < 1 ){
			$('div.lucky_dip button').prop('disabled', true);
		}
		jQuery.ajax({
			type : "get",
			url : woocommerce_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'wc_lottery_lucky_dip' ),
			data : { 'lottery_id' : lottery_id, 'lottery_answer' : lottery_answer,'qty' : qty},
			success: function(response) {
				$.alertable.alert( response.message, { html : true } );
				jQuery.each(response.ticket_numbers, function(index, value){
					$( 'li.tn[data-ticket-number=' + value + ' ]' ).addClass('in_cart');
				});
				jQuery( document.body).trigger('lottery_lucky_dip_finished',[response,lottery_id] );
				$('input[name=max_quantity]').val( parseInt(new_max_qty));
				$('.qty.lucky-dip').val('1');
				$(document.body).trigger('wc_fragment_refresh');
				$(document.body).trigger('added_to_cart');
			},
			error: function() {

			}
		});
		$(document.body).trigger('wc_fragment_refresh');
		$(document.body).trigger('added_to_cart');

		e.preventDefault();
	});

});