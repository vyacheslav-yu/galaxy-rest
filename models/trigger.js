function randomArrayElement(array) {
	if (array.length === 0) {
		throw 'array is empty';
	}

	if (array.length === 1) {
		return array[0];
	}

	return array[Math.floor(Math.random() * array.length)];
}

function Trigger() {
	var STATES = {
			a : {
				b : 10,
				c : 150
			},
			b : {
				a : 50,
				c : 100
			},
			c : {
				a : 150,
				b : 100
			}
		},
		currentState = 'a',
		isMove = false,
		toState = null,
		moveStartTime = 0,
		moveFinishTime = 0;

	function getPercent(ut) {
		return ((ut - moveStartTime) / (moveFinishTime - moveStartTime) * 100).toFixed(2) + '%';
	}

	this.isMove = function() {
		if (isMove) {
			if (Date.now() > moveFinishTime) {
				isMove = false;
				currentState = toState;
				toState = null;
			}
		}

		return isMove;
	};

	this.getState = function() {
		var ut = Date.now();

		if (this.isMove()) {
			return {
					from    : currentState,
					to      : toState,
					eta     : moveFinishTime - ut,
					finish  : moveFinishTime,
					percent : getPercent(ut)
				}
		} else {
			return currentState;
		}
	};

	this.setState = function(state) {
		if (this.isMove() || ! STATES[state] || currentState === state) {
			return false;
		} else {
			toState        = state;
			isMove         = true;
			moveStartTime  = Date.now();
			moveFinishTime = moveStartTime + STATES[currentState][toState] * 100;
			return true;
		}
	};

	this.setRandomState = function() {
		if (! this.isMove()) {
			this.setState(randomArrayElement(Object.keys(STATES[currentState])));
			return true;
		}
		return false;
	}
}

module.exports.Trigger = Trigger;

