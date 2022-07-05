const validator = require('validator');

exports.email = (email) => {
  // Default options: { allow_display_name: false, require_display_name: false, allow_utf8_local_part: true, require_tld: true, allow_ip_domain: false, domain_specific_validation: false, blacklisted_chars: '', host_blacklist: [] }
  const options = {};
  return validator.isEmail(email, options);
};

exports.password = (password) => {
  // Default options: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
  const options = { minLength: 0, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 };
  return validator.isStrongPassword(password, options);
};
