import $ from "jquery"

const Helper = {};

Helper.ajax = function(url, data, method) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url,
			type: method,
			data: data
		})
		.done(resolve)
		.fail(reject);
	})
}

Helper.hi = function() {
	console.log("HI")
}

export default Helper;