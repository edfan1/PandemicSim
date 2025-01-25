import random 

class Person:
    def __init__(self, name, age, occupation, init_status = 'S'):
        self.name = name
        self.age = age
        self.status = init_status
        self.infected_time = 0.0
        self.occupation = occupation

    def infect(self, rate):
        if (random.random() < rate):
            self.status = 'I'
            return True
        return False
    
    def sick(self):
        self.infected_time += (1.0/24.0)
        if (self.infected_time >= 12.0):
            self.status = 'R'
        elif (random.random() < 0.05/24):
            self.health_status = 'D'

    def recover(self):
        self.status = 'R'

    def __str__(self):
        return f"Person(name={self.name}, age={self.age}, health_status={self.status}, occupation={self.occupation})"