pydmFiltr.formatDate = function(){
	/*return function(input){

		return moment(input, "YYYYMMDD").fromNow();
	}*/
	return function(input) {
    	m = moment(input);

    	if (m.isValid()){
      		return m.fromNow();
    	} else {
      		return input;
    	}
  };
}