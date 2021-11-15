const SDC = require('statsd-client');
const metrics = new SDC({port:8125});

//Counter for user
metrics.increment("User.POST.newUser");
metrics.increment("User.PUT.updateUser");
metrics.increment("User.GET.getUser");

//Timer for user
metrics.timing("User.POST.newUser");
metrics.timing("User.PUT.updateUser");
metrics.timing("User.GET.getUser");

metrics.timing("User.POST.databaseNewUser");
metrics.timing("User.PUT.databaseUpdateUser");
metrics.timing("User.GET.databaseGetUser");

//Counter for image upload
metrics.increment("Image.POST.newUserImage");
metrics.increment("Image.GET.getUserImage");
metrics.increment("Image.DELETE.deleteUserImage");

//Timer for image
metrics.timing("Image.POST.newUserImage");
metrics.timing("Image.GET.getUserImage");
metrics.timing("Image.DELETE.deleteUserImage");

metrics.timing("Image.POST.databaseNewUserImage");
metrics.timing("Image.GET.databaseGetUserImage");
metrics.timing("Image.DELETE.databaseDeleteUserImage");

metrics.timing("Image.POST.S3NewUserImage");
metrics.timing("Image.DELETE.S3DeleteToCreateUserImage");
metrics.timing("Image.DELETE.S3DeleteUserImage");