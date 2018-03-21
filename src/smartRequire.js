/*
  Smart require is basically a root require but you
  can do dependency injection here if u want

*/
global.smartRequire = function(name) {
  if (name == 'mail') {
    if (process.env.NODE_ENV == 'test') {
      return smartRequire('lib/mail/default');
    } else {
      return smartRequire('lib/mail/sparkpost');
    }
  }
  if (name == 'auth') {
    return smartRequire('services/auth');
  }
  if (name == 'ormModelPath') {
    return __dirname + '/services/orm/models';
  }
  if (name == 'orm') {
    return smartRequire('services/orm/sequelize').orm;
  }
  if (name == 'sequelize') {
    return smartRequire('services/orm/sequelize').sequelize;
  }
  return require(__dirname + '/' + name);
};
