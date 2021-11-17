from locust import HttpUser, task

class HelloWorldUser(HttpUser):
    @task
    def hello_world(self):
            self.client.get('/v1/user/self', auth=('anish1@gmail.com', 'pass'))