import random

def hospital_update_fn(building, time, city):
    if building.closed and (time == 0 or time == 12):
        i = 0
        while i < building.size:
            person = building.occupants[i]
            if random.random() < 0.5:
                building.remove_occupant(person)
                person.home.add_occupant(person)
                i -= 1
            i += 1