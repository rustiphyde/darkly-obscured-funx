const isEmail = email => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
  };
  
  const isEmpty = string => {
    if (string.trim() === "") return true;
    else return false;
  };
  
  exports.validateEmailSignupData = data => {
    let errors = {};
  
    if (isEmpty(data.email)) {
      errors.email = "Field must not be empty";
    } else if (!isEmail(data.email)) {
      errors.email = "Field value must be a valid email address";
    }
  
    if (isEmpty(data.password)) errors.password = "Field must not be empty";
    if (data.confirmPassword !== data.password)
      errors.confirmPassword = "Password fields must match";
    if (isEmpty(data.alias)) errors.alias = "Field must not be empty";
  
    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  };

  exports.validateInvestigatorSignupData = data => {
    let errors = {};
    let address = data.email.slice(-14).toLowerCase();
    
    if (isEmpty(data.email)) {
      errors.email = "Field must not be empty";
    } else if (!isEmail(data.email)) {
      errors.email = "Field value must be a valid email address";
    } else if (address !== "dopi@gmail.com"){
      errors.email = "Investigators must sign up with their official MGPRS email"
    }
  
    if (isEmpty(data.password)) errors.password = "Field must not be empty";
    if (data.confirmPassword !== data.password)
      errors.confirmPassword = "Password fields must match";
    if (isEmpty(data.first)) errors.first = "Field must not be empty";
    if (isEmpty(data.last)) errors.last = "Field must not be empty";
  
    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  };
  
  exports.validateEmailLoginData = data => {
    let errors = {};
  
    if (isEmpty(data.email)) errors.email = "Field must not be empty";
    if (isEmpty(data.password)) errors.password = "Field must not be empty";
  
    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  };

  exports.validateInvestigatorLoginData = data => {
    let errors = {};
    let address = data.email.slice(-14).toLowerCase();
  
    if (isEmpty(data.email)) errors.email = "Field must not be empty";
    else if (address !== "dopi@gmail.com"){
      errors.email = "Investigators must login with their official MGPRS email"
    }
    if (isEmpty(data.password)) errors.password = "Field must not be empty";
  
    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  };
  
  exports.reduceInvestigatorDetails = data => {
    let userDetails = {};
    //Make sure an empty string is not submitted to the database
    
    if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if (!isEmpty(data.location.trim())) userDetails.location = data.location;
  
    return userDetails;
  };
  
  exports.validateResetData = data => {
    let errors = {};
  
    if (isEmpty(data.email)) errors.email = "Field must not be empty";
  
    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  };

  exports.validateIPWData = data => {
    let errors = {};
  
    if (isEmpty(data.ipw)) errors.ipw = "Field must not be empty";
  
    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
  };