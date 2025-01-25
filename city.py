from building_params import *
from people_params import *
from building import Building
import random
from datetime import datetime, timedelta

workplaces = ['restaurant', 'office', 'store', 'hospital', 'school']
leisures = ['restaurant', 'store']

class City: 
    def __init__(self):
        self.clock = datetime(2025, 1, 1, 6, 0, 0)
        self.city = {
            'restaurant': [],
            'hospital': [],
            'school': [],
            'office': [],
            'home': [],
            'store': [],
        }

    def update_city(self):
        self.clock += timedelta(hours=1)
        for types in self.city.keys():
            for building in self.city[types]:
                building.update()
                building_update_fn[types](building, self.clock.hour, self)

    def get_counts(self):
        counts = {
            'susceptible': 0,
            'infected': 0,
            'recovered': 0
        }
        for buildings in self.city.values():
            for building in buildings:
                counts['susceptible'] += building.sus
                counts['infected'] += building.inf
                counts['recovered'] += building.rec
        return counts
            
    def get_workplace(self, person):
        workplace = random.choice(self.city[random.choice(workplaces)])
        while not workplace.add_employee(person):
            workplace = random.choice(self.city[random.choice(workplaces)])
        return workplace

    def get_learning_institution(self, person):
        school = random.choice(self.city['school'])
        while not school.add_employee(person):
            school = random.choice(self.city['school'])
        return school

    def get_leisure(self):
        leisure = random.choice(self.city[random.choice(leisures)])
        while leisure.is_full():
            leisure = random.choice(self.city[random.choice(leisures)])
        return leisure

    def construct_building(self, building_type):
        building_params = building_construct[building_type]
        self.city[building_type].append(Building(building_params['name'], building_params['capacity'], building_params['staff'], building_params['type'], building_params['infection_rate']))

    def construct_person(self, person_type):
        person_params = person_construct[person_type]
        return Person(person_params['name'], person_params['age'], person_params['occupation'])

    def add_home(self, adults = 2, children = 2):
        home_params = building_construct['home']
        home = Building(home_params['name'], home_params['capacity'], home_params['staff'], home_params['type'], home_params['infection_rate'])
        for i in range(adults):
            person = self.construct_person('worker')
            person.home = home
            person.set_employment(self)
            home.add_occupant(person)
        for i in range(children):
            person = self.construct_person('child')
            person.home = home
            person.set_employment(self)
            home.add_occupant(person)
        self.city['home'].append(home)

    def inject_patient_zero(self):
        patients_home = random.choice(self.city['home'])
        patients_home.sus -= 1
        patients_home.inf += 1
        patients_home.occupants[0].status = 'I'