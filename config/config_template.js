let config = {
  db_connection:'....',
  db_user:'....',
  db_password:'....',
  db:'....'
}

exports.getDatabaseURI = function(){
  let uri = config.db_connection;
  uri = uri.replace('<USERNAME>', config.db_user);
  uri = uri.replace('<PASSWORD>', config.db_password);
  uri = uri.replace('<DB>', config.db);
  return uri;
}
