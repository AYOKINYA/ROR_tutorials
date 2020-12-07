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

Helper.make_room = function (s1, s2) {
	console.log(s1 + "_" + s2);
	if (s1 < s2)
		return s1 + "_" + s2;
	return s2 + "_" + s1;
}

Helper.print = function(msg) {
	console.log(msg)
}

export default Helper;