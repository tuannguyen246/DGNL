var mongoose = require('mongoose');
var config = require('../../../config/index');
var moment = require('moment');

module.exports = router => {
  router.get('/:districtSlug/:wardSlug/:mevnahSlug', function(req, res, next) {
    mongoose.model('districts').findOne({districtSlug: req.params.districtSlug}, (err, districtInfo) => {
      if (err) throw err;
      let query = {
        districtsID: districtInfo._id,
        wardSlug: req.params.wardSlug,
      }
      mongoose.model('wards').findOne(query, (err, wardInfo) => {
        if (err) throw err;
        let query = {
          districtsID: districtInfo._id,
          wardsID: wardInfo._id,
          slug: req.params.mevnahSlug,
          isBanned: false,
        }
        mongoose.model('mevnah').findOne(query, (err, mevnahInfo) => {
          if (err) throw err;
          if (mevnahInfo) {
            let currentDate = new Date();
            let query = {
              refMevnah: mevnahInfo._id,
              // description: {
                
              //     timeShow: {
              //       "$lte": currentDate.toISOString(),
              //     },
              //     timeEnd: {
              //       "$gte": currentDate.toISOString(),
              //     },
                
              // }
            }
            
            mongoose.model('notification').findOne(query)
            .where('description.timeShow').lte(currentDate)
            .where('description.timeEnd').gte(currentDate)
            .exec((err, notification) => {
              if (err) throw err;
              res.render('mevnah/homepage/index', {
                mevnah: mevnahInfo,
                notification: notification ? notification : false,
              })
             
            })
          } else {
            res.render('directPage', { 
              title: 'Chuyển hướng trang',
              linkDirectTo: config.SERVERURL
            });
          }
        })
      })
    })
  });
}