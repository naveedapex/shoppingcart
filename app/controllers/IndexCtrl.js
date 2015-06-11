exports.render = function(req, res) {
  //  var username=req.session&& req.session.currentUser? req.session.currentUser.username:null;
  //  res.render('index', {user:username});
  console.log('../'+__dirname);
 res.sendfile('main.html',{'root':__dirname + '/../../public'});
 //res.send(200);
};