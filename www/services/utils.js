function saveLocal(key, data) {
	localStorage[key] = JSON.stringify(data);
}

function getJSONLocal(key) {

	var result = null;
	try {
		var str_json = localStorage[key];

		if (str_json!==undefined) {
			
			result = JSON.parse(str_json);
		}

	} catch (e) {
		
	}

	return result;
}

function deleteLocal(key) {
	localStorage.removeItem(key);
}