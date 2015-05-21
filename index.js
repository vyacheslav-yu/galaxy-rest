$(function() {
	var updateInterval;

	/**
	 * Обновить состояние модели
	 */
	function updateModel() {
		$.get('/rest/triggers/one', function(result) {
			applyState(JSON.parse(result));
		});
	}

	/**
	 * Применить результат (модель) к виду
	 *
	 * @param {string|{from:string, to:string, eta:number, finish:number, percent:string}} result
	 */
	function applyState(result) {
		defaultState();

		if (typeof result === 'string') {
			// clearInterval(updateInterval);
			$('#' + result).addClass('button_selected');
		} else {
			$('.button').addClass('button_disabled');
			$('.status__fill').css({width: result.percent});
			$('.item__time').text((result.eta/1000).toFixed(3));
			$('.status__text').text(result.percent);
		}

		$('.item').show();
	}

	/**
	 * Вид в состояние по умолчанию
	 */
	function defaultState() {
		$('.item__time').text((0).toFixed(3));
		$('.status__fill').css({width: '100%'});
		$('.status__text').text('100%');
		$('.button').removeClass('button_selected').removeClass('button_disabled');
	}

	/**
	 * По нажатию изменить состояние модели
	 */
	$('.button').click(function() {
		$('.button').addClass('button_disabled');
		$.get('/rest/triggers/one/' + this.id, function(result) {
			result = JSON.parse(result);
			if (result) {
				updateModel();
				autoUpdate();
			}
		});
	});

	/**
	 * Обновляем модель по интервалу
	 */
	function autoUpdate() {
		if (! updateInterval) {
			updateInterval = setInterval(function() {
				updateModel();
			}, 250);
		}
	}

	autoUpdate();

});