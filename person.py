import random 

class Person:
    def __init__(self, name, age, init_status):
        self.name = name
        self.age = age
        self.status = init_status
        self.infected_time = 0

    def __repr__(self):
        return f"Person(name={self.name}, age={self.age}, health_status={self.health_status})"

    def infect(self):
        if (random.random() < 0.15):
            self.health_status = 'I'
    
    def sick(self):
        self.infected_time += 1
        if (self.infected_time == 10):
            self.health_status = 'R'
        elif (random.random() < 0.05):
            self.health_status = 'D'

    def recover(self):
        self.health_status = 'R'