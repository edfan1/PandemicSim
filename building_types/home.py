import random

def home_update_fn(building, time, city):
    if time == 9 or (time >= 17 and time <= 22):
        i = 0
        while i < building.size:
            person = building.occupants[i]
            if time == 9 and (person.occupation == 'student' or person.occupation == 'employed'):
                building.remove_occupant(person)
                person.employer.add_occupant(person)
                i -= 1
            else:
                if random.random() < 0.2:
                    building.remove_occupant(person)
                    city.get_leisure().add_occupant(person)
                    i -= 1
            i += 1