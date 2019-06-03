
module.exports={
    // database:'mongodb://localhost:27017/geyser',
    database:'mongodb://solar:G1moss@ds231961.mlab.com:31961/solar_geyser',
    port:process.env.PORT || 3002,
    secret:'Pa$$w0rd',
    cookieKey:'jhbsakjyfio463asydfhbfbiaw43oiufsbubfhhayyrbrr423246fsjd62hbjkjfs',
    google:{
        clientID: '265358910079-28hk3fa0h3bgncjeem16bgbgfpsjmn5t.apps.googleusercontent.com',
        clientSecret: 'GEgg5fEG8eyeeVmCCPsEmbav',
        callbackURL: '/auth/google/login/callback'        
    },
    facebook:{
        clientID: '207164593341407',
        clientSecret: 'cb7ee9ba33a737653f9cf3df132f53ac',
        profileFields:['id', 'name', 'displayName', 'picture', 'email', 'gender'],
        callbackURL: '/auth/facebook/login/callback'
    }
}