class Building:
    def __init__(self, name, capacity):
        self.name = name
        self.capacity = capacity
        self.size = 0
        self.sus = 0
        self.inf = 0
        self.rec = 0
        self.occupants = []

    def add_occupant(self, person):
        if (self.size < self.capacity):
            self.occupants.append(person)
            self.size += 1
            if person.status == 'S':
                self.sus += 1
            elif person.status == 'I':
                self.inf += 1
            else:
                self.rec += 1

    def is_full(self):
        return self.size >= self.capacity
    
    def update(self):
        for person in self.occupants:
            if person.status == 'S':
                if person.infect(0.1 * self.sus / self.size / 24):
                    self.sus -= 1
                    self.inf += 1
            if person.status == 'I':
                person.sick()
                if person.status == 'R':
                    self.inf -= 1
                    self.rec += 1
                elif person.status == 'D':
                    self.occupants.remove(person)
                    self.size -= 1
                    self.inf -= 1

    def __str__(self):
        return f"Building(name={self.name}, capacity={self.capacity}, occupants={len(self.occupants)})"